import IFilter from './IFilter';

export default interface IFilterString extends IFilter {
  value: string[] | null;
}
