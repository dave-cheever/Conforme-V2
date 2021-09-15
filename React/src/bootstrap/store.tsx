import { createContext, useReducer } from "react";

import { User } from "../models";
import { IOrganization } from "../interfaces/IOrganization";
import { ISetting } from "../interfaces/ISettings";
import IFilters from "../interfaces/IFilters";
import { getFilters } from "../utils/helpers";

export interface IState {
  user: User;
  organizationConfig?: IOrganization;
  mentionsCount: number;
  settings: ISetting[];
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
  settings: [],
  filters: getFilters({}),
  user: new User({
    id: "asdasd",
    organizationsIds: [],
    image: "",
    defaultPage: "",
    metatags: {},
    firstName: "Mat",
    lastName: "",
    displayName: "Mat",
    email: "mat@gmail.com",
    jobTitle: "job",
    role: "systemAdmin",
  }),
  organizationConfig: {
    id: "",
    name: "Conforme",
    domain: "",
    logoUrl: "https://i.ibb.co/RhxV422/Group.png",
    theme: {
      colors: {
        brand: {},
      },
    },
    addons: {},
    allowedTenantsIds: [],
  },
  mentionsCount: 0
};
const getInitialState = (): any => initialState;
const store = createContext<IStore>(getInitialState());
const { Provider } = store;

const StateProvider = ({ children }: any) => {
  const [state, dispatch] = useReducer((state: any, action: any) => {
    switch (action.type) {
      case "setUser": {
        const newState = {
          ...state,
          user: action.payload && new User(action.payload),
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
