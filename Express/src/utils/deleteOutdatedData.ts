import { subYears } from "date-fns";

import { Audits, Organizations, Settings } from "app-models";

const deleteOutdatedData = async () => {
  const allowedDomains: string[] = process.env.ALLOWED_DOMAINS?.split(';') || [];
  const organizations = await Organizations.find({ domain: { $in: allowedDomains } }).lean();
  for (const organization of organizations) {
    const retentionPeriod = await Settings.customFindOneByName('retentionPeriod', organization._id);
    if (retentionPeriod?.value && retentionPeriod.value !== 'Never') {
      const removeDataAfter = subYears(new Date(), parseInt(retentionPeriod.value, 10));

      // Clean Audits
      const auditsToRemove = await Audits.customFind({ 'metatags.addedAt': { $lt: removeDataAfter } }, organization._id);
      await Promise.all(auditsToRemove.map(({ _id }) => Audits.customDelete({ _id }, 'retention-policy', organization._id)))
    }
  }
};

export default deleteOutdatedData;
