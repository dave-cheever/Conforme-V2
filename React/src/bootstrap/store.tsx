import { createContext, useReducer } from "react";

import { IOrganization } from "../interfaces/IOrganization";
import { IRoles } from "../interfaces/IRoles";
import { ISetting } from "../interfaces/ISetting";
import { IUser } from "../interfaces/IUser";
import IFilters from "../interfaces/IFilters";
import { getFilters } from "../utils/helpers";

export interface IState {
  roles?: IRoles;
  settings: ISetting[];
  user?: IUser;
  organizationConfig?: IOrganization;
  mentionsCount: number;
  filters: IFilters;
}

export interface IAction {
  type: string;
  payload?: any;
}

export interface IStore {
  state: IState;
  dispatch: (action: IAction) => void;
}

const initialState: IState = {
  roles: undefined,
  settings: [],
  user: undefined,
  organizationConfig: undefined,
  mentionsCount: 0,
  filters: getFilters({}),
};
const getInitialState = (): any => initialState;
const store = createContext<IStore>(getInitialState());
const { Provider } = store;

const StateProvider = ({ children }: any) => {
  const [state, dispatch] = useReducer((state: any, action: any) => {
    switch (action.type) {

      case 'setRoles': {
        const newState = {
          ...state,
          roles: action.payload
        };
        return newState;
      }

      case 'setSettings': {
        const newState = {
          ...state,
          settings: action.payload
        };
        return newState;
      }

      case "setUser": {
        const newState = {
          ...state,
          user: action.payload,
        };
        return newState;
      }

      case "setOrganizationConfig": {
        const newState = {
          ...state,
          organizationConfig: action.payload,
        };
        return newState;
      }

      case "setMentionsCount": {
        const newState = {
          ...state,
          mentionsCount: action.payload,
        };
        return newState;
      }

      default:
        throw new Error("Not supported store action");
    }
  }, initialState);

  const value: any = { state, dispatch };
  return <Provider value={value}>{children}</Provider>;
};

export { store, StateProvider };
