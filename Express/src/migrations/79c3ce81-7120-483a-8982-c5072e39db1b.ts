import { Response } from 'express';
import fs from "fs/promises";
import StatusCodes from 'http-status-codes';
import { isEmpty } from "lodash";
import * as XLSX from 'xlsx';

import { IOrganization } from "app-interfaces";
import { Responses, Users } from "app-models";
import { GraphService } from "app-services";
import { enumerate, getFilteredJSONDataForMigration } from "app-utils";

/*
* This migration scripts is only specific to BRE project for Document Control module
* Excel file link: https://cielocosta.sharepoint.com/:x:/r/teams/DocumentControls-BRE/Shared%20Documents/Build%20and%20test/Documents%20SharePoint%20export.xlsx?d=w3782ea3298a5460c94665e30cb23e416&csf=1&web=1&e=yx1NCy
* Parsing is done according to given sample data provided by BRE
* It reads the spreadsheet and base on document number search the specific document in the system
* and update an answer for question "SharePoint location" with the value from spreadsheet
*/

const updateDocumentPathInDocuments = async (res: Response, organization: IOrganization, data: any, files?: Express.Multer.File[]) => {
  const { adminId, sharePointTenant } = data;
  if (!sharePointTenant) throw new Error('Please pass sharePointTenant parameter (name of the SharePoint site)');
  if (!adminId) throw new Error('Please pass adminId parameter (ID of the user that run migration - must exist in the AAD)');
  const admin = await Users.customFindById(adminId, organization._id);
  if (!admin) throw new Error('User passed as adminId doesn\'t exist');

  if (files && files[0]?.buffer) {
    const buffer = files[0].buffer;
    const insertedTrackerItem: boolean[] = [];

    const logFileName = `79c3ce81-7120-483a-8982-c5072e39db1b-${new Date().valueOf()}.txt`;
    const log = async (text: string) => fs.appendFile(`./${logFileName}`, text);
    await log(`Migration script "79c3ce81-7120-483a-8982-c5072e39db1b" started for ${organization.name} (${organization._id})`);
    await log(`\nParsing file: ${files[0].originalname}`);

    // Generate a workbook from buffer upload
    const workbook = XLSX.read(buffer, { type: "buffer", cellDates: true });

    // This method return the list of sheet name in the excel file
    const sheet_name_list = workbook.SheetNames;
    for (const sheet of sheet_name_list) {
      await log(`\n\nParsing sheet: ${sheet}`);
      try {
        // Create a json object from the row define in index
        const JSONData: object[] = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);

        // Filter the key and values as it contains
        const filteredJSONData: { [x: string]: string }[] = getFilteredJSONDataForMigration(JSONData);
        for (const [index, data] of enumerate(filteredJSONData)) {
          try {
            if (isEmpty(data)) continue;
            await log(`\n\n\tParsing row ${index}`);

            // if 'Document Number' not in the row, document won't be updated as it is required to find it in the database
            if (!('Document Number' in data) || typeof data['Document Number'] !== 'string') throw new Error(`Row does not contain "Document Number"`);

            // if row type is not 'Item', ignore it
            if (!('Item Type' in data) || data['Item Type'] !== 'Item') throw new Error(`Row is not an "Item" type`);

            await log(`\n\tDocument name: ${data.Name}`);
            await log(`\n\tDocument number: ${data['Document Number']}`);
            await log(`\n\tDocument path: ${data.Path}`);

            const pipeline: any[] = [
              {
                $match: {
                  organizationId: organization._id,
                },
              },
              {
                $lookup: {
                  from: 'trackerItems',
                  localField: 'trackerItemId',
                  foreignField: '_id',
                  as: 'trackerItem',
                },
              },
              {
                $unwind: {
                  path: '$trackerItem',
                  preserveNullAndEmptyArrays: true,
                },
              },
              {
                $match: {
                  'trackerItem.name': new RegExp(data['Document Number'], 'i'),
                },
              }, {
                $limit: 5,
              },
            ];
            const response = (await Responses.aggregate(pipeline) || [])[0];

            if (!response) throw new Error(`Document could not be found in the database`);

            await Responses.customUpdateOne({ _id: response._id }, {
              questions: response.questions.map(question => {
                if (question.name !== 'SharePoint location') return question;
                return {
                  ...question,
                  value: `https://${sharePointTenant}.sharepoint.com/${data.Path}/${data.Name}`,
                }
              }),
            }, adminId, organization._id);

            await log('\n\tResponse synchronized succesfully');
            insertedTrackerItem.push(true);
          } catch (error: any) {
            insertedTrackerItem.push(false);
            await log(`\n\tDocument not updated due to error: ${error.message}`);
          }
          //   }
        }
      } catch (error: any) {
        insertedTrackerItem.push(false);
        await log(`\nDocument not updated due to error: ${error.message}`);
      }
    }

    await log(`\n\nMigration script summary\n
Parsed documents: ${insertedTrackerItem.length}
Updated documents: ${insertedTrackerItem.filter(Boolean).length}
Not updated documents: ${insertedTrackerItem.filter(item => !item).length}
    `);

    const logFile = await fs.readFile(`./${logFileName}`, { encoding: 'utf8' });
    try {
      await GraphService.uploadDocuments(
        [
          {
            buffer: Buffer.from(logFile),
            size: Buffer.from(logFile).length,
            originalname: logFileName,
          },
        ] as Express.Multer.File[],
        'migrations',
        organization,
      )
    } catch (error) {
      console.log({ error })
    }

    return res.status(StatusCodes.OK).json({
      message: `${insertedTrackerItem.filter(Boolean).length} out of ${insertedTrackerItem.length} is updated in database, ${insertedTrackerItem.filter(item => !item).length} is not updated due to missing reference in spreadsheet or document in the database`,
    })
  }
  return res.status(StatusCodes.BAD_REQUEST).json({ error: 'File is not uploaded' })
};

export default updateDocumentPathInDocuments;

