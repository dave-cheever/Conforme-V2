import React from 'react';

import { Badge, Box, Button, Divider, Flex, IconButton, Menu, MenuButton, MenuItem, MenuList, Text } from '@chakra-ui/react';
import { format } from 'date-fns';
import { get } from 'lodash';

import useDevice from '../../hooks/useDevice';
import { EllipsisIcon } from '../../icons';
import { PanelFieldConfig, PanelViewProps } from '../../interfaces/IPanelConfig';

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
          data-id={dataId || '001402'}
          color={textColor || '#4A5568'}
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
      const statusConfig = config.badgeConfig?.statusConfig?.[value];
      const displayValue = statusConfig?.text || config.badgeConfig?.valueMap?.[value] || value || config.fallback || 'Unknown';
      const colorScheme = statusConfig?.colorScheme || config.badgeConfig?.colorScheme;
      const bg = statusConfig?.bg;
      const badgeColor = statusConfig?.color || 'white';
      const IconComponent = statusConfig?.icon;

      return (
        <Badge
          alignItems="center"
          bg={bg}
          color={badgeColor}
          colorScheme={colorScheme}
          data-id={dataId}
          display="flex"
          fontSize={['10px', '12px']}
          gap={1}
          padding={'5px 12px'}
          rounded={'50px'}
          variant={config.badgeConfig?.variant || 'solid'}
        >
          {displayValue}
          {IconComponent && <IconComponent data-id="001403" />}
        </Badge>
      );
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
      return (
        <Text color={textColor || '#4A5568'} data-id={dataId} fontSize={fontSize || '14px'} fontWeight={fontWeight || 'normal'}>
          {value || config.fallback || 'Unassigned'}
        </Text>
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
        as={IconButton}
        aria-label="Actions"
        background="white"
        borderColor="#CBD5E0"
        borderWidth="1px"
        data-id={`action-dropdown-${index + 2}`}
        height="28px"
        icon={<EllipsisIcon data-id="001518" />}
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
  return (
    <Button
      background="white"
      borderColor="#CBD5E0"
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
    <MobileActionMenu data-id="002176" config={config} item={item} index={index} />
  ) : (
    <DesktopActionButton data-id="002177" config={config} item={item} index={index} />
  );
}

// Sub-component for linked item section
function LinkedItemSection({ config, item, index }: { readonly config: any; readonly item: any; readonly index: number }) {
  if (!config.linkedItem?.show || !getNestedValue(item, config.linkedItem.fieldKey)) return null;

  return (
    <>
      <Divider data-id="001420" />
      <Box data-id={`linked-item-${index + 2}`} p={'14px'}>
        <Text color="#4A5568" data-id={`linked-label-${index + 2}`} fontSize="12px" fontWeight="600" mb={2}>
          {config.linkedItem.label}
        </Text>
        <Box
          data-id="001521"
          background={'#F7FAFC'}
          border="1px solid #E2E8F0"
          borderRadius={{ base: '4px', md: '6px' }}
          px={{ base: '10px', md: '12px' }}
          py={{ base: '6px', md: '8px' }}
        >
          {config.linkedItem.render ? (
            config.linkedItem.render(getNestedValue(item, config.linkedItem.fieldKey), item)
          ) : (
            <Text color="#3182CE" data-id={`linked-value-${index + 2}`} fontSize="14px" fontWeight="500">
              {getNestedValue(item, config.linkedItem.fieldKey)}
            </Text>
          )}
        </Box>
      </Box>
    </>
  );
}

// Main PanelView component
function PanelView({ items, config, containerProps = { bg: '#F7FAFC', p: '14px', gap: '24px' } }: Readonly<PanelViewProps>) {
  const device = useDevice();
  const isMobile = device === 'mobile';

  return (
    <Box
      as="main"
      bg={containerProps.bg}
      data-id="1"
      display="flex"
      flexDirection="column"
      gap={containerProps.gap}
      h="100%"
      p={containerProps.p}
      w="100%"
      zIndex={-1}
    >
      {items?.map((item, index) => (
        <Flex data-id={index + 2} display={'flex'} flexDirection={'column'} key={item._id || index}>
          <PanelHeader data-id="002178" config={config} item={item} index={index} />

          <Box
            bg="white"
            borderColor="#C4D0DD"
            borderRadius="12px"
            borderWidth="1px"
            boxShadow="0 2px 2px 0 rgba(26, 32, 44, 0.08)"
            data-id={`panel-${index + 2}`}
            display={'flex'}
            flexDirection={'column'}
            key={item._id || index}
            marginTop={'-10px'}
            zIndex={5}
            cursor={config.actions.panelClick ? 'pointer' : 'default'}
            onClick={config.actions.panelClick ? () => config.actions.panelClick?.onClick(item) : undefined}
            transition={config.actions.panelClick ? 'all 300ms ease-out' : undefined}
            _hover={
              config.actions.panelClick
                ? {
                    borderColor: '#9FA7AF',
                    boxShadow: '0 4px 10px 0 rgba(26, 32, 44, 0.12)',
                  }
                : undefined
            }
          >
            {/* Header with title and primary action */}
            <Box borderTopLeftRadius={'12px'} borderTopRightRadius={'12px'} data-id={`panel-header-${index + 2}`} p={4}>
              <Flex data-id="001408" justify="space-between" w="full" mb={['10px', '0px', '0px']}>
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
                <ActionRenderer data-id="002179" config={config} item={item} index={index} isMobile={isMobile} />
              </Flex>

              {/* Status section */}
              <Flex
                data-id="001411"
                alignItems="center"
                justifyContent={['space-between', 'flex-start', 'flex-start']}
                columnGap="10px"
                mb="8px"
              >
                {config.title.secondary && (
                  <Box data-id="001520" minW="0" maxW={['200px', 'none', 'none']}>
                    <FieldRenderer
                      data-id="001412"
                      config={config.title.secondary}
                      dataId={`title-secondary-${index + 2}`}
                      fontSize={['16px', '18px']}
                      fontWeight={600}
                      item={item}
                      textColor="#1A202C"
                      noOfLines={[1, 0, 0]}
                      overflow={['hidden', 'undefined', 'undefined']}
                      textOverflow={['ellipsis', 'undefined', 'undefined']}
                      whiteSpace={['nowrap', 'undefined', 'undefined']}
                    />
                  </Box>
                )}

                <Box data-id="001413" alignItems="center" display="flex" mb={0} flexShrink={0}>
                  <FieldRenderer config={config.status} data-id="001414" dataId={`status-${index + 2}`} item={item} />
                </Box>
              </Flex>
            </Box>

            <Divider data-id="001415" />

            {/* Details section */}
            <Box data-id={`panel-details-${index + 2}`} px={4} py={2}>
              <Box alignItems="center" data-id="001416" display="flex" flexWrap="wrap" gap={2}>
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
                    {detailIndex < config.details.length - 1 && (
                      <Text color="#CBD5E0" data-id="001419" fontSize="14px" mx={1}>
                        •
                      </Text>
                    )}
                  </React.Fragment>
                ))}
              </Box>
            </Box>

            <LinkedItemSection data-id="002180" config={config} item={item} index={index} />
          </Box>
        </Flex>
      ))}
    </Box>
  );
}
export default PanelView;
