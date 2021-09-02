interface ISubSection {
  label: string;
  url: string;
}

export interface INavItem {
  type: "mentions" | "seperator" | "menuItem";
  icon?: any;
  label: string;
  url?: string;
  isActive?: boolean;
  subSections?: ISubSection[] | undefined;
}
