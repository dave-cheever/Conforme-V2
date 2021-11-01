import React from 'react';
import {
  Box,
  Flex,
  Input,
  Stack,
} from '@chakra-ui/react';
import { toast } from 'react-toastify';

import { IFieldComponent } from '../Field';

const Table = ({ name, label, disabled, headings, validations, value, error, touched, onChange, onBlur }: IFieldComponent) => {
  const renderError = () => {
    if (!error || !touched) {
      return null;
    }
    return (<Box color="red.500">{error}</Box>);
  };

  const onCellChange = (e, col, index) => {
    value[index][col.name] = e.target.value;
    onChange({ target: { name, value } });
  }

  const addRow = () => {
    if (value[value.length - 1]) {
      const rowIsEmpty = !Object.values(value[value.length - 1]).some((x: any) => x !== '');
      if (rowIsEmpty) {
        toast.error('Please complete the last row before creating a new one');
        return;
      }
    }
    const newRow = {};
    headings?.cols.forEach(col => newRow[col.name] = '');
    const newValue = [
      ...value,
      newRow
    ];
    onChange({ target: { name, value: newValue } });
  }

  const removeRow = index => {
    onChange({ target: { name, value: value.filter((row, i) => i !== index) } });
  };

  const renderCell = (col, row, index) => {
    const hasError = error?.includes(row[col.name]);
    return (
      <Flex key={`${col.name}-${row}`} w='full' mr={2}>
        <Input
          type={col.type}
          value={row[col.name]}
          onChange={(e) => onCellChange(e, col, index)}
          onBlur={(e) => onBlur({ target: { name } })}
          disabled={disabled}
          w='full'
          borderRadius="8px"
          borderWidth="2px"
          borderColor={(!hasError || !touched) ? "#CBCCCD" : "red.500"}
        />
      </Flex>
    );
  };

  const renderRow = (row, index) => (
    <Flex key={`row-${index}`} justify='space-between' align='center'>
      {headings?.cols.map(col => renderCell(col, row, index))}
      {/* <FontAwesomeIcon icon={faTrash} onClick={() => removeRow(index)} cursor='pointer' /> */}
    </Flex>
  );

  const renderAddButton = () => {
    if (validations?.maxLength && value.length === validations.maxLength) {
      return;
    }

    return (
      <Box onClick={addRow} pl={2} cursor='pointer'>
        {/* <FontAwesomeIcon icon={faPlusCircle} /> Add row */}
      </Box>
    );
  };

  return (
    <Stack id={name}>
      <Flex>
        {/* <Text>{label}</Text> */}
        <Stack w='full'>
          {/* <Flex w='full' p={2}>
            {headings?.cols?.map(col => <div key={col.name}>{col.label}</div>)}
          </Flex> */}
          {value?.map((row, index) => renderRow(row, index))}
          {renderAddButton()}
        </Stack>
      </Flex>
      {renderError()}
    </Stack>
  );
};

export default Table;
