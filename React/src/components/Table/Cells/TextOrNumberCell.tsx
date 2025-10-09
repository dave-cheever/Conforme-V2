import React from 'react';

import { Flex, Tooltip } from '@chakra-ui/react';

interface TextOrNumberCellProps {
  readonly color?: string;
  readonly text?: string | number;
  readonly fallbackText?: string;
  readonly fontSize?: string | number;
  readonly fontWeight?: string | number;
  readonly lineHeight?: string | number;
  readonly noOfLines?: number;
  readonly dataId?: string;
  readonly tooltip?: string;
}

/**
 * TextOrNumberCell - A flexible table cell component for displaying text or numeric values
 * 
 * This component renders text or numbers in a table cell with customizable styling and optional tooltip.
 * The color prop can be dynamically set based on the cell's value or row data to provide visual
 * indicators (e.g., status colors, priority levels, or conditional formatting).
 * 
 * @param color - CSS color value or theme token. Can be dynamic based on cell value (default: "row.color")
 * @param text - The text or number to display in the cell
 * @param fallbackText - Text to show when the main text is empty or undefined (default: "-")
 * @param fontSize - Font size for the text (default: "14px")
 * @param fontWeight - Font weight for the text (default: "500")
 * @param lineHeight - Line height for the text (default: "18px")
 * @param noOfLines - Maximum number of lines before truncation (default: 1)
 * @param dataId - Data attribute for testing/tracking purposes (default: "000235")
 * @param tooltip - Optional tooltip text to display on hover
 * 
 * @example
 * // Basic usage
 * <TextOrNumberCell text="Sample Text" />
 * 
 * @example
 * // With dynamic color based on status
 * <TextOrNumberCell 
 *   text={row.status} 
 *   color={row.status === 'active' ? 'green.500' : 'red.500'} 
 * />
 * 
 * @example
 * // With tooltip for truncated content
 * <TextOrNumberCell 
 *   text="Very long text that might be truncated" 
 *   tooltip="Very long text that might be truncated"
 * />
 */


function TextOrNumberCell({
  color="row.color",
  text,
  fallbackText = "-",
  fontSize = "14px",
  fontWeight = "500",
  lineHeight = "18px",
  noOfLines = 1,
  dataId = "000235",
  tooltip,
}: TextOrNumberCellProps) {
  const textElement = (
    <Flex
      align="flex-start"
      data-id={dataId}
      color={color}
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

export default TextOrNumberCell;
