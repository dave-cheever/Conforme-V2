export default function updateLocalStorageFilter<T = string[]>(
  module: string,
  key: string,
  name: string,
  value: T,
  userId: string,
  setFilters: (filters: Record<string, any>) => void,
) {
  const localStorageKey = `${module}-filters-${userId}`;
  const existing = localStorage.getItem(localStorageKey);
  const parsed = existing ? JSON.parse(existing) : {};

  const isEmpty =
    value === null ||
    (Array.isArray(value) && value.length === 0) ||
    (typeof value === 'object' && Object.keys(value).length === 0);
    if (isEmpty) 
      delete parsed[key];
     else {
      parsed[key] = {
        name,
        value,
      };
    }
  localStorage.setItem(localStorageKey, JSON.stringify(parsed));
  setFilters({ [key]: value });
}
