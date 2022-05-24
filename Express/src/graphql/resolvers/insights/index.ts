import auditsInsights from './auditsInsights.q';

const insightsResolvers = {
  Query: {
    auditsInsights,
  },
};

export const insightsTypeDefs = `
  type AuditsChart {
    dates: [String!]!
    counts: [Int!]!
  }

  type TopAuditor {
    user: User!
    audits: Int!
  }

  type AuditsInsights {
    totalAudits: Int
    completedAudits: Int
    upcomingAudits: Int
    overdueAudits: Int
    totalAuditsChart: AuditsChart
    completedAuditsChart: AuditsChart
    upcomingAuditsChart: AuditsChart
    overdueAuditsChart: AuditsChart
    topAuditors: [TopAuditor!]!
  }
`;

export const insightsQueryDefs = `
  auditsInsights: AuditsInsights!
`;

export default insightsResolvers;
