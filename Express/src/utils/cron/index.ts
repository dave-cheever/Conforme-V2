import { CronJob } from "cron";

import { logger } from "app-shared";

import calculateAudits from "./calculateAudits";
import deleteOutdatedData from "./deleteOutdatedData";

const setCRONJobs = () => {
  logger.info('CRON jobs set');
  const calculateAuditsCRON = new CronJob('0 0 0 * * *', async () => {
    logger.info('"Calculate audits" CRON job started');
    try {
      await calculateAudits();
    } catch (e) {
      logger.error('Error in "Calculate audits" CRON job: ', e);
    }
  });
  calculateAuditsCRON.start();
  const deleteOutdatedDataCRON = new CronJob('0 0 1 * * *', async () => {
    logger.info('"Delete outdated data" CRON job started');
    try {
      await deleteOutdatedData();
    } catch (e) {
      logger.error('Error in "Delete outdated data" CRON job: ', e);
    }
  });
  deleteOutdatedDataCRON.start();
  const syncUsersCRON = new CronJob('0 0 2 * * *', async () => {
    logger.info('"Sync users" CRON job started');
    try {
      await deleteOutdatedData();
    } catch (e) {
      logger.error('Error in "Sync users" CRON job: ', e);
    }
  });
  syncUsersCRON.start();
};

export default setCRONJobs;
