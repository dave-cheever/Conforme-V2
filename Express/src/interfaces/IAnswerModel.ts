import { IAnswer, IBaseModel, ISearchResult, IUser } from 'app-interfaces';

export interface IAnswerModel extends IBaseModel<IAnswer> {
  customSearch: (searchQuery: { searchText: string; questionsCategoryId?: string; }, user: IUser, organizationId: string) => Promise<ISearchResult[]>;
}
