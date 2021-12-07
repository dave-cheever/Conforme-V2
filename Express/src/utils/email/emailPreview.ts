import wkhtmltoimage from 'wkhtmltoimage';

import getEmailTemplate from './template';

export const emailPreview = async (name: string, html: string) => {
  const htmlString = getEmailTemplate(html);
  await new Promise<void>(resolve =>
    wkhtmltoimage.generate(
      htmlString,
      { output: `public/thumbnails/${name}.png` },
      () => resolve()
    )
  );
};