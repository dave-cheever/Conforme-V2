import { v4 as uuidv4 } from 'uuid';

import { IBaseWithName } from 'app-interfaces';
import { RegulatoryBodies } from 'app-models';
import { genMetatags, isPermitted } from 'app-utils';


const updateRegulatoryBody = async (_, { regulatoryBodyInput }, { authorize, organization }) => {
  try {
    const user = await authorize();

    if (!isPermitted({ user, action: 'regulatoryBodies.edit', data: regulatoryBodyInput })) {
      throw new Error('User is not permitted');
    }

    const regulatoryBody = await RegulatoryBodies.customFindById(regulatoryBodyInput._id, organization._id);
    if (!regulatoryBody) {
      throw new Error('Regulatory body doesn\'t exist');
    }

    const updatedRegulatoryBody = await RegulatoryBodies.customUpdateOne({ _id: regulatoryBody._id }, { name: regulatoryBodyInput.name }, user._id, organization._id);
    return updatedRegulatoryBody;
  } catch (err: any) {
    throw new Error(err);
  }
};

export default updateRegulatoryBody;
