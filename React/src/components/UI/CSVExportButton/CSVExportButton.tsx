import React from 'react';
import { Button, Text, Spinner, Tooltip } from '@chakra-ui/react';
import { ExportIcon } from '../../../icons';
import { ICSVExport } from '../../../interfaces/ICSVExport';

interface CSVExportButtonProps extends ICSVExport {
  onExportClick?: () => void | Promise<void>;
}

export const CSVExportButton = ({
  isLoading = false,
  error = null,
  disabled = false,
  onExportClick,
}: CSVExportButtonProps) => {
  const handleClick = async () => {
    if (onExportClick) {
      await onExportClick();
    }
  };

  const isDisabled = disabled || isLoading || !!error;
  const isEnabled = !isDisabled;

  const buttonContent = (
    <Button
      _hover={
        isEnabled
          ? {
            bg: 'reasponseHeader.buttonLightBgHover',
            color: 'reasponseHeader.buttonLightColorHover',
            cursor: 'pointer',
            '&:hover svg path': { stroke: 'white' },
          }
          : {}
      }
      bg="white"
      borderRadius="10px"
      data-id="csv-export-button"
      disabled={isDisabled}
      isLoading={isLoading}
      loadingText="Exporting..."
      ml={['0', '0', '15px']}
      onClick={handleClick}
      rightIcon={
        isLoading ? (
          <Spinner data-id="013207" size="sm" />
        ) : (
          <ExportIcon data-id="csv-export-icon" height="15px" width="15px" />
        )
      }
    >
      <Text data-id="csv-export-text" fontSize="14px" fontWeight="700">
        Export to CSV
      </Text>
    </Button>

  );

  return (
    <>
      {error ? (
        <Tooltip data-id="013208" label={error} placement="top" hasArrow>
          {buttonContent}
        </Tooltip>
      ) : (
        buttonContent
      )}
    </>
  );
}

export default CSVExportButton;

