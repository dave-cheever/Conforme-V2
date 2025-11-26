import { Flex, Select, Text, IconButton } from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon, ChevronDownIcon } from '@chakra-ui/icons';
import useDevice from '../../../hooks/useDevice';
import { PAGINATION_PAGE_SIZE_OPTIONS } from '../../../bootstrap/config';
import { IPagination } from '../../../interfaces/IPagination';

function Pagination({ currentPage, pageSize, total, onPageChange, onPageSizeChange }: Readonly<IPagination>) {
  if (currentPage === undefined || pageSize === undefined || total === undefined || onPageChange === undefined || onPageSizeChange === undefined) return null;
  
  const device = useDevice();
  const isMobile = device === 'mobile';
  const totalPages = Math.ceil(total / pageSize);
  const startItem = total === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, total);

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePageSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newPageSize = Number.parseInt(event.target.value, 10) as (typeof PAGINATION_PAGE_SIZE_OPTIONS)[number];
    onPageSizeChange(newPageSize);
  };

  return (
    <Flex
      align="center"
      data-id="pagination"
      justify="space-between"
      px={4}
      py="11px"
      w="full"
      borderTop='1px solid #CBD5E0'
    >
      <Flex align="center" data-id="pagination-page-size" gap="7px">
        <Text data-id={'pagination-page-size-label'} fontSize="14px" color="#3B3B43" fontWeight="400" lineHeight="100%">
          Show rows per page
        </Text>
        <Select
          data-id="pagination-page-size-select"
          _active={{
            bg: 'dropdown.activeBg',
          }}
          _focus={{
            borderColor: 'dropdown.border.focus.normal',
          }}
          css={{
            paddingTop: '4px',
            paddingBottom: '4px',
            paddingLeft: '8px',
            paddingRight: '20px',
          }}
          fontSize="12px"
          fontWeight="400"
          lineHeight="100%"
          bg="#FFFFFF"
          borderColor="#E2E8F0"
          borderRadius="4px"
          borderWidth="1px"
          cursor="pointer"
          h="24px"
          w="auto"
          icon={<ChevronDownIcon data-id="pagination-page-size-icon" marginLeft="10px" color="#2D3748" />}
          onChange={handlePageSizeChange}
          value={pageSize}
          color="#1A202C"
        >
          {PAGINATION_PAGE_SIZE_OPTIONS.map((option) => (
            <option data-id={`pagination-page-size-option-${option}`} key={option} value={option}>
              {option}
            </option>
          ))}
        </Select>
      </Flex>
      <Flex align="center" data-id="pagination-navigation" gap="10px">
        <Text data-id="pagination-page-info" fontSize="14px" fontWeight="500" lineHeight="100%" color="#3B3B43">
          {startItem} - {endItem} of {total}
        </Text>
        <Flex data-id="003167" align="center" gap={ isMobile ? "18px" : "8px"}>
          <IconButton
            _hover={{
              bg: 'transparent',
            }}
            aria-label="Previous page"
            data-id="pagination-previous-button"
            icon={<ChevronLeftIcon data-id="003168" />}
            isDisabled={currentPage === 1}
            minW="0"
            onClick={handlePrevious}
            variant="ghost"
            size={isMobile ? "lg" : "md"}
            w={isMobile ? "9px" : "7px"}
            h={isMobile ? "13px" : "5px"}
          />
          <IconButton
            _hover={{
              bg: 'transparent',
            }}
            aria-label="Next page"
            data-id="pagination-next-button"
            icon={<ChevronRightIcon data-id="003169" />}
            isDisabled={currentPage >= totalPages}
            minW="0"
            onClick={handleNext}
            variant="ghost"
            size={isMobile ? "lg" : "md"}
            w={isMobile ? "9px" : "7px"}
            h={isMobile ? "13px" : "5px"}
          />
        </Flex>
      </Flex>
    </Flex>
  );
}

export default Pagination;
