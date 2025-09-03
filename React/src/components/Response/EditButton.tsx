import React, { forwardRef } from 'react';

import { EditIcon } from '@chakra-ui/icons';

interface Props {
  onClick?: () => void;
}

const EditButton = forwardRef(({ onClick }: Props, ref: React.ForwardedRef<SVGSVGElement>) => (
  <EditIcon
    data-id="030925-6a1102"
    color="responseRenewalDetails.editButtonColor"
    cursor="pointer"
    mx="1"
    onClick={(e) => {
      e.stopPropagation()
      if (onClick) onClick()
    }}
    ref={ref} />
));

export default EditButton;
