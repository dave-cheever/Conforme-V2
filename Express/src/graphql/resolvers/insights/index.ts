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
  input AnswersInsightsQuery {
    questionsCategoriesId: ID!
  }

  type Chart {
    dates: [String!]!
    counts: [Int!]!
  }

  type TopAuditor {
    user: User!
    audits: Int!
  }

  type TopActionCreator {
    user: User!
    actions: Int!
  }

  type TopAnswerCreator {
    user: User!
    answers: Int!
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
    topAuditors: [TopAuditor!]!
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
    mostAddedBy: [TopActionCreator!]!
  }

  type AnswersInsights {
    totalAnswers: Int
    openAnswers: Int
    resolvedAnswers: Int
    closedAnswers: Int
    totalAnswersChart: Chart
    mostAddedBy: [TopAnswerCreator!]!
  }

  type Totals {
    users: Int
    locations: Int
    businessUnits: Int
  }
`;

export const insightsQueryDefs = `
  auditsInsights: AuditsInsights!
  actionsInsights: ActionsInsights!
  answersInsights(answersInsightsQuery: AnswersInsightsQuery!): AnswersInsights!
  totals: Totals!
`;

export default insightsResolvers;
