import { IBase } from 'app-interfaces';
import { EntityTypeValue } from 'app-enums';

export interface IRecentSearch extends IBase {
  userId: string;
  term: string;
  entityId: string;
  entityType: EntityTypeValue;
}

