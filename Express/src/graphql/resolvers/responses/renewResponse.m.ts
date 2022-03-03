import { AuditLogs, BusinessUnits, Categories, ComplianceItems, RegulatoryBodies, Responses } from "app-models";
import { GraphService } from "app-services";
import { getStatus, isPermitted } from "app-utils";
import { IChoice } from "src/interfaces/IQuestion";

const renewResponse = async (_, { _id }, { authorize, organization }) => {
  try {
    const user = await authorize();

    const response = await Responses.customFindById(_id, organization._id);
    if (!response) {
      throw new Error("Response doesn't exist");
    }

    if (!isPermitted({ user, action: 'responses.edit', data: { response } })) {
      throw new Error('User is not permitted');
    }

    const complianceItem = await ComplianceItems.customFindById(response.complianceItemId, organization._id);
    if (!complianceItem) {
      throw new Error("Compliance item assigned to response doesn't exist");
    }

    const createSnapshot = async () => {
      // Create a snapshot of response with all the details

      const businessUnit = await BusinessUnits.customFindById(response.businessUnitId, organization._id);
      const category = await Categories.customFindById(complianceItem.categoryId, organization._id);
      const regulatoryBody = await RegulatoryBodies.customFindById(complianceItem.regulatoryBodyId, organization._id);
      const usersIds = [
        response.responsibleId,
        response.accountableId,
        ...(response.contributorsIds || []),
        ...(response.followersIds || []),
      ];
      const users = await GraphService.getBasicUsers({ usersIds, organization });
      AuditLogs.customAudit({
        coll: 'responses',
        action: 'snapshot',
        element: {
          _id: response._id,
          name: complianceItem.name,
        },
        values: {
          response: {
            old: {
              value: {
                ...response,
                complianceItem: {
                  ...complianceItem,
                  category,
                  regulatoryBody,
                },
                businessUnit,
                lastRenewalDate: new Date(),
                responsible: users.find(({ _id }) => _id === response.responsibleId),
                accountable: users.find(({ _id }) => _id === response.accountableId),
                contributors: users.filter(({ _id }) => _id === response.contributorsIds?.includes(_id)),
                followers: users.filter(({ _id }) => _id === response.followersIds?.includes(_id)),
              },
              label: complianceItem.name,
            }
          }
        }
      }, user._id, organization._id);
    }
    createSnapshot();

    const newEvidence = [...response.evidence.filter(({ outdated }) => !outdated).map(({ name }) => ({ name }))];
    const newQuestions = [
      ...response.questions
        .filter(({ outdated }) => !outdated)
        .map(({ type, name, description, required, value }) => {
          if (type === "multipleChoice") {
            return {
              type,
              name,
              description,
              required,
              value: (value as IChoice[])?.map(choice => ({ ...choice, isCorrect: false }))
            };
          }
          return { type, name, description, required, value: null };
        })
    ];
    const nextStatus = getStatus(complianceItem.frequency || "");

    const updatedResponse = await Responses.customUpdateOne({ _id }, {
      lastRenewalDate: new Date(),
      attachments: response.attachments,
      status: nextStatus,
      evidence: [
        ...response.evidence.map(evidence => ({
          ...evidence,
          outdated: true,
        })),
        ...newEvidence,
      ],
      questions: [
        ...response.questions.map(question => ({
          ...question,
          outdated: true,
        })),
        ...newQuestions,
      ],
    }, user._id, organization._id);
    return updatedResponse;
  } catch (error: any) {
    throw new Error(error);
  }
}

export default renewResponse;
