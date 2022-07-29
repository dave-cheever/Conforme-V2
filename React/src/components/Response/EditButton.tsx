import React, { forwardRef } from 'react';

import { EditIcon } from '@chakra-ui/icons';

interface Props {
  onClick?: () => void;
}

const EditButton = forwardRef(({ onClick }: Props, ref: React.ForwardedRef<SVGSVGElement>) => (
  <EditIcon color="responseRenewalDetails.editButtonColor" cursor="pointer" mb="2" ml="3" onClick={onClick} ref={ref} />
));

export default EditButton;
