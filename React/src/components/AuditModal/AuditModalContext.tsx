import { createContext } from 'react';

import { IAuditor } from '../../interfaces/IAuditor';

export interface AuditModalContextType {
  activePage: string;
  setActivePage: (value: string) => void;
  selectedArea: string;
  setSelectedArea: (value: string) => void;
  auditorSearchText: string;
  updateAuditorSearchText: (value: string) => void;
  auditors: IAuditor[];
  selectedAuditors: IAuditor[];
  updateSelectedAuditors: (value: IAuditor, action: string) => void;
}

export const initialState: AuditModalContextType = {
  activePage: '',
  setActivePage: () => undefined,
  selectedArea: '',
  setSelectedArea: () => undefined,
  auditorSearchText: '',
  updateAuditorSearchText: () => undefined,
  auditors: [],
  selectedAuditors: [],
  updateSelectedAuditors: () => undefined,
};

const AuditModalContext = createContext(initialState);

export default AuditModalContext;
