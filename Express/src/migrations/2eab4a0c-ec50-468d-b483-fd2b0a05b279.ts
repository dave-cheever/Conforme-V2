import { isDate } from 'date-fns';
import { Response } from 'express';
import fs from "fs/promises";
import StatusCodes from 'http-status-codes';
import { isEmpty } from "lodash";
import * as XLSX from 'xlsx';

import { IOrganization } from "app-interfaces";
import { BusinessUnits, Categories, Locations, RegulatoryBodies, Responses, TrackerItems } from "app-models";
import { GraphService } from "app-services";
import { enumerate, getFilteredJSONDataForMigration, getNextRenewalDate } from "app-utils";

// this function is used for generating document item for Document control module
const generateTrackerItemTemplate = ({
  name,
  description,
  categoryId,
  regulatoryBodyId,
  businessUnitsIds,
  locationsIds,
  version,
  selectedStatus,
}) => ({
  name,
  description,
  categoryId,
  regulatoryBodyId,
  dueDateCalculation: 'fromCompletionDate',
  dueDateEditable: false,
  frequency: '3 years',
  businessUnitsIds,
  locationsIds,
  evidenceItems: [],
  allowAttachments: false,
  questions: [{
    description: "",
    name: "Status",
    options: [],
    required: true,
    requiredAnswer: ["Reserved", "Draft", "Under review", "Current", "Withdrawn"],
    type: "multipleChoice",
    value: [
      { label: "Reserved", isCorrect: selectedStatus === 'reserved' },
      { label: "Draft", isCorrect: selectedStatus === 'draft' },
      { label: "Under review", isCorrect: selectedStatus === 'under review' },
      { label: "Current", isCorrect: selectedStatus === 'current' },
      { label: "Withdrawn", isCorrect: selectedStatus === 'withdrawn' },
    ],
  }, {
    description: "",
    name: "Version",
    options: [],
    required: true,
    requiredAnswer: "",
    type: "text",
    value: version,
  }, {
    description: "Location on Group Management System SharePoint site - https://bretrust.sharepoint.com/sites/MS",
    name: "SharePoint location",
    options: [],
    required: false,
    requiredAnswer: "",
    type: "url",
    value: null,
  }, {
    description: "",
    name: "Key changes since last review",
    options: [],
    required: false,
    requiredAnswer: "",
    type: "textMultiline",
    value: null,
  }],
  published: true,
})

/*
* This migration scripts is only specific to BRE project for Document control module
* Excel file link: https://cielocosta.sharepoint.com/:x:/r/teams/DocumentControls-BRE/Shared%20Documents/Build%20and%20test/Document%20items%20for%20UAT%20-%20Document%20Control%20-%20BRE%20-%20Cielo%20Costa.xlsx?d=wf9074f99b6574c279ecfcc9ae72664f1&csf=1&web=1
* Parsing is done according to given sample data provided by BRE
* It imports Documents to the system from the BRE Global Documents Register spreadsheet
* It will also create missing Categories, Regulatory bodies, Locations and Business units
*/

