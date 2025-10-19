import React from 'react';

import { Flex, Text } from '@chakra-ui/react';

interface NoRecordsFoundProps {
  /** The name of the data source (e.g., "audits", "tracker items", "actions") */
  readonly dataSourceName: string;
  /** Optional custom message to display instead of the default */
  readonly message?: string;
  /** Height of the container - defaults to full height */
  readonly height?: string | string[];
  /** Additional styling props */
  readonly containerProps?: {
    readonly alignItems?: string;
    readonly justifyContent?: string;
    readonly fontSize?: string | string[];
    readonly fontStyle?: string;
    readonly color?: string;
    readonly bg?: string;
    readonly p?: string | number;
  };
  /** Data ID for testing */
  readonly 'data-id'?: string;
}

/**
 * A reusable component for displaying "No records found" messages
 * with customizable data source names and full height container
 */
function NoRecordsFound({
  dataSourceName,
  message,
  height = '100%',
  containerProps = {},
  'data-id': dataId = 'no-records-found',
}: NoRecordsFoundProps) {
  const defaultMessage = `No ${dataSourceName} found. Try adjusting the filters.`;
  const displayMessage = message || defaultMessage;

  const defaultContainerProps = {
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
    fontStyle: 'italic',
    color: 'gray.600',
    bg: 'transparent',
    p: 0,
  };

  const mergedContainerProps = { ...defaultContainerProps, ...containerProps };

  return (
    <Flex
      data-id={dataId}
      h={height}
      w="full"
      {...mergedContainerProps}
    >
      <Text
        color={mergedContainerProps.color}
        data-id={`${dataId}-text`}
        fontSize={mergedContainerProps.fontSize}
        fontStyle={mergedContainerProps.fontStyle}
        textAlign="center"
      >
        {displayMessage}
      </Text>
    </Flex>
  );
}

export default NoRecordsFound;