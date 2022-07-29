export type gqlFunction = (
  options?: MutationFunctionOptions<any, OperationVariables, DefaultContext, ApolloCache<any>>,
) => Promise<FetchResult<any, Record<string, any>, Record<string, any>>>;
