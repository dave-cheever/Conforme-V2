declare module 'json-fn' {
  export function stringify(object: string | object): string;
  export function parse(string: string): object;
}
