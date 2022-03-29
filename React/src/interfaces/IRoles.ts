export interface IRoles {
  reader: {
    normal: string[];
    restricted: object;
  };
  admin: {
    normal: string[];
    restricted: object;
  };
  user: {
    normal: string[];
    restricted: object;
  };
}
