import scalars from '../scalars';
import actionsResolvers from './actions';
import answersResolvers from './answers';
import auditLogsResolvers from './auditLogs';
import auditsResolvers from './audits';
import auditTypesResolvers from './auditTypes';
import businessUnitsResolvers from './businessUnits';
import categoriesResolvers from './categories';
import commentsResolvers from './comments';
import graphResolvers from './graph';
import helpResolvers from './help';
import insightsResolvers from './insights';
import locationsResolvers from './locations';
import organizationsResolvers from './organizations';
import questionsResolvers from './questions';
import questionsCategoriesResolvers from './questionsCategories';
import regulatoryBodiesResolvers from './regulatoryBodies';
import responsesResolvers from './responses';
import searchResolvers from './search';
import settingsResolvers from './settings';
import trackerItemsResolvers from './trackerItems';
import usersResolvers from './users';

export default {
  Any: scalars.anyScalar,
  Date: scalars.dateScalar,
  Query: {
    ...actionsResolvers.Query,
    ...answersResolvers.Query,
    ...auditLogsResolvers.Query,
    ...auditsResolvers.Query,
    ...auditTypesResolvers.Query,
    ...businessUnitsResolvers.Query,
    ...categoriesResolvers.Query,
    ...commentsResolvers.Query,
    ...graphResolvers.Query,
    ...insightsResolvers.Query,
    ...locationsResolvers.Query,
    ...organizationsResolvers.Query,
    ...questionsCategoriesResolvers.Query,
    ...questionsResolvers.Query,
    ...regulatoryBodiesResolvers.Query,
    ...responsesResolvers.Query,
    ...searchResolvers.Query,
    ...settingsResolvers.Query,
    ...trackerItemsResolvers.Query,
    ...usersResolvers.Query,
    ...helpResolvers.Query,
  },
  Mutation: {
    ...actionsResolvers.Mutation,
    ...answersResolvers.Mutation,
    ...auditsResolvers.Mutation,
    ...auditTypesResolvers.Mutation,
    ...businessUnitsResolvers.Mutation,
    ...categoriesResolvers.Mutation,
    ...commentsResolvers.Mutation,
    ...locationsResolvers.Mutation,
    ...questionsCategoriesResolvers.Mutation,
    ...questionsResolvers.Mutation,
    ...regulatoryBodiesResolvers.Mutation,
    ...responsesResolvers.Mutation,
    ...settingsResolvers.Mutation,
    ...trackerItemsResolvers.Mutation,
    ...usersResolvers.Mutation,
  },
};
