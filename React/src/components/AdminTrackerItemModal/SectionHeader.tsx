import { Text } from '@chakra-ui/react';

const SectionHeader = ({ label, display = 'flex' }: { label: string; display?: string | string[] }) => (
  <Text data-id="5852c4bc77bb" display={display} fontSize="smm" fontWeight="bold">
    {label}
  </Text>
);

export default SectionHeader;
