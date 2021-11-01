import moment, { Moment } from "moment";
import { initialFilters } from "../bootstrap/config";
import IFilter from "../interfaces/IFilter";
import IFilters from "../interfaces/IFilters";

export const getUTCDate = (date?: Date): Moment => {
  const momentDate = moment(date);
  const dateUTC = moment()
    .utc()
    .year(momentDate.year())
    .month(momentDate.month())
    .date(momentDate.date())
    .startOf('day');
  return dateUTC;
};

export const getFilters = ({ usedFilters = [], oldFilters = {}, newFilters = {} } = {}) => {
  // Make a copy of initial filters
  const cleanFilters = JSON.parse(JSON.stringify(initialFilters));

  const filters: IFilters = {};
  let filterName: string = '';
  for (filterName of usedFilters) {
    // Get filter config from existing or initial filters
    const filter: IFilter = oldFilters[filterName] || cleanFilters[filterName];

    // Check if value was set
    if (newFilters[filterName] !== undefined) {
      filter.value = newFilters[filterName];
    }

    // Set new filter
    filters[filterName] = filter;
  }

  return filters;
};

export const getFieldEmptyValue = (fieldType: string) => {
  switch (fieldType) {
    case 'text': {
      return '';
    }
  }
};
