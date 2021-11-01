import React from 'react';
import {
  Box,
  Flex,
  Grid,
  GridItem,
  Input,
  Select,
  Stack,
  Text,
} from '@chakra-ui/react';

import { IFieldComponent } from '../Field';

const DataGrid = ({ name, label, showDot, disabled, headings, value, error, touched, onChange, onBlur }: IFieldComponent) => {
  const renderError = () => {
    if (!error || !touched) {
      return null;
    }
    return (<Box color="red.500">{error}</Box>);
  };

  const onCellChange = (e, col, row) => {
    const newValue = {
      ...value,
      [row.name]: {
        ...value[row.name],
        [col.name]: e.target.value
      }
    };
    onChange({ target: { name, value: newValue } });
  }

  const renderCell = (col, row) => {
    if (col.type === 'dropdown') {
      return (
        <Flex key={`${col.name}-${row.name}`}>
          <Select
            value={value[row.name][col.name]}
            onChange={(e) => onCellChange(e, col, row)}
            onBlur={(e) => onBlur({ target: { name } })}
            disabled={disabled}
          >
            {(col.options || []).map(option => <option key={`${col.name}-${row.name}-${option}`}>{option}</option>)}
          </Select>
        </Flex>
      );
    }

    const cellValue = value ? value[row.name] ? value[row.name][col.name] : '' : '';
    const hasError = error?.includes(cellValue);
    return (
      <Flex key={`${col.name}-${row.name}`}>
        <Input
          type={col.type}
          value={cellValue}
          onChange={(e) => onCellChange(e, col, row)}
          onBlur={(e) => onBlur({ target: { name } })}
          disabled={disabled}
          borderRadius="8px"
          borderWidth="2px"
          borderColor={(!hasError || !touched) ? "#CBCCCD" : "red.500"}
        />
      </Flex>
    );
  };

  const renderRow = (row, index) => {
    return (
      <Grid templateColumns="repeat(10, 1fr)" key={row.name}>
        <GridItem colSpan={3}>
          <Flex w='full' h='full' align='center'>{row.label}</Flex>
        </GridItem>
        <GridItem colSpan={7}>
          {headings?.cols.map(col => renderCell(col, row))}
        </GridItem>
      </Grid>
    );
  };

  return (
    <Stack id={name}>
      <Text>{label}</Text>
      <Stack>
        {/* <Text>{headings?.colsLabel}</Text>
        <Text>{headings?.rowsLabel}</Text> */}
        {/* <Flex>
          {headings?.cols.map(col => <div key={col.name}>{col.label}</div>)}
        </Flex> */}
        {headings?.rows?.map((row, index) => renderRow(row, index))}
      </Stack>
      {renderError()}
    </Stack>
  );
};

export default DataGrid;
