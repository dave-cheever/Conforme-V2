import React from 'react';

import { Badge, Box, Button, Divider, Flex, Text } from '@chakra-ui/react';
import { format } from 'date-fns';
import { get } from 'lodash';

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
function FieldRenderer({ config, item, fontSize, textColor, fontWeight, dataId }: { readonly config: PanelFieldConfig; readonly item: any; readonly fontSize?: string; readonly textColor?: string, readonly fontWeight?: number, readonly dataId?: string }) {
    const value = getNestedValue(item, config.key);

    if (config.render) return <>{config.render(value, item)}</>;

    switch (config.type) {
        case 'text': {
            return (
                <Text
                    color={textColor || "#4A5568"}
                    data-id="001402"
                    fontSize={fontSize || "14px"}
                    fontWeight={fontWeight || "normal"}>
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
                    fontSize="12px"
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
                <Text color={textColor || "#4A5568"} data-id={dataId} fontSize={fontSize || "14px"} fontWeight={fontWeight || "normal"}>
                    {formattedDate || config.fallback || '-'}
                </Text>
            );
        }

        case 'user': {
            return (
                <Text color={textColor || "#4A5568"} data-id={dataId} fontSize={fontSize || "14px"} fontWeight={fontWeight || "normal"}>
                    {value || config.fallback || 'Unassigned'}
                </Text>
            );
        }

        case 'custom':
        default: {
            return (
                <Text color={textColor || "#4A5568"} data-id={dataId} fontSize={fontSize || "14px"} fontWeight={fontWeight || "normal"}>
                    {value || config.fallback || '-'}
                </Text>
            );
        }
    }
};

// Main PanelView component
function PanelView({
    items,
    config,
    containerProps = { bg: '#F7FAFC', p: '14px', gap: '24px' },
}: Readonly<PanelViewProps>) {
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
        >
            {items?.map((item, index) => (

                <Flex data-id={index + 2} display={'flex'} flexDirection={'column'} key={item._id || index}>
                    {/* Optional black header */}

                    {config.header?.show && (
                        <Box bg="#2D3748" borderTopRadius="14px" color="white" data-id={`header-${index + 2}`} height={'42px'} pb={'6px'} position={'relative'} pt={'4px'} px={'14px'}>
                            <Box
                                alignItems="center"
                                data-id="001404"
                                display="flex"
                                flexWrap="wrap"
                                gap={3}>
                                {config.header?.fields.map((field, fieldIndex) => (
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
                                                textColor="white" />
                                        </Box>
                                        {fieldIndex < (config.header?.fields.length || 0) - 1 && (
                                            <Text color="#4A5568" data-id="001407" fontSize="16px">•</Text>
                                        )}
                                    </React.Fragment>
                                ))}
                            </Box>
                        </Box>
                    )}

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
                    >

                        {/* Header with title and primary action */}
                        <Box borderTopLeftRadius={'12px'} borderTopRightRadius={'12px'} data-id={`panel-header-${index + 2}`} p={4}>
                            <Flex data-id="001408" justify="space-between" w="full">
                                <Box data-id="001409">
                                    <FieldRenderer
                                        config={config.title.primary}
                                        data-id="001410"
                                        dataId={`title-primary-${index + 2}`}
                                        fontSize="14px"
                                        fontWeight={500}
                                        item={item}
                                        textColor="#4A5568" />
                                </Box>
                                {config.actions.primary && (
                                    <Button
                                        background="white"
                                        borderColor="#CBD5E0"
                                        borderWidth="1px"
                                        data-id={`action-button-${index + 2}`}
                                        fontSize="12px"
                                        fontWeight="normal"
                                        height="28px"
                                        leftIcon={config.actions.primary.icon ? <config.actions.primary.icon /> : undefined}
                                        onClick={() => config.actions.primary?.onClick(item)}
                                        padding="0px 8px"
                                    >
                                        {config.actions.primary.label}
                                    </Button>
                                )}
                            </Flex>

                            {/* Status section */}
                            <Flex alignItems="center" columnGap="10px" data-id="001411" mb="8px">
                                {config.title.secondary && (
                                    <FieldRenderer
                                        config={config.title.secondary}
                                        data-id="001412"
                                        dataId={`title-secondary-${index + 2}`}
                                        fontSize="18px"
                                        fontWeight={600}
                                        item={item}
                                        textColor="#1A202C" />
                                )}

                                <Box alignItems="center" data-id="001413" display="flex" mb={0}>
                                    <FieldRenderer
                                        config={config.status}
                                        data-id="001414"
                                        dataId={`status-${index + 2}`}
                                        item={item} />
                                </Box>
                            </Flex>
                        </Box>

                        <Divider data-id="001415" />

                        {/* Details section */}
                        <Box data-id={`panel-details-${index + 2}`} px={4} py={2}>
                            <Box
                                alignItems="center"
                                data-id="001416"
                                display="flex"
                                flexWrap="wrap"
                                gap={2}>
                                {config.details.map((detail, detailIndex) => (
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
                                                textColor="#4A5568" />
                                        </Box>
                                        {detailIndex < config.details.length - 1 && (
                                            <Text color="#CBD5E0" data-id="001419" fontSize="14px" mx={1}>•</Text>
                                        )}
                                    </React.Fragment>
                                ))}
                            </Box>

                            {/* Secondary action
                        {config.actions.secondary && (
                            <Button
                                onClick={() => config.actions.secondary?.onClick(item)}
                                size="sm"
                                variant="outline"
                            >
                                {config.actions.secondary.label}
                            </Button>
                        )} */}
                        </Box>

                        {/* Linked Item Section - Only show if config exists and data has linked item */}
                        {config.linkedItem?.show && getNestedValue(item, config.linkedItem.fieldKey) && (
                            <>
                                <Divider data-id="001420" />
                                <Box data-id={`linked-item-${index + 2}`} p={'14px'}>
                                    <Text color="#4A5568" data-id={`linked-label-${index + 2}`} fontSize="12px" fontWeight="600" mb={2}>
                                        {config.linkedItem.label}
                                    </Text>
                                    <Box
                                        background={'#F7FAFC'}
                                        border="1px solid #E2E8F0"
                                        borderRadius={'6px'}
                                        data-id="001421"
                                        px={'12px'}
                                        py={'8px'}>
                                        {config.linkedItem.render ?
                                            config.linkedItem.render(getNestedValue(item, config.linkedItem.fieldKey), item) :
                                            <Text color="#3182CE" data-id={`linked-value-${index + 2}`} fontSize="14px" fontWeight="500">
                                                {getNestedValue(item, config.linkedItem.fieldKey)}
                                            </Text>
                                        }
                                    </Box>
                                </Box>
                            </>
                        )}
                    </Box>
                </Flex>
            ))}
        </Box>
    );
}
export default PanelView;
