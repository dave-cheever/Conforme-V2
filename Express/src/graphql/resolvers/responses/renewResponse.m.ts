import { ComplianceItems, Responses } from "app-models";
import { getStatus, isPermitted } from "app-utils";

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

    const newEvidence = [...response.evidence.filter(({ outdated }) => !outdated).map(({ name }) => ({ name }))];
    const newQuestions = [
      ...response.questions
        .filter(({ outdated }) => !outdated)
        .map(({ type, name, description, required }) => ({ type, name, description, required }))
    ];
    const nextStatus = getStatus(complianceItem.frequency || "");

    const updatedResponse = await Responses.customUpdateOne({ _id }, {
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
