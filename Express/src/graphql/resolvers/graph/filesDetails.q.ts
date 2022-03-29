import { GraphService } from 'app-services';

const filesDetails = async (_, { filesDetailsQuery }, { organization }) => {
  try {
    const files: {
      id: string;
      thumbnail: string;
      path: string;
      preview: string;
    }[] = [];
    for (const id of filesDetailsQuery.ids) {
      const fileDetails = await GraphService.getFileDetails(id, organization);
      files.push({
        id,
        ...fileDetails,
      });
    }

    return files;
  } catch (err: any) {
    throw new Error(err);
  }
};

export default filesDetails;
