import { v4 as uuidv4 } from 'uuid';

import { IBaseWithName } from 'app-interfaces';
import { RegulatoryBodies } from 'app-models';
import { genMetatags, isPermitted } from 'app-utils';


const updateRegulatoryBody = async (_, { regulatoryBodyInput }, { authorize }) => {
  try {
    const user = await authorize();
    
    if (!isPermitted({ user, action: 'regulatoryBodies.edit', data: regulatoryBodyInput })) {
      throw new Error('User is not permitted');
    }

    const regulatoryBody = await RegulatoryBodies.customFindById(regulatoryBodyInput._id);
    if (!regulatoryBody) {
      throw new Error('Regulatory body doesn\'t exist');
    }

    const updatedRegulatoryBody = {
      ...regulatoryBody,
      name: regulatoryBodyInput.name,
      metatags: {
        ...regulatoryBody?.metatags,
        ...genMetatags('updated', user._id),
      },
    };
    await RegulatoryBodies.updateOne({ _id: regulatoryBody._id }, updatedRegulatoryBody);

    return updatedRegulatoryBody;
  } catch (err: any) {
    throw new Error(err);
  }
};

export default updateRegulatoryBody;
