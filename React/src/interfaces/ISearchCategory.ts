import { ComponentWithAs, IconProps } from "@chakra-ui/react";

export interface ISearchCategory {
  _id?: string;
  label: string;
  icon: ComponentWithAs<"svg", IconProps>;
  type: string;
  url?: string;
};

