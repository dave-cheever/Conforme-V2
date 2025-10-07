import { Badge, Box, Button, Flex, Text } from '@chakra-ui/react';

import AuditDetailIcon from '../../icons/AuditDetailIcon';

function AuditPanels({ audits }) {
    return (
        <Box
            bg="#F7FAFC"
            data-id="001388"
            display="flex"
            flexDirection="column"
            gap={'16px'}
            h="100%"
            p={'14px'}
            w="100%">
            {
                audits?.map((audit) =>
                    <Box
                        bg="white"
                        borderColor={'#C4D0DD'}
                        borderRadius='12px'
                        borderWidth="1px"
                        boxShadow="0 2px 2px 0 rgba(26, 32, 44, 0.08)"
                        data-id="001389"
                        key={audit._id || audit.id}
                        p={4}>
                        <Flex data-id="001390" justify={'space-between'} w={'full'}>
                            <Text
                                color={'#4A5568'}
                                data-id="001391"
                                fontSize={'14px'}
                                fontWeight="semibold"
                                mb={2}>{audit?.reference}</Text>
                            <Button
                                background={'white'}
                                borderColor={'#CBD5E0'}
                                borderWidth={'1px'}
                                data-id="001392"
                                fontSize={'12px'}
                                fontWeight={'normal'}
                                height={'28px'}
                                leftIcon={<AuditDetailIcon data-id="001393" />}
                                padding={'0px 8px'}>Audit Details</Button>
                        </Flex>
                        <Box alignItems="center" data-id="001394" display="flex" mb={2}>
                            <Text
                                color={'#1A202C'}
                                data-id="001395"
                                fontSize={'18px'}
                                fontWeight={600}
                                mr={2}>Case Track</Text>
                            <Badge colorScheme="blue" data-id="001396">IN PROGRESS 😊</Badge>
                        </Box>
                        <Box alignItems="center" data-id="001397" display="flex" mb={2}>
                            <Text data-id="001398" mr={2}>Riverside General Hospital</Text>
                            <Text data-id="001399" ml={2}>01 Feb 2025</Text>
                            <Text data-id="001400" ml={2}>10 Auditors</Text>
                        </Box>
                        <Button data-id="001401" size="sm" variant="outline">Audit details</Button>
                    </Box>,
                )
            }
        </Box>
    );
}
export default AuditPanels
