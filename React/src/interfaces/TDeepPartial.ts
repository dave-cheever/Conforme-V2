export type TDeepPartial<T> = {
  [P in keyof T]?: TDeepPartial<T[P]>;
};
