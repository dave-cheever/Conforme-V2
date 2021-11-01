import { Dispatch, SetStateAction } from "react";

export type AdminModalState = 'closed' | 'add' | 'edit' | 'delete';

export interface IAdminContext {
  adminModalState: AdminModalState;
  setAdminModalState: Dispatch<SetStateAction<AdminModalState>>,
}
