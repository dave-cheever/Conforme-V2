import { IBase, IUser } from 'app-interfaces';

export interface IBusinessUnit extends IBase {
  identifier: string;
  name: string;
  ownerId: string;
  imgUrl?: string;
  organizationId: string;

  // Additional fields - can be added when getting from database
  owner?: IUser;
  complianceItemsResponsesCount?: number;
  totalAuditsCount?: number;
  completedAuditsCount?: number;
  upcomingAuditsCount?: number;
  overdueAuditsCount?: number;
  totalActionsCount?: number;
  completedActionsCount?: number;
  inProgressActionsCount?: number;
  overdueActionsCount?: number;
  totalAnswersCount?: number;
  openAnswersCount?: number;
  resolvedAnswersCount?: number;
  closedAnswersCount?: number;
}
