import { Dispatch, SetStateAction } from 'react';

export type AdminModalState = 'closed' | 'add' | 'edit' | 'delete' | 'clone' | 'view';

export interface IAdminContext {
  adminModalState: AdminModalState;
  setAdminModalState: Dispatch<SetStateAction<AdminModalState>>;
}
