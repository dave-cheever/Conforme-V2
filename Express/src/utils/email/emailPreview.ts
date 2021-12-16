import { IOrganization } from 'app-interfaces';
import wkhtmltoimage from 'wkhtmltoimage';
import getEmailTemplate from './template';

const emailPreview = async ({ templateId, html, organization }: { templateId: string, html: string, organization: IOrganization }) => {
  const htmlString = getEmailTemplate({ body: html, organization });

  await new Promise<void>(resolve =>
    wkhtmltoimage.generate(
      htmlString,
      { output: `public/thumbnails/${templateId}.png` },
      () => resolve()
    )
  );
};

export default emailPreview;
