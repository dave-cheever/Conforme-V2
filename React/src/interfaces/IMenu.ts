import { ISubSection } from './INavItem';

export interface IMenuItem {
  url: string;
  icon: any;
  label: string;
  subSections: ISubSection[];
}
