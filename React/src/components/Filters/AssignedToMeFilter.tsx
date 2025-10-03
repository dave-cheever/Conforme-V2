import { Checkbox, HStack, Text } from '@chakra-ui/react';

interface AssignedToMeFilterProps {
  readonly isChecked: boolean;
  readonly onToggle: (isChecked: boolean) => void;
}

function AssignedToMeFilter({ isChecked, onToggle }: AssignedToMeFilterProps) {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onToggle(event.target.checked);
  };

  return (
    <HStack align="center" data-id="000155" ml="2px" mt={2} paddingEnd={4} spacing={2}>
      <Checkbox
        _checked={{
          bg: '#0068A3',
        }}
        borderColor="#CBD5E0"
        borderRadius="sm"
        colorScheme="blue"
        data-id="000157"
        id="assigned-to-me"
        isChecked={isChecked}
        onChange={handleChange}
        size="md"
      />
      <Text color="#2D3748" cursor="pointer" data-id="000156" fontSize="14px" fontWeight="medium" onClick={() => onToggle(!isChecked)}>
        Show only assigned to me
      </Text>
    </HStack>
  );
}

export default AssignedToMeFilter;
