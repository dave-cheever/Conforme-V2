export default interface IRoute {
  path: string;
  key: string;
  exact?: boolean;
  component: (props?: any) => JSX.Element;
  layout: (props?: any) => JSX.Element;
  permission?: string;
}
