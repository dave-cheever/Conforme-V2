import { Request, Response, Router } from 'express';
import StatusCodes from 'http-status-codes';

import { IOrganization } from 'app-interfaces';
import { GraphService } from 'app-services';
import { logger } from 'app-shared';
import { isSignedIn } from 'app-utils';
import { Organizations } from 'app-models';
import getSession from 'src/utils/auth/getSession';

const filesRouter = () => {
  const router = Router();

  router.post(
    '/document',
    isSignedIn,
    GraphService.inMemoryStrategy.any(),
    async (req: Request, res: Response) => {
      try {
        const { body } = req;
        const session = await getSession(req, res);
        const files: Express.Multer.File[] = req.files as Express.Multer.File[];
        const { organization, user } = session;

        if (!user) {
          return res
            .status(StatusCodes.FORBIDDEN)
            .json({ message: 'Session is not valid' });
        }

        const { elementId, documentName } = body;
        if (!elementId) {
          return res
            .status(StatusCodes.BAD_REQUEST)
            .json({ error: 'Please pass element id' });
        }

        let filePath = elementId;
        if (documentName) {
          filePath += `-${documentName
            .replace(/[^a-zA-Z0-9 ]+/g, '')
            .trim()
            .replace(' ', '-')
            .substring(0, 200)
            .toLowerCase()}`;
        }

        let uploaded: { name: string; id: string; addedAt: Date }[] = [];
        if (files && files.length > 0) {
          uploaded = await GraphService.uploadDocuments(
            files,
            filePath,
            organization as IOrganization,
          );
        }

        return res.status(StatusCodes.OK).json(uploaded);
      } catch (err: any) {
        logger.error(err.message, err);
        return res.status(StatusCodes.BAD_REQUEST).json({
          error: err.message,
        });
      }
    },
  );

  router.get(
    '/photo/:userId',
    async (req: Request, res: Response) => {
      try {
        if (!req.params.userId) return res.status(StatusCodes.OK).end();

        const clientUrl = req.cookies?.clientUrl || '';
        const domain = new URL(clientUrl)?.host || '';
        if (!domain) return res.status(StatusCodes.OK).end();
        const organization = await Organizations.customFindByDomain(domain);
        const photo = await GraphService.getUserPhoto({
          userId: req.params.userId,
          organization,
        });
        if (!photo) return res.status(StatusCodes.OK).end();

        const buffer = Buffer.from(photo);
        return res
          .status(StatusCodes.OK)
          .set('Content-Type', 'image/jpeg')
          .set('Content-Length', buffer.length.toString())
          .end(buffer);
      } catch (err: any) {
        logger.error(err.message, err);
        return res.status(StatusCodes.BAD_REQUEST).json({
          error: err.message,
        });
      }
    },
  );

  return router;
};

export default filesRouter;
