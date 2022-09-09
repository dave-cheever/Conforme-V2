export default interface IFilter {
  name: string;
  value: string | string[] | Date | Date[] | boolean | undefined | null;
  hideFromPanel?: boolean;
  permission?: string;
}
