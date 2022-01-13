import { EditIcon } from "@chakra-ui/icons";
import React, { forwardRef } from "react";

interface Props {
  onClick?: () => void;
}

const EditButton = forwardRef(
  ({ onClick }: Props, ref: React.ForwardedRef<SVGSVGElement>) => (
    <EditIcon
      ref={ref}
      ml="3"
      onClick={onClick}
      color="responseRenewalDetails.editButtonColor"
      cursor="pointer"
      mb="2"
    />
  )
);

export default EditButton;
