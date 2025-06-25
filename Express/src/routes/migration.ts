import { Request, Response, Router } from 'express';
import StatusCodes from 'http-status-codes';

import { IOrganization } from 'app-interfaces';
import { createBREGlobalDocuments, createBREGroupDocuments, updateDocumentPathInDocuments} from "app-migrations";
import { Organizations } from 'app-models';
import { GraphService } from 'app-services';
import { isMigrationRoutePermitted } from 'app-utils';

/*
* This script is used only to BRE project for Document control module
* Migration script is used to parsed data from excel file and
* migrate it into mongodb database
* It is necessary to provide API key, migration id and organization id to run the scripts 
*/

const migrationRouter = () => {
  const router = Router();

  router.post(
    '/:id',
    GraphService.inMemoryStrategy.any(),
    isMigrationRoutePermitted,
    async (req: Request, res: Response) => {
      const { body, files, params } = req;
      const { organizationId, ...data } = body

      try {
        const organization = await Organizations.customFindById(organizationId);
        let migrationFunction: (res: Response<any, Record<string, any>>, organization: IOrganization, data: any, files?: Express.Multer.File[] | undefined) => Promise<Response<any, Record<string, any>>>;
        switch (params.id) {
          case '2eab4a0c-ec50-468d-b483-fd2b0a05b279':
            migrationFunction = createBREGlobalDocuments;
            break;
          case '5c51ec19-9428-4ef5-b262-9decd407b295':
            migrationFunction = createBREGroupDocuments;
            break; 
          case '79c3ce81-7120-483a-8982-c5072e39db1b':
            migrationFunction = updateDocumentPathInDocuments;
            break;
          default:
            return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Invalid migration id' })
        }
        return await migrationFunction(res, organization, data, files as Express.Multer.File[])
      } catch (error: any) {
        res.status(StatusCodes.BAD_REQUEST).json({ error: error.message })
      }
    },
  );

  return router;
};

export default migrationRouter;
