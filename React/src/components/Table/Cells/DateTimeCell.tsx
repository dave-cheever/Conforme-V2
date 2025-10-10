import React from 'react';

import { Flex } from '@chakra-ui/react';
import format from 'date-fns/format';

interface DateTimeProps {
  readonly date?: string | Date;
  readonly fallbackText?: string;
  readonly showTime: boolean;
  readonly bracketsText?: string;
}
/**
 * DateTimeCell Component
 * 
 * A reusable table cell component for displaying formatted date and time values.
 * 
 * Features:
 * - Formats dates with or without time based on the showTime prop
 * - Displays fallback text when no date is provided
 * - Supports optional bracketed text (e.g., "60 days") with custom styling
 * - Responsive text overflow handling with ellipsis
 * - Consistent styling for table display
 * 
 * @param date - The date to format (string or number timestamp)
 * @param fallbackText - Text to display when date is not provided (default: "-")
 * @param showTime - Whether to include time in the formatted output
 * @param bracketsText - Optional text to display in brackets after the date
 */

function DateTimeCell({
  date,
  fallbackText = "-",
  showTime,
  bracketsText,
}: DateTimeProps) {

  const getText = () => {
    if (!date) return fallbackText;
    const formattedDate = showTime ? format(new Date(date), 'd MMM yyyy HH:mm') : format(new Date(date), 'd MMM yyyy');
    return formattedDate;
  };

  const getBracketsText = () => {
    if (!bracketsText) return '';
    return (
      <span
        data-id="002168"
        data-testid="date-time-cell-brackets"
        style={{ color: '#718096', fontSize: '12px', paddingLeft: '6px' }}>({bracketsText})</span>
    );
  };

  return (
    <Flex
      align="flex-start"
      data-id="002169"
      fontSize={"14px"}
      fontWeight={500}
      lineHeight={"18px"}
      noOfLines={1}
      opacity="1"
      overflow="hidden"
      textOverflow="ellipsis"
      whiteSpace="nowrap">
      {getText()}{getBracketsText()}
    </Flex>
  );
}

export default DateTimeCell;
