import { Badge, Box, Button, Flex, Text } from '@chakra-ui/react';
import AuditDetailIcon from '../../icons/AuditDetailIcon';

function AuditPanels({ audits }) {
    return (
        <Box
            data-id="001388"
            w="100%"
            h="100%"
            bg="#F7FAFC"
            p={'14px'}
            display="flex"
            flexDirection="column"
            gap={'16px'}>
            {
                audits?.map((audit) =>
                    <Box
                        key={audit._id || audit.id}
                        data-id="001389"
                        borderWidth="1px"
                        borderColor={'#C4D0DD'}
                        borderRadius='12px'
                        p={4}
                        bg="white"
                        boxShadow="0 2px 2px 0 rgba(26, 32, 44, 0.08)">
                        <Flex data-id="001390" w={'full'} justify={'space-between'}>
                            <Text
                                data-id="001391"
                                color={'#4A5568'}
                                fontSize={'14px'}
                                fontWeight="semibold"
                                mb={2}>{audit?.reference}</Text>
                            <Button
                                data-id="001392"
                                padding={'0px 8px'}
                                height={'28px'}
                                background={'white'}
                                borderWidth={'1px'}
                                fontWeight={'normal'}
                                fontSize={'12px'}
                                borderColor={'#CBD5E0'}
                                leftIcon={<AuditDetailIcon data-id="001393" />}>Audit Details</Button>
                        </Flex>
                        <Box data-id="001394" display="flex" alignItems="center" mb={2}>
                            <Text
                                data-id="001395"
                                fontWeight={600}
                                fontSize={'18px'}
                                color={'#1A202C'}
                                mr={2}>Case Track</Text>
                            <Badge data-id="001396" colorScheme="blue">IN PROGRESS 😊</Badge>
                        </Box>
                        <Box data-id="001397" display="flex" alignItems="center" mb={2}>
                            <Text data-id="001398" mr={2}>Riverside General Hospital</Text>
                            <Text data-id="001399" ml={2}>01 Feb 2025</Text>
                            <Text data-id="001400" ml={2}>10 Auditors</Text>
                        </Box>
                        <Button data-id="001401" variant="outline" size="sm">Audit details</Button>
                    </Box>
                )
            }
        </Box>
    );
}
export default AuditPanels
