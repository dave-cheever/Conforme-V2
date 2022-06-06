import { IBase } from './IBase';
import { IUser } from './IUser';

export interface ILocation extends IBase {
  _id: string;
  name: string;
  ownerId: string;
  organizationId: string;
  notes: string;

  // Additional fields - can be added when getting from database
  owner?: IUser;
  complianceItemsResponsesCount?: number;
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
