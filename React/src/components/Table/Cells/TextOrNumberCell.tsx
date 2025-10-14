import React, { ComponentType } from 'react';

import { Box, Flex, Tooltip } from '@chakra-ui/react';

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
  readonly icon?: ComponentType<any>;
  readonly iconPosition?: 'before' | 'after';
  readonly iconSize?: string | number;
  readonly iconSpacing?: string | number;
}

/**
 * TextOrNumberCell - A flexible table cell component for displaying text or numeric values with optional icons
 *
 * This component renders text or numbers in a table cell with customizable styling, optional tooltip, and icon support.
 * The color prop can be dynamically set based on the cell's value or row data to provide visual
 * indicators (e.g., status colors, priority levels, or conditional formatting).
 * Icons can be positioned before or after the text with customizable spacing and sizing.
 * When an icon is present, a grey circle separator is automatically displayed between the icon and text.
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
 * @param icon - React component for the icon to display (e.g., CheckIcon, WarningIcon)
 * @param iconPosition - Position of the icon relative to text ('before' or 'after') (default: "before")
 * @param iconSize - Size of the icon (default: "16px")
 * @param iconSpacing - Spacing between icon and text (default: "4px")
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
 *
 * @example
 * // With icon before text (includes grey circle separator)
 * <TextOrNumberCell
 *   text="Completed"
 *   icon={CheckIcon}
 *   color="green.500"
 * />
 *
 * @example
 * // With icon after text and custom spacing
 * <TextOrNumberCell
 *   text="Warning"
 *   icon={WarningIcon}
 *   iconPosition="after"
 *   iconSize="18px"
 *   iconSpacing="6px"
 *   color="orange.500"
 * />
 */

function TextOrNumberCell({
  color = 'row.color',
  text,
  fallbackText = '-',
  fontSize = '14px',
  fontWeight = '500',
  lineHeight = '18px',
  noOfLines = 1,
  dataId = '000235',
  tooltip,
  icon,
  iconPosition = 'before',
  iconSize = '16px',
  iconSpacing = '4px',
}: TextOrNumberCellProps) {
  const IconComponent = icon
    ? React.createElement(icon, {
        boxSize: iconSize,
        color,
        'data-id': `${dataId}-icon`,
      })
    : null;

  const greyCircle = icon ? <Box bg="gray.300" borderRadius="50%" data-id={`${dataId}-separator`} h="4px" mr="2px" w="4px" /> : null;

  const textContent = (
    <Flex align="center" data-id="002181" flexDirection="row" gap={iconSpacing}>
      {icon && iconPosition === 'before' && (
        <>
          {IconComponent}
          {greyCircle}
        </>
      )}
      <Flex
        align="flex-start"
        color={color}
        data-id={`${dataId}-text`}
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
      {icon && iconPosition === 'after' && (
        <>
          {greyCircle}
          {IconComponent}
        </>
      )}
    </Flex>
  );

  if (tooltip?.trim()) {
    return (
      <Tooltip data-id="002148" label={tooltip}>
        {textContent}
      </Tooltip>
    );
  }

  return textContent;
}

export default TextOrNumberCell;
