import { CleanedWhere, createAdapter } from "better-auth/adapters";
import { Db } from "mongodb";

export const mongodbCustomAdapter = (db: Db) => {
  return createAdapter({
    config: {
      adapterId: "mongodb-custom",
      adapterName: "MongoDB Custom Adapter",
      mapKeysTransformInput: {
        id: "_id",
      },
      mapKeysTransformOutput: {
        _id: "id",
      },
    },
    adapter: () => {
      const convertWhere = (where?: CleanedWhere[]) => {
        if (!where) {
          return {};
        }

        if (!Array.isArray(where)) {
          return where;
        }

        if (where.length === 0) {
          return {};
        }

        // Convert each Where object to MongoDB query format
        const andConditions: any[] = [];
        const orConditions: any[] = [];

        for (const condition of where) {
          // Handle field name - convert 'id' to '_id' for MongoDB
          const field = condition.field === 'id' ? '_id' : condition.field;
          const operator = condition.operator || 'eq';
          const value = condition.value;

          // Convert operator to MongoDB operator
          let mongoCondition: any = {};
          
          switch (operator) {
            case 'eq':
              // Make email field comparisons case-insensitive
              // REASON: When the user login second time, the email is not the same as the one in the database, so we need to make the comparison case-insensitive
              if (field === 'email' && typeof value === 'string') {
                mongoCondition[field] = { $regex: `^${String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, $options: 'i' };
              } else {
                mongoCondition[field] = value;
              }
              break;
            case 'ne':
              // Make email field comparisons case-insensitive
              // REASON: When the user login second time, the email is not the same as the one in the database, so we need to make the comparison case-insensitive
              if (field === 'email' && typeof value === 'string') {
                mongoCondition[field] = { $not: { $regex: `^${String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, $options: 'i' } };
              } else {
                mongoCondition[field] = { $ne: value };
              }
              break;
            case 'lt':
              mongoCondition[field] = { $lt: value };
              break;
            case 'lte':
              mongoCondition[field] = { $lte: value };
              break;
            case 'gt':
              mongoCondition[field] = { $gt: value };
              break;
            case 'gte':
              mongoCondition[field] = { $gte: value };
              break;
            case 'in':
              mongoCondition[field] = { $in: value };
              break;
            case 'not_in':
              mongoCondition[field] = { $nin: value };
              break;
            case 'contains':
              mongoCondition[field] = { $regex: String(value), $options: 'i' };
              break;
            case 'starts_with':
              mongoCondition[field] = { $regex: `^${String(value)}`, $options: 'i' };
              break;
            case 'ends_with':
              mongoCondition[field] = { $regex: `${String(value)}$`, $options: 'i' };
              break;
            default:
              mongoCondition[field] = value;
          }

          const connector = condition.connector || 'AND';
          if (connector === 'OR') {
            orConditions.push(mongoCondition);
          } else {
            andConditions.push(mongoCondition);
          }
        }

        const finalQuery: any = {};
        if (orConditions.length > 0) {
          if (orConditions.length === 1) {
            Object.assign(finalQuery, orConditions[0]);
          } else {
            finalQuery.$or = orConditions;
          }
        }

        if (andConditions.length > 0) {
          if (andConditions.length === 1) {
            Object.assign(finalQuery, andConditions[0]);
          } else {
            if (finalQuery.$or) {
              return { $and: [{ $or: finalQuery.$or }, ...andConditions] };
            } else {
              for (const condition of andConditions) {
                Object.assign(finalQuery, condition);
              }
            }
          }
        }

        return finalQuery;
      };

      return {
        create: async ({ model, data }) => {
          const result = await db.collection(model).insertOne(data);
          const inserted: any = await db.collection(model).findOne({ _id: result.insertedId });
          return inserted as any;
        },
        update: async ({ model, where, update }) => {
          const whereClause = convertWhere(where);
          await db.collection(model).updateOne(whereClause, { $set: update });
          const updated: any = await db.collection(model).findOne(whereClause);
          return updated as any;
        },
        updateMany: async ({ model, where, update }) => {
          const whereClause = convertWhere(where);
          const result = await db.collection(model).updateMany(whereClause, { $set: update });
          return result.modifiedCount;
        },
        findOne: async ({ model, where }) => {
          const whereClause = convertWhere(where);
          const found: any = await db.collection(model).findOne(whereClause);
          return found as any;
        },
        findMany: async ({ model, where }) => {
          const whereClause = convertWhere(where);
          const results = await db.collection(model).find(whereClause).toArray();
          return results as any;
        },
        delete: async ({ model, where }) => {
          const whereClause = convertWhere(where);
          await db.collection(model).deleteOne(whereClause);
        },
        deleteMany: async ({ model, where }) => {
          const whereClause = convertWhere(where);
          const result = await db.collection(model).deleteMany(whereClause);
          return result.deletedCount;
        },
        count: async ({ model, where }) => {
          const whereClause = convertWhere(where);
          return await db.collection(model).countDocuments(whereClause);
        },
      };
    },
  });
};