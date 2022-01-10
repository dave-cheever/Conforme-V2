import { IUser } from "./IUser";

export interface ITeamContext {
  data: any,
  loading: boolean,
  filterType: string, 
  isOpen: boolean,
  userSearchResults: IUser[],
  searchQuery: string,
  selectedRadio: string, 
  isReplaceAccountable: boolean,
  setFilterType: (value: string) => void,
  setIsReplaceAccountable: (value: boolean) => void,
  onOpen: () => void,
  onClose: () => void,
  refetchUsers: () => void
  setUserSearchResults: (value: IUser[]) => void,
  setSearchQuery: (value: string) => void,
  setSelectedRadio: (value: string) => void
}
