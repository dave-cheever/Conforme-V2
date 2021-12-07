export interface ISubsection {
  url: string;
  label: string;
}

export interface IMenuItem  {
  url: string;
  icon: any;
  label: string;
  subSections: ISubsection[]
}