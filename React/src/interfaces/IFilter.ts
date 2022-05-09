export default interface IFilter {
  name: string;
  value: string | string[] | Date | Date[] | undefined | null;
  hideFromPanel?: boolean;
}
