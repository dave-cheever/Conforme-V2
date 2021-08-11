import { createContext, useReducer } from "react";

import { User } from "../models";
import { IOrganization } from "../interfaces/IOrganization";

export interface IState {
  user: User;
  organizationConfig?: IOrganization;
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
    name: "Cielo Costa",
    domain: "",
    logoUrl:
      "https://images.squarespace-cdn.com/content/v1/576008fae321408871da4e79/1466173437770-3J6ODI1OEYPZRQB0V53C/CC+logo.png?format=1000w",
    theme: {
      colors: {
        brand: {},
      },
    },
    addons: {},
    allowedTenantsIds: [],
  },
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

      default:
        throw new Error("Not supported store action");
    }
  }, initialState);

  const value: any = { state, dispatch };
  return <Provider value={value}>{children}</Provider>;
};

export { store, StateProvider };
