import { IUser } from "./IUser";

export interface ITeamContext {
  data: any,
  loading: boolean,
  filterType: string, 
  isOpen: boolean,
  userSearchResults: IUser[],
  searchQuery: string,
  selectedRadio: string, 
  setFilterType: (value: string) => void,
  onOpen: () => void,
  onClose: () => void,
  refetchUsers: () => void
  setUserSearchResults: (value: IUser[]) => void,
  setSearchQuery: (value: string) => void,
  setSelectedRadio: (value: string) => void
}
