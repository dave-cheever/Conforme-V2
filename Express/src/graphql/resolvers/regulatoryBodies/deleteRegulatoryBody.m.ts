import { v4 as uuidv4 } from 'uuid';

import { IBaseWithName } from 'app-interfaces';
import { RegulatoryBodies } from 'app-models';
import { genMetatags, isPermitted } from 'app-utils';


const deleteRegulatoryBody = async (_, { _id }, { authorize }) => {
  try {
    const user = await authorize();
    
    if (!isPermitted({ user, action: 'regulatoryBodies.delete', data: { _id } })) {
      throw new Error('User is not permitted');
    }

    const regulatoryBody = await RegulatoryBodies.customFindById(_id);
    if (!regulatoryBody) {
      throw new Error('Regulatory body doesn\'t exist');
    }

    const deletedRegulatoryBody = {
      ...regulatoryBody,
      metatags: {
        ...regulatoryBody?.metatags,
        ...genMetatags('removed', user._id),
      },
    };
    await RegulatoryBodies.updateOne({ _id: regulatoryBody._id }, deletedRegulatoryBody);

    return true;
  } catch (err: any) {
    throw new Error(err);
  }
};

export default deleteRegulatoryBody;
