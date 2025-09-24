import { Text } from '@chakra-ui/react';

function SectionHeader({ label, display = 'flex' }: { label: string; display?: string | string[] }) {
  return (
    <Text data-id="000652" display={display} fontSize="smm" fontWeight="bold">
      {label}
    </Text>
  );
}

export default SectionHeader;
