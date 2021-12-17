import { logger } from 'app-shared';
import { Request, Response, Router } from 'express';
import StatusCodes from 'http-status-codes';

import { genMetatags, isPermitted, isSignedIn } from 'app-utils';
import { GraphService } from 'app-services';
import { BusinessUnits, ComplianceItems, Responses } from 'app-models';
import { IOrganization } from 'app-interfaces';

const filesRouter = () => {
  const router = Router();

  router.post('/document',
    isSignedIn,
    GraphService.inMemoryStrategy.any(),
    async (req: Request, res: Response) => {
      try {
        const { body, files, user } = req;
        if (!user) {
          return res.status(StatusCodes.FORBIDDEN).json({ message: 'Session is not valid' });
        }

        const { responseId, documentName, documentType } = body;
        if (!responseId || !documentType || (documentType === 'evidence' && !documentName)) {
          return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Please pass response id, document name and type' });
        }

        const responseDocument = await Responses.findById(responseId);
        if (!responseDocument?._doc) {
          return res.status(StatusCodes.NOT_FOUND).json({ message: 'Response doesn\'t exist' });
        }
        const response = responseDocument._doc;
        const complianceItem = await ComplianceItems.customFindById(response.complianceItemId);
        const businessUnit = await BusinessUnits.customFindById(response.businessUnitId);
        if (!businessUnit || !complianceItem || !complianceItem.published) {
          return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Unexpected error occured' });
        }

        const isUserPermitted = isPermitted({ user, action: 'responses.edit', data: { response, businessUnitOwnerId: businessUnit.ownerId } })
        if (!isUserPermitted) {
          return res.status(StatusCodes.FORBIDDEN).json({ message: 'Access denied' });
        }

        let fileName = `${responseId}`;
        if (documentType === 'evidence') {
          fileName += `-${documentName.replace(/[^a-zA-Z ]+/g, '').trim().replace(' ', '-').toLowerCase()}`;
        } else if (documentType === 'attachments') {
          fileName += '-attachments';
        }
        let uploaded: { name: string; id: string }[] = [];
        if (files && files.length > 0) {
          uploaded = await GraphService.uploadDocuments(
            req.session.organization as IOrganization,
            files as Express.Multer.File[],
            fileName,
          );
        }

        const updatedResponse = {
          ...response,
          metatags: {
            ...response.metatags,
            ...genMetatags("updated", user._id),
          },
        };

        if (documentType === 'evidence') {
          const evidence = updatedResponse.evidence.find(evidence => evidence.name === documentName && !evidence.outdated);
          if (!evidence) {
            return res.status(StatusCodes.FORBIDDEN).json({ message: 'Evidence doesn\'t exist' });
          }
          evidence.uploaded = {
            id: uploaded[0].id,
            name: uploaded[0].name,
            addedAt: new Date(),
          };
        } else if (documentType === 'attachments') {
          uploaded.forEach(document => updatedResponse.attachments.push({
            id: document.id,
            name: document.name,
            addedAt: new Date(),
          }));
        }

        responseDocument.overwrite(updatedResponse);
        await responseDocument.save();
        // @ts-ignore
        await responseDocument.customRecalculateResponse();

        return res.status(StatusCodes.OK).end('Files saved');
      } catch (err: any) {
        logger.error(err.message, err);
        return res.status(StatusCodes.BAD_REQUEST).json({
          error: err.message,
        });
      }
    }
  );


  router.get('/photo/:userId',
    isSignedIn,
    async (req: Request, res: Response) => {
      try {
        const { user } = req;
        if (!user) {
          return res.status(StatusCodes.FORBIDDEN).json({ message: 'Session is not valid' });
        }

        if (!req.params.userId) {
          return res.status(StatusCodes.OK).end();
        }

        const photo = await GraphService.getUserPhoto({ userId: req.params.userId, organization: req.session.organization });
        if (!photo) {
          return res.status(StatusCodes.OK).end();
        }
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
    }
  );

  return router;
}

export default filesRouter;
