import { ComplianceItems } from 'app-models';
import { isPermitted } from 'app-utils';

const createComplianceItem = async (
  _,
  { complianceItemInput },
  { authorize, organization },
) => {
  try {
    const user = await authorize();

    if (!isPermitted({ user, action: 'complianceItems.add' }))
      throw new Error('User is not permitted');

    const reference = await ComplianceItems.customGenerateReference();
    const newComplianceItem = {
      ...complianceItemInput,
      reference,
    };

    const createdComplianceItem = await ComplianceItems.customCreate(
      newComplianceItem,
      user._id,
      organization._id,
    );

    ComplianceItems.customSynchronizeResponses({
      complianceItem: createdComplianceItem,
      userId: user._id,
      organizationId: organization._id,
    });

    return createdComplianceItem;
  } catch (err: any) {
    throw new Error(err);
  }
};

export default createComplianceItem;
