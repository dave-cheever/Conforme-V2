import React, { forwardRef } from 'react';

import { EditIcon } from '@chakra-ui/icons';

interface Props {
  onClick?: () => void;
}

const EditButton = forwardRef(({ onClick }: Props, ref: React.ForwardedRef<SVGSVGElement>) => (
  <EditIcon
    color="responseRenewalDetails.editButtonColor"
    cursor="pointer"
    data-id="721ef9b805a3"
    mx="1"
    onClick={(e) => {
      e.stopPropagation()
      if (onClick) onClick()
    }}
    ref={ref} />
));

export default EditButton;
