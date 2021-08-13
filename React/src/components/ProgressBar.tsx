import React from "react";
import { Progress } from "@chakra-ui/progress";

interface IProgressBar {
  value: number;
}

const ProgressBar = ({ value }: IProgressBar) => {
  return (
    <Progress
      width={55}
      value={value}
      height={1}
      mr="2"
      colorScheme="#FFFFFF"
      borderRadius="20px"
    />
  );
};

export default ProgressBar;
