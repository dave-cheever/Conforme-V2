import { IBaseModel, IRecentSearch } from 'app-interfaces';

export interface IRecentSearchModel extends IBaseModel<IRecentSearch> {
  customFindByUserId: (userId: string, organizationId: string) => Promise<IRecentSearch[]>;
}

