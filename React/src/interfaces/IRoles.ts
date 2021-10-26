export interface IRoles {
  reader: {
    normal: string[];
    restricted: object;
  };
  systemAdmin: {
    normal: string[];
    restricted: object;
  };
  user: {
    normal: string[];
    restricted: object;
  };
}