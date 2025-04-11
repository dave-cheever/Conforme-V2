import { IBase, IScope, IUser } from 'app-interfaces';

export interface IBusinessUnit extends IBase {
  identifier: string;
  name: string;
  ownerId?: string;
  imgUrl?: string;
  organizationId: string;
  scope:IScope,
  // Additional fields - can be added when getting from database
  owner?: IUser;
  trackerItemsResponsesCount?: number;
  totalAuditsCount?: number;
  completedAuditsCount?: number;
  upcomingAuditsCount?: number;
  missedAuditsCount?: number;
  totalActionsCount?: number;
  completedActionsCount?: number;
  inProgressActionsCount?: number;
  overdueActionsCount?: number;
  totalAnswersCount?: number;
  openAnswersCount?: number;
  resolvedAnswersCount?: number;
  closedAnswersCount?: number;
}
