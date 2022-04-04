import { IUser } from './IUser';

export interface IAuditTeamContext {
  data: any;
  loading: boolean;
  searchQuery: string;
  selectedAuditor: Partial<IUser>;
  selectedParticipants: Partial<IUser[]>;
  setSearchQuery: (value: string) => void;
  setSelectedAuditor: (value: Partial<IUser>) => void;
  setSelectedParticipants: (value: Partial<IUser[]>) => void;
}
