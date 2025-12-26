import React from 'react';

import { Box, Button, Divider, Flex, IconButton, Menu, MenuButton, MenuItem, MenuList, Text } from '@chakra-ui/react';
import { format } from 'date-fns';
import { get } from 'lodash';

import useDevice from '../../hooks/useDevice';
import { EllipsisIcon } from '../../icons';
import { PanelFieldConfig, PanelViewProps } from '../../interfaces/IPanelConfig';
import AvatarCell from '../Table/Cells/AvatarCell';
import StatusCell from '../Table/Cells/StatusCell';
import { Pagination } from '../UI';

// Utility function to get nested object values
const getNestedValue = (obj: any, path: string): any => get(obj, path, null);

// Utility function to format dates
const formatDate = (date: any, formatString: string = 'd MMM yyyy'): string => {
  if (!date) return '';
  try {
    return format(new Date(date), formatString);
  } catch {
    return '';
  }
};

// Utility function to normalize user values to array format
const normalizeUsers = (value: any): any[] => {
  if (Array.isArray(value)) {
    return value;
  }
  if (typeof value === 'string') {
    // Legacy support: strings are converted to user objects (ideally should be removed)
    return [{ _id: '1', displayName: value }];
  }
  return [value || []].flat();
};

// Component to render individual field values
function FieldRenderer({
  config,
  item,
  fontSize,
  textColor,
  fontWeight,
  dataId,
  noOfLines,
  overflow,
  textOverflow,
  whiteSpace,
}: {
  readonly config: PanelFieldConfig;
  readonly item: any;
  readonly fontSize?: string | string[];
  readonly textColor?: string;
  readonly fontWeight?: number;
  readonly dataId?: string;
  readonly noOfLines?: number | number[];
  readonly overflow?: string | string[];
  readonly textOverflow?: string | string[];
  readonly whiteSpace?: string | string[];
}) {
  const value = getNestedValue(item, config.key);

  if (config.render) return <>{config.render(value, item)}</>;

  switch (config.type) {
    case 'text': {
      return (
        <Text
          color={textColor || '#4A5568'}
          data-id={dataId || '001402'}
          fontSize={fontSize || '14px'}
          fontWeight={fontWeight || 'normal'}
          noOfLines={noOfLines}
          overflow={overflow}
          textOverflow={textOverflow}
          whiteSpace={whiteSpace}
        >
          {value || config.fallback || '-'}
        </Text>
      );
    }

    case 'badge': {
      return <StatusCell data-id="002484" fallback={config.fallback} status={value} />;
    }

    case 'date': {
      const formattedDate = formatDate(value, config.dateFormat);
      return (
        <Text color={textColor || '#4A5568'} data-id={dataId} fontSize={fontSize || '14px'} fontWeight={fontWeight || 'normal'}>
          {formattedDate || config.fallback || '-'}
        </Text>
      );
    }

    case 'user': {
      const normalizedUsers = normalizeUsers(value);

      return (
        <AvatarCell
          data-id={dataId}
          noDataText={config.fallback || 'Unassigned'}
          users={normalizedUsers}
          userType={config.userType || 'assigned'}
        />
      );
    }

    case 'custom':
    default: {
      return (
        <Text color={textColor || '#4A5568'} data-id={dataId} fontSize={fontSize || '14px'} fontWeight={fontWeight || 'normal'}>
          {value || config.fallback || '-'}
        </Text>
      );
    }
  }
}

// Sub-component for panel header
function PanelHeader({ config, item, index }: { readonly config: any; readonly item: any; readonly index: number }) {
  if (!config.header?.show) return null;

  return (
    <Box
      bg="#2D3748"
      borderTopRadius="14px"
      color="white"
      data-id={`header-${index + 2}`}
      height={'42px'}
      pb={'6px'}
      position={'relative'}
      pt={'4px'}
      px={'14px'}
    >
      <Box alignItems="center" data-id="001404" display="flex" flexWrap="wrap" gap={3}>
        {config.header.fields.map((field: any, fieldIndex: number) => (
          <React.Fragment key={field.key || `header-field-${fieldIndex}`}>
            <Box alignItems="center" data-id="001405" display="flex" gap={1}>
              {field.icon && <field.icon />}
              <FieldRenderer
                config={field}
                data-id="001406"
                dataId={`header-field-${index + 2}-${fieldIndex}`}
                fontSize="12px"
                fontWeight={600}
                item={item}
                textColor="white"
              />
            </Box>
            {fieldIndex < config.header.fields.length - 1 && (
              <Text color="#4A5568" data-id="001407" fontSize="16px">
                •
              </Text>
            )}
          </React.Fragment>
        ))}
      </Box>
    </Box>
  );
}

