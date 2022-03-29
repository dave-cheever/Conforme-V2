import wkhtmltoimage from 'wkhtmltoimage';

import { IOrganization } from 'app-interfaces';

import getEmailTemplate from './template';

const emailPreview = async ({
  templateId,
  html,
  organization,
}: {
  templateId: string;
  html: string;
  organization: IOrganization;
}) => {
  const htmlString = getEmailTemplate({ body: html, organization });

  await new Promise<void>((resolve) =>
    // eslint-disable-next-line no-promise-executor-return
    wkhtmltoimage.generate(
      htmlString,
      { output: `public/thumbnails/${templateId}.png` },
      () => resolve(),
    ),
  );
};

export default emailPreview;