const createBREGlobalDocuments = async (res: Response, organization: IOrganization, data: any, files?: Express.Multer.File[]) => {
  const { defaultOwner } = data;
  if (!defaultOwner) throw new Error('Please pass defaultOwner parameter (full name)');

  if (files && files[0]?.buffer) {
    const buffer = files[0].buffer;
    const insertedTrackerItem: boolean[] = [];
    const stats = {
      createdBusinessUnitCount: 0,
      createdCategoryCount: 0,
      createdLocationCount: 0,
      createdRegulatoryBodyCount: 0,
      ownerFoundCount: 0,
      ownerNotFoundCount: 0,
    };

    const logFileName = `2eab4a0c-ec50-468d-b483-fd2b0a05b279-${new Date().valueOf()}.txt`;
    const log = async (text: string) => fs.appendFile(`./${logFileName}`, text);
    await log(`Migration script "2eab4a0c-ec50-468d-b483-fd2b0a05b279" started for ${organization.name} (${organization._id})`);
    await log(`\nParsing file: ${files[0].originalname}`);

    //  it will generate a workbook from buffer upload
    const workbook = XLSX.read(buffer, { type: "buffer", cellDates: true });

    //  This method return the list of sheet name in the excel file
    const sheet_name_list = workbook.SheetNames;
    for (const sheet of sheet_name_list) {
      await log(`\n\nParsing sheet: ${sheet}`);
      //  this function parsed data row by row 
      const arrayData: string[][] = XLSX.utils.sheet_to_json(workbook.Sheets[sheet], { header: 1 });
      try {
        //  this will get row number for particular header row
        const rowIndex = arrayData.findIndex(document => document.includes('Document Number') || document.includes('Title/Description'));
        if (rowIndex === -1) throw new Error(`Could not find "Title/Description" header`);
        if (rowIndex !== -1) {
          await log(`\nFound "Title/Description" header in row number ${rowIndex}`);

          //  this will create a json object from the row define in index
          const JSONData: object[] = XLSX.utils.sheet_to_json(workbook.Sheets[sheet], { range: rowIndex });

          //  this function filtered the key and values as it contains /n/r
          const filteredJSONData: { [x: string]: string }[] = getFilteredJSONDataForMigration(JSONData);
          for (const [index, data] of enumerate(filteredJSONData)) {
            try {
              if (isEmpty(data) || (!('Title/Description' in data) && !('Owner' in data))) continue
              await log(`\n\n\tParsing row ${rowIndex + index + 2}`);

              // if 'Title/Description' not in the spreadsheet, document won't be created as it is required to create one
              if (!('Title/Description' in data) || typeof data['Title/Description'] !== 'string') throw new Error(`Document does not contain "Title/Description" header`);

              await log(`\n\tDocument name: ${data['Title/Description']}`);
              await log(`\n\tDocument number: ${data['Document Number']}`);

              // Only document with 'Current', 'Under review', 'Draft' status are allowed to insert
              const status = (data.Status || '').toLowerCase();
              if (!['current', 'under review', 'draft'].includes(status))
                throw new Error(`Document will not be parsed because of its "${data.Status}" status`);

              await log(`\n\tOwner "${data.Owner}" `);
              const owner = (await GraphService.getUsers({ searchText: data.Owner, organization }))[0];
              let user;
              if (isEmpty(owner)) {
                // if onwer is not provided then default owner will be 'Phil Clare' from the Quality and Compliance team
                await log(`not found in the tenant\n\tSet "${defaultOwner}" as owner`);
                user = (await GraphService.getUsers({ searchText: defaultOwner, organization }))[0];
                stats.ownerNotFoundCount += 1;
              } else {
                await log('found in the tenant');
                stats.ownerFoundCount += 1;
              }
              if (isEmpty(owner) && isEmpty(user)) throw new Error(`Default owner ("${defaultOwner}") can not be found in the tenant`);

              // Find business unit or create new one if doesn't yet exist
              const businessUnitName = owner?.department || user?.department || data['Business Area/Team'] || 'No department';
              const businessUnit = await BusinessUnits.customFindOneOrCreateOne(
                {
                  name: businessUnitName,
                  ownerId: owner?._id ? owner._id : '',
                },
                organization._id,
                owner?._id || user?._id,
              );
              if ('created' in businessUnit) {
                await log(`\n\tCreated new business unit: ${businessUnit.name}`);
                stats.createdBusinessUnitCount += 1;
              } else await log(`\n\tBusiness unit "${businessUnit.name}" found`);

              // Find category or create new one if doesn't yet exist
              const category = await Categories.customFindOneOrCreateOne(
                {
                  name: sheet,
                },
                organization._id,
                owner?._id || user?._id,
              );
              if ('created' in category) {
                await log(`\n\tCreated new category: ${category.name}`);
                stats.createdCategoryCount += 1;
              } else await log(`\n\tCategory "${category.name}" found`);

              // Find regulatory body or create new one if doesn't yet exist
              const regulatoryBody = await RegulatoryBodies.customFindOneOrCreateOne(
                {
                  name: 'UKAS',
                },
                organization._id,
                owner?._id || user?._id,
              );
              if ('created' in regulatoryBody) {
                await log(`\n\tCreated new regulatory body: ${regulatoryBody.name}`);
                stats.createdRegulatoryBodyCount += 1;
              } else await log(`\n\tRegulatory body "${regulatoryBody.name}" found`);

              // Find location or create new one if doesn't yet exist
              const location = await Locations.customFindOneOrCreateOne(
                {
                  name: 'BRE Group Watford',
                  ownerId: owner?._id || user?._id,
                },
                organization._id,
                owner?._id || user?._id,
              )
              if ('created' in location) {
                await log(`\n\tCreated new location: ${location.name}`);
                stats.createdLocationCount += 1;
              } else await log(`\n\tLocation "${location.name}" found`);

              let version;
              if (data.Version !== undefined) {
                await log(`\n\tFound version number: ${data.Version}`);
                if (!Number.isNaN(Number(data.Version)))
                  version = parseFloat(data.Version.toString()).toFixed(1);
                else await log('\n\tVersion is not correct number, leaving empty');
              } else await log('\n\tMissing version number, leaving empty');

              const trackerItem = generateTrackerItemTemplate({
                name: typeof data['Document Number'] === 'string' ? `${data['Document Number']} - ${data['Title/Description']}` : data['Title/Description'],
                description: '',
                categoryId: category._id,
                regulatoryBodyId: regulatoryBody._id,
                businessUnitsIds: [businessUnit._id],
                locationsIds: [location._id],
                version,
                selectedStatus: status,
              });

              const reference = await TrackerItems.customGenerateReference();
              await log(`\n\tGenerated reference number: ${reference}`);

              const newTrackerItem: { [x: string]: any; } = {
                ...trackerItem,
                reference,
              };

              await log('\n\tAdding tracker item to the database...');
              const createdTrackerItem = await TrackerItems.customCreate(
                newTrackerItem,
                owner?._id || user?._id,
                organization._id,
              );
              await log('\n\tTracker item added succesfully');
              await TrackerItems.customSynchronizeResponses({
                trackerItem: createdTrackerItem,
                userId: owner?._id || user?._id,
                organizationId: organization._id,
              });

              // Update response data
              const response = await Responses.customFindOne({ trackerItemId: createdTrackerItem._id }, organization._id);
              if (!response) throw new Error('\n\tCould not find created response');

              let lastCompletionDate;
              if ('Effective from Date' in data) {
                const effectiveDate = data['Effective from Date'];
                if (isDate(effectiveDate)) {
                  await log(`\n\tLast completion date set to ${effectiveDate}`);
                  lastCompletionDate = new Date(effectiveDate);
                } else await log('\n\tEffective from Date is not correct date, leaving empty');
              } else await log('\n\tMissing last completion date, leaving empty');

              let dueDate;
              if ('Next Review Due' in data) {
                const nextReviewDate = data['Next Review Due'];
                if (isDate(nextReviewDate)) {
                  await log(`\n\tDue date set to ${nextReviewDate}`);
                  dueDate = new Date(nextReviewDate);
                } else await log('\n\tNext Review Due is not correct date, leaving empty');
              } else await log('\n\tMissing due date, leaving empty');

              if (!dueDate && lastCompletionDate) dueDate = getNextRenewalDate(lastCompletionDate, trackerItem.frequency)

              await Responses.customUpdateOne({ _id: response._id }, {
                lastCompletionDate,
                dueDate,
                status: 'submitted',
                accountableId: owner?._id || user?._id,
                responsibleId: owner?._id || user?._id,
              }, owner?._id || user?._id, organization._id);

              await log('\n\tResponse synchronized succesfully');
              insertedTrackerItem.push(true);
            } catch (error: any) {
              insertedTrackerItem.push(false);
              await log(`\n\tDocument not inserted due to error: ${error.message}`);
            }
          }
        }
      } catch (error: any) {
        insertedTrackerItem.push(false);
        await log(`\nDocument not inserted due to error: ${error.message}`);
      }
    }

    await log(`\n\nMigration script summary\n
Parsed tracker items: ${insertedTrackerItem.length}
Inserted tracker items: ${insertedTrackerItem.filter(Boolean).length}
Not inserted due to missing fields: ${insertedTrackerItem.filter(item => !item).length}
Categories created: ${stats.createdCategoryCount}
Regulatory bodies created: ${stats.createdRegulatoryBodyCount}
Business units created: ${stats.createdBusinessUnitCount}
Locations created: ${stats.createdLocationCount}
Owners found: ${stats.ownerFoundCount}
Owners not found: ${stats.ownerNotFoundCount}
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
      message: `${insertedTrackerItem.filter(Boolean).length} out of ${insertedTrackerItem.length} is inserted in database, ${insertedTrackerItem.filter(item => !item).length} is not inserted due to missing fields`,
    })
  }
  return res.status(StatusCodes.BAD_REQUEST).json({ error: 'File is not uploaded' })
};

export default createBREGlobalDocuments;

