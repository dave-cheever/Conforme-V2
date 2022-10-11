import actionsInsights from './actionsInsights.q';
import answersInsights from './answersInsights.q';
import auditsInsights from './auditsInsights.q';
import totals from './totals.q';

const insightsResolvers = {
  Query: {
    auditsInsights,
    actionsInsights,
    answersInsights,
    totals,
  },
};

export const insightsTypeDefs = `
  type Chart {
    dates: [String!]!
    counts: [Int!]!
  }

  type AuditsInsights {
    totalAudits: Int
    completedAudits: Int
    upcomingAudits: Int
    missedAudits: Int
    totalAuditsChart: Chart
    completedAuditsChart: Chart
    upcomingAuditsChart: Chart
    missedAuditsChart: Chart
  }

  type ActionsInsights {
    totalActions: Int
    completedActions: Int
    inProgressActions: Int
    overdueActions: Int
    totalActionsChart: Chart
    completedActionsChart: Chart
    inProgressActionsChart: Chart
    overdueActionsChart: Chart
  }

  type AnswersInsights {
    totalAnswers: Int
    openAnswers: Int
    resolvedAnswers: Int
    closedAnswers: Int
    totalAnswersChart: Chart
  }

  type Totals {
    users: Int
    locations: Int
    businessUnits: Int
  }

  input AuditsInsightsQueryInput {
    status: [String]
    auditTypesIds: [ID]
    walkType: [String]
    businessUnitsIds: [ID]
    locationsIds: [ID]
    usersIds: AuditUsersInput
    createdDate: [String]
    dueDate: [String]
  }

  input ActionsInsightsQueryInput {
    scope: ScopeInput
    status: [String]
    priority: [String]
    businessUnitsIds: [ID]
    locationsIds: [ID]
    usersIds: ActionUsersInput
    dueDate: [String]
  }

  input AnswersInsightsQueryInput {
    questionsCategoriesId: ID!
    businessUnitsIds: [ID]
    locationsIds: [ID]
    status: [String]
    usersIds: AnswerUsersInput
    scope: ScopeInput
    createdDate: [String]
  }
`;

export const insightsQueryDefs = `
  auditsInsights(auditsInsightsQueryInput :AuditsInsightsQueryInput): AuditsInsights!
  actionsInsights(actionsInsightsQueryInput :ActionsInsightsQueryInput): ActionsInsights!
  answersInsights(answersInsightsQueryInput: AnswersInsightsQueryInput!): AnswersInsights!
  totals: Totals!
`;

export default insightsResolvers;
