import { createContext } from "react";

export interface AuditModalContextType {
  activePage: string;
  setActivePage: (value: string) => void;
  selectedArea: string;
  setSelectedArea: (value: string) => void;
}

export const initialState: AuditModalContextType = {
  activePage: "",
  setActivePage: () => undefined,
  selectedArea: "",
  setSelectedArea: () => undefined
};

const AuditModalContext = createContext(initialState);

export default AuditModalContext;