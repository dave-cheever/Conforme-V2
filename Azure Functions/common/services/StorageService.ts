// Reference to the Azure Storage SDK and async version
import * as azure from "azure-storage";
import * as azureTS from "azure-table-storage-async";
import * as bomstrip from "bomstrip";
import {
  BlobServiceClient,
  StorageSharedKeyCredential,
  BlobDownloadResponseModel,
  ContainerClient,
} from "@azure/storage-blob";

import IConfig from "../interfaces/IConfig";

export class StorageService {
  private _tableService: azure.TableService;
  private _blobService: BlobServiceClient;
  private _tableName: string;
  private _containerName: string;
  private _containerClient: ContainerClient;

  public constructor(config: IConfig, name: string) {
    const storageConfig: {
      [key: string]: string;
    } = config.StorageConnectionString.split(";").reduce((acc, curr) => {
      const [key, value] = curr.split("=");
      acc[key] = value;
      return acc;
    }, {});

    const sharedKeyCredential = new StorageSharedKeyCredential(
      storageConfig.AccountName,
      storageConfig.AccountKey
    );

    this._blobService = new BlobServiceClient(
      `https://${storageConfig.AccountName}.blob.core.windows.net`,
      sharedKeyCredential
    );

    this._containerName = name.toLowerCase();
    this._containerClient = this._blobService.getContainerClient(
      this._containerName
    );

    this._tableService = azure.createTableService(
      config.StorageConnectionString
    );
    this._tableName = name;
    azureTS.createTableIfNotExistsAsync(this._tableService, this._tableName);
  }

  public async addItem(item, key: string, ref = "na"): Promise<boolean> {
    try {
      const entGen = azure.TableUtilities.entityGenerator;
      const entity = {
        PartitionKey: entGen.String(key),
        RowKey: entGen.String(key),
        Value: entGen.String(item),
        Ref: entGen.String(ref),
      };

      try {
        await azureTS.insertOrReplaceEntityAsync(
          this._tableService,
          this._tableName,
          entity
        );
        console.log("Inserted storage entity: " + entity.RowKey._);
      } catch (error) {
        console.log("ERROR Inserting entity: " + error.message);
        throw error;
      }

      return true;
    } catch (error) {
      console.log("ERROR AddItem - " + error.message);
      return false;
    }
  }

  public async getItem(key: string): Promise<any> {
    try {
      const result = await azureTS.retrieveEntityAsync(
        this._tableService,
        this._tableName,
        key,
        key
      );
      return result;
    } catch (error) {
      console.log("ERROR Retrieving entity - " + error.message);
      return null;
    }
  }

  public async getItemByRef(type: string, ref: string): Promise<any> {
    try {
      const query = new azure.TableQuery().where(
        "PartitionKey eq ? and Ref == ?)",
        type,
        ref
      );
      const results = await azureTS.queryEntitiesAsync(
        this._tableService,
        this._tableName,
        query,
        null
      );
      return results;
    } catch (error) {
      console.log("ERROR GetItemByRef: " + error.message);
      return null;
    }
  }

  public async addBlob(name: string, content: string) {
    const blockBlobClient = this._containerClient.getBlockBlobClient(name);
    await blockBlobClient.upload(content, Buffer.byteLength(content));
  }

  public async getBlob(name: string): Promise<Buffer> {
    // Get blob content and stream to Buffer
    const blockBlobClient = this._containerClient.getBlockBlobClient(name);
    const downloadBlockBlobResponse: BlobDownloadResponseModel =
      await blockBlobClient.download(0);
    // Return the stream as a buffer with BOM characters stripped
    return await this.streamToBuffer(
      downloadBlockBlobResponse.readableStreamBody!.pipe(new bomstrip())
    );
  }

  // A helper method used to read a Node.js readable stream into a Buffer
  private async streamToBuffer(
    readableStream: NodeJS.ReadableStream
  ): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const chunks: Buffer[] = [];
      readableStream.on("data", (data: Buffer | string) => {
        chunks.push(data instanceof Buffer ? data : Buffer.from(data));
      });
      readableStream.on("end", () => {
        resolve(Buffer.concat(chunks));
      });
      readableStream.on("error", reject);
    });
  }
}