// Sub-component for mobile action menu
function MobileActionMenu({ config, item, index }: { readonly config: any; readonly item: any; readonly index: number }) {
  return (
    <Menu data-id="001517">
      <MenuButton
        aria-label="Actions"
        as={IconButton}
        background="white"
        borderColor="#CBD5E0"
        borderWidth="1px"
        data-id={`action-dropdown-${index + 2}`}
        height="28px"
        icon={<EllipsisIcon data-id="001518" />}
        onClick={(e) => e.stopPropagation()}
        variant="outline"
      />
      <MenuList data-id="001519">
        <MenuItem
          data-id={`action-menu-item-${index + 2}`}
          icon={config.actions.primary.icon ? <config.actions.primary.icon /> : undefined}
          onClick={(e) => {
            e.stopPropagation();
            config.actions.primary?.onClick(item);
          }}
        >
          {config.actions.primary.label}
        </MenuItem>
        {config.actions.secondary && (
          <MenuItem
            data-id={`secondary-action-menu-item-${index + 2}`}
            onClick={(e) => {
              e.stopPropagation();
              config.actions.secondary?.onClick(item);
            }}
          >
            {config.actions.secondary.label}
          </MenuItem>
        )}
      </MenuList>
    </Menu>
  );
}

// Sub-component for desktop action button
function DesktopActionButton({ config, item, index }: { readonly config: any; readonly item: any; readonly index: number }) {
  const hasSecondaryActions = config.actions.secondaryActions && config.actions.secondaryActions.length > 0;

  return (
    <Flex align="center" data-id="002369" gap="10px">
      {/* Secondary actions dropdown */}
      {hasSecondaryActions && (
        <>
          <Menu data-id="secondary-actions-menu">
            <MenuButton
              aria-label="More actions"
              as={IconButton}
              background="white"
              borderColor="#CBD5E0"
              borderRadius="6px"
              borderWidth="1px"
              data-id={`secondary-actions-button-${index + 2}`}
              height="28px"
              icon={<EllipsisIcon data-id="secondary-ellipsis" />}
              onClick={(e) => e.stopPropagation()}
              variant="outline"
            />
            <MenuList data-id="secondary-actions-menu-list">
              {config.actions.secondaryActions.map((action: any, actionIndex: number) => (
                <MenuItem
                  data-id={`secondary-action-${index + 2}-${actionIndex}`}
                  icon={action.icon ? <action.icon /> : undefined}
                  key={action.label}
                  onClick={(e) => {
                    e.stopPropagation();
                    action.onClick(item);
                  }}
                >
                  {action.label}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>

          {/* Vertical divider */}
          <Box borderLeft="1px solid #E2E8F0" data-id={`divider-${index + 2}`} height="28px" width="1px" />
        </>
      )}
      {/* Primary action button */}
      <Button
        background="white"
        borderColor="#CBD5E0"
        borderRadius="6px"
        borderWidth="1px"
        data-id={`action-button-${index + 2}`}
        fontSize="12px"
        fontWeight="normal"
        height="28px"
        leftIcon={config.actions.primary.icon ? <config.actions.primary.icon /> : undefined}
        onClick={(e) => {
          e.stopPropagation();
          config.actions.primary?.onClick(item);
        }}
        padding="0px 8px"
      >
        {config.actions.primary.label}
      </Button>
    </Flex>
  );
}

// Sub-component for action rendering
function ActionRenderer({
  config,
  item,
  index,
  isMobile,
}: {
  readonly config: any;
  readonly item: any;
  readonly index: number;
  readonly isMobile: boolean;
}) {
  if (!config.actions.primary) return null;

  return isMobile ? (
    <MobileActionMenu config={config} data-id="002176" index={index} item={item} />
  ) : (
    <DesktopActionButton config={config} data-id="002177" index={index} item={item} />
  );
}

// Sub-component for linked item section
function LinkedItemSection({ config, item, index }: { readonly config: any; readonly item: any; readonly index: number }) {
  if (!config.linkedItem?.show || !getNestedValue(item, config.linkedItem.fieldKey)) return null;

  return (
    <Box data-id={`linked-item-${index + 2}`} p={'14px'}>
      {config.linkedItem.render ? (
        config.linkedItem.render(getNestedValue(item, config.linkedItem.fieldKey), item)
      ) : (
        <Box
          background={'#F7FAFC'}
          borderRadius={{ base: '4px', md: '6px' }}
          data-id="001521"
          px={{ base: '10px', md: '12px' }}
          py={{ base: '6px', md: '10px' }}
        >
          <Text color="#3182CE" data-id={`linked-value-${index + 2}`} fontSize="14px" fontWeight="500">
            {getNestedValue(item, config.linkedItem.fieldKey)}
          </Text>
        </Box>
      )}
    </Box>
  );
}

// Main PanelView component
function PanelView({
  items,
  config,
  containerProps = { bg: '#F7FAFC', p: '14px', pt: '24px', gap: '24px' },
  error,
  emptyStateMessage = 'No items found',
  dataSourceName,
  currentPage,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
}: Readonly<PanelViewProps>) {
  const device = useDevice();
  const isMobile = device === 'mobile';

  // Handle error state
  if (error) {
    return (
      <Box
        alignItems="center"
        as="main"
        bg={containerProps.bg}
        data-id="1"
        display="flex"
        flexDirection="column"
        h="200px"
        justifyContent="center"
        minW="100%"
        p={containerProps.p}
        w="100%"
      >
        <Text color="red.500" data-id="002524" fontSize="lg" fontWeight="medium" textAlign="center">
          {error}
        </Text>
      </Box>
    );
  }

  return (
    <Flex bg={containerProps.bg} as="main" data-id="1" flexDirection="column" h="full" minW="100%" position="relative" w="100%">
      <Box data-id="panel-view-content" flex="1" overflowY="auto" p={containerProps.p} pt={containerProps.pt}>
        <Flex data-id="panel-view-items" flexDirection="column" gap={containerProps.gap} w="100%">
          {items?.map((item, index) => (
            <Flex data-id={index + 2} display={'flex'} flexDirection={'column'} key={`panel-view-item-${item._id || index}`}>
              <PanelHeader config={config} data-id="002178" index={index} item={item} />

              <Box
                _hover={{
                  borderColor: '#9FA7AF',
                  boxShadow: '0 2px 10px 0 rgba(26, 32, 44, 0.12)',
                }}
                bg="white"
                borderColor="#C4D0DD"
                borderRadius="12px"
                borderWidth="1px"
                boxShadow="0 2px 2px 0 rgba(26, 32, 44, 0.08)"
                cursor="pointer"
                data-id={`panel-${index + 2}`}
                display={'flex'}
                flexDirection={'column'}
                key={item._id || index}
                marginTop={'-10px'}
                onClick={() => config.actions.panelClick?.onClick(item)}
                rowGap={'7px'}
                transition="all 300ms ease-out"
                zIndex={5}
              >
                {/* Header with title and primary action */}
                <Box borderTopLeftRadius={'12px'} borderTopRightRadius={'12px'} data-id={`panel-header-${index + 2}`} pt={4} px={4}>
                  <Flex data-id="001408" justify="space-between" pb={2} w="full">
                    <Box data-id="001409">
                      <FieldRenderer
                        config={config.title.primary}
                        data-id="001410"
                        dataId={`title-primary-${index + 2}`}
                        fontSize={['14px', '16px']}
                        fontWeight={500}
                        item={item}
                        textColor="#4A5568"
                      />
                    </Box>
                    <ActionRenderer config={config} data-id="002179" index={index} isMobile={isMobile} item={item} />
                  </Flex>

                  {/* Status section */}
                  <Flex
                    alignItems="center"
                    columnGap="10px"
                    data-id="001411"
                    justifyContent={['space-between', 'flex-start', 'flex-start']}
                    mb="8px"
                  >
                    {config.title.secondary && (
                      <Box data-id="001520" maxW={['200px', 'none', 'none']} minW="0">
                        <FieldRenderer
                          config={config.title.secondary}
                          data-id="001412"
                          dataId={`title-secondary-${index + 2}`}
                          fontSize={['16px', '18px']}
                          fontWeight={600}
                          item={item}
                          noOfLines={[1, 0, 0]}
                          overflow={['hidden', 'undefined', 'undefined']}
                          textColor="#1A202C"
                          textOverflow={['ellipsis', 'undefined', 'undefined']}
                          whiteSpace={['nowrap', 'undefined', 'undefined']}
                        />
                      </Box>
                    )}

                    <Box alignItems="center" data-id="001413" display="flex" flexShrink={0} mb={0}>
                      <FieldRenderer config={config.status} data-id="001414" dataId={`status-${index + 2}`} item={item} />
                    </Box>
                  </Flex>
                </Box>

                {/* Description section */}
                {config.description && (
                  <Box data-id={`panel-description-${index + 2}`} px={4} py={0}>
                    <FieldRenderer config={config.description} data-id="001420" dataId={`description-${index + 2}`} item={item} />
                  </Box>
                )}

                <LinkedItemSection config={config} data-id="002180" index={index} item={item} />

                <Divider data-id="001415" />

                {/* Details section */}
                <Box data-id={`panel-details-${index + 2}`} px={4} py={2}>
                  <Box alignItems="center" data-id="001416" display="flex" flexWrap="wrap" gap={'24px'}>
                    {config.details.map((detail: any, detailIndex: number) => (
                      <React.Fragment key={detail.key || `detail-${detailIndex}`}>
                        <Box alignItems="center" data-id="001417" display="flex" gap={1}>
                          {detail.icon && <detail.icon />}
                          <FieldRenderer
                            config={detail}
                            data-id="001418"
                            dataId={`detail-${index + 2}-${detailIndex}`}
                            fontSize="12px"
                            fontWeight={600}
                            item={item}
                            textColor="#4A5568"
                          />
                        </Box>
                      </React.Fragment>
                    ))}
                  </Box>
                </Box>
              </Box>
            </Flex>
          ))}
        </Flex>
      </Box>
      <Pagination
        data-id="003088"
        currentPage={currentPage}
        pageSize={pageSize}
        total={total}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
      />
    </Flex>
  );
}

// Memoize PanelView to prevent unnecessary re-renders when props haven't changed
export default React.memo(PanelView);
