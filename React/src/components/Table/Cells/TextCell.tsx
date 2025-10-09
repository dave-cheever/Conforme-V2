import React from 'react';

import { Flex, Tooltip } from '@chakra-ui/react';

interface TextCellProps {
  readonly text?: string | number;
  readonly fallbackText?: string;
  readonly fontSize?: string | number;
  readonly fontWeight?: string | number;
  readonly lineHeight?: string | number;
  readonly noOfLines?: number;
  readonly dataId?: string;
  readonly tooltip?: string;
}

function TextCell({
  text,
  fallbackText = "-",
  fontSize = "14px",
  fontWeight = "500",
  lineHeight = "18px",
  noOfLines = 1,
  dataId = "000235",
  tooltip,
}: TextCellProps) {
  const textElement = (
    <Flex
      align="flex-start"
      data-id={dataId}
      fontSize={fontSize}
      fontWeight={fontWeight}
      lineHeight={lineHeight}
      noOfLines={noOfLines}
      opacity="1"
      overflow="hidden"
      textOverflow="ellipsis"
      whiteSpace="nowrap"
    >
      {text || fallbackText}
    </Flex>
  );

  if (tooltip?.trim()) {
    return (
      <Tooltip data-id="002148" label={tooltip}>
        {textElement}
      </Tooltip>
    );
  }

  return textElement;
}

export default TextCell;
