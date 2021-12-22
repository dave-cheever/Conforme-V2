import { v4 as uuidv4 } from "uuid";
import { model, Schema } from 'mongoose';
import { isEqual } from 'date-fns';

import { IComplianceItem, IComplianceItemModel, IOrganization, IResponse } from 'app-interfaces';
import { BusinessUnits, Responses } from 'app-models';
import { genMetatags } from 'app-utils';

const complianceItemSchema = new Schema<IComplianceItem, IComplianceItemModel>({
  _id: String,
  name: String,
  description: String,
  categoryId: String,
  regulatoryBodyId: String,
  dueDate: Date,
  frequency: String,
  businessUnitsIds: [String],
  evidenceItems: [String],
  organizationId: String,
  questions: [{
    _id: false,
    type: {
      type: String,
      enum: ['text', 'textMultiline', 'switch', 'datepicker', 'multipleChoice'],
    },
    name: String,
    description: String,
    value: Schema.Types.Mixed,
    required: Boolean,
    outdated: Boolean,
    choices: [{
      _id: false,
      label: String,
      isCorrect: Boolean
    }]
  }],
  published: Boolean,
  reference: String,
  metatags: {
    addedAt: Date,
    addedBy: String,
    updatedAt: Date,
    updatedBy: String,
    removedAt: Date,
    removedBy: String
  }
});

// Creating custom methods for every collection to manipulate th DB because we want to do some checks

complianceItemSchema.statics.customFindById = async function (_id: string): Promise<IComplianceItem> {
  const complianceItem = await this.findById(_id).lean();
  if (!complianceItem) {
    throw new Error('ComplianceItem not found');
  }
  return complianceItem;
};

complianceItemSchema.statics.customFind = async function (selector: any = {}): Promise<IComplianceItem[]> {
  const complianceItems = await this.find({
    ...selector,
    "metatags.removedAt": { $eq: null },
  }).lean();
  return complianceItems;
};

complianceItemSchema.statics.customGenerateReference = async function (): Promise<string> {
  let reference = "0000001";
  const lastComplianceItem = await this.findOne({}).sort({ 'metatags.addedAt': -1 }).lean();
  if (lastComplianceItem) {
    const newReference = parseInt(lastComplianceItem.reference) + 1;
    reference = ('000000' + newReference).slice(-7);
  }
  return reference;
};

complianceItemSchema.methods.customSynchronizeResponses = async function ({
  userId,
  prevDueDate,
  organization
}: {
  userId: string,
  prevDueDate?: Date,
  organization: IOrganization
}) {
  const responses = await Responses.customFind({ complianceItemId: this._id });
  const unprocessedBusinessUnitsIds = [...this.businessUnitsIds];

  for (const response of responses) {
    const index = unprocessedBusinessUnitsIds.findIndex(_id => _id === response.businessUnitId);
    let isPublished = this.published;

    if (index === -1) {
      // If BU of Response is not selected in CI
      // Do not publish it
      isPublished = false;
    } else {
      // If BU of Response is selected in CI
      // Set its publish state to same as CI - published or not published
      // And remove from not processed array
      unprocessedBusinessUnitsIds.splice(index, 1);
    }

    const updatedResponse: Pick<IResponse, 'published' | 'evidence' | 'questions' | 'status' | 'nextRenewalDate'> = {
      published: isPublished,
      evidence: [...response.evidence.filter(({ outdated }) => outdated)], // add all past evidence
      questions: [...response.questions.filter(({ outdated }) => outdated)], // add all past questions
      status: response.status,
      nextRenewalDate: response.nextRenewalDate,
    };

    // Get not outdated evidence from response
    const currentEvidence = response.evidence.filter(({ outdated }) => !outdated);

    // Check if evidence was removed from CI
    for (const evidence of currentEvidence) {
      if (!this.evidenceItems.includes(evidence.name)) {
        // If current evidence not exist in CI evidence items
        // Set it to outdated
        updatedResponse.evidence.push({
          ...evidence,
          outdated: true,
        });
      }
    }

    // Check if evidence was added to CI or re-ordered
    for (const evidenceName of this.evidenceItems) {
      const existingEvidence = currentEvidence.find(({ name }) => name === evidenceName);
      if (existingEvidence) {
        // If CI evidence exist in response, leave it
        updatedResponse.evidence.push(existingEvidence);
      } else {
        // If CI evidence not exist in response, add it
        updatedResponse.evidence.push({ name: evidenceName });
      }
    }

    // Get not outdated questions from response
    const currentQuestions = response.questions.filter(({ outdated }) => !outdated);

    // Check if question was removed from CI
    for (const question of currentQuestions) {
      const existingQuestion = (this.questions || []).find(({ name, type }) => name === question.name && type === question.type);
      if (!existingQuestion) {
        // If current question not exist in CI questions
        // Set it to outdated
        updatedResponse.questions.push({
          ...question,
          outdated: true,
        });
      }
    }

    // Check if question was added to CI or re-ordered
    for (const question of this.questions || []) {
      const existingQuestion = currentQuestions.find(({ name, type }) => name === question.name && type === question.type);
      if (existingQuestion) {
        // If CI question exist in response, leave it but update with possible changes
        updatedResponse.questions.push({
          ...existingQuestion,
          description: question.description,
          required: question.required,
        });
      } else {
        // If CI question not exist in response, add it
        updatedResponse.questions.push(question);
      }
    }

    // If questions or evidence has changed, set right status
    const areRequiredQuestionsAnswered = updatedResponse.questions
      .filter(({ required, outdated }) => !outdated && required)
      .every(({ value }) => value || (typeof value === 'boolean' && value === false));
    const isEvidenceUploaded = updatedResponse.evidence
      .filter(({ outdated }) => !outdated)
      .every(({ uploaded }) => uploaded && uploaded.id);
    if (areRequiredQuestionsAnswered && isEvidenceUploaded) {
      updatedResponse.status = 'completed';
    } else if (response.status !== 'notStarted') {
      updatedResponse.status = 'inProgress';
    }

    // If DueDate was updated in CI, check if should be updated in response
    if (
      (!response.nextRenewalDate && !prevDueDate) ||
      (response.nextRenewalDate && prevDueDate && isEqual(response.nextRenewalDate, prevDueDate))
    ) {
      // If previous CI date was same as Response date
      updatedResponse.nextRenewalDate = this.dueDate!;
    }

    await Responses.updateOne({ _id: response._id }, updatedResponse);
  }

  // Create selected that doesn't exist
  for (const businessUnitId of unprocessedBusinessUnitsIds) {
    const businessUnit = await BusinessUnits.customFindById(businessUnitId);

    await Responses.create({
      _id: uuidv4(),
      complianceItemId: this._id,
      businessUnitId: businessUnitId,
      accountableId: businessUnit.ownerId,
      responsibleId: businessUnit.ownerId,
      contributorsIds: [],
      followersIds: [],
      status: 'notStarted',
      attachments: [],
      lastCompletedDate: null,
      lastRenewalDate: null,
      nextRenewalDate: this.dueDate,
      evidence: this.evidenceItems.map(name => ({ name })),
      questions: this.questions,
      metatags: genMetatags('added', userId),
      organizationId: organization._id
    });
  }
};

const complianceItemModel = model<IComplianceItem, IComplianceItemModel>('ComplianceItem', complianceItemSchema, 'complianceItems');
export default complianceItemModel;
