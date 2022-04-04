import { connect } from "mongoose";

import { ConfigService } from "./common/services/ConfigService";

export default async () => {
  const configService = new ConfigService();
  const config = await configService.getConfig();
  connect(config.MongoConnectionString)
    .then(async () => {
      console.log('MongoDB connected');
    })
    .catch(e => console.log(e));
};
