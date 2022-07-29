import React, { ReactElement } from 'react';

import { Box, Flex, Text } from '@chakra-ui/react';

const BarChart = ({ data, label }) => {
  const newArr = data.reduce((acc, curr) => ({ ...acc, [curr._id]: curr.count }), {});

  const values: number[] = Object.values(newArr);
  // maximum value of the elements
  const maxCount = Math.max(...values);
  // calculate multpier to set max value on divider
  const multipier = Math.ceil(maxCount / 10);
  const maxValueOnDivider = 10 * multipier;
  const step = maxValueOnDivider / 5;

  const divider: ReactElement[] = [<Text key="0">0</Text>];
  if (maxCount !== -Infinity) for (let i = 1; i <= 5; i += 1) divider.push(<Text key={i * step}>{i * step}</Text>);

  return (
    <Flex flexDir="column">
      <Text color="barChart.headerColor" fontSize="11px" h="25px" mb="25px" mt="20px">
        {label} rank by # of responses
      </Text>
      {maxCount !== -Infinity && (
        <>
          <Flex flexDir="column">
            {data.map((el) => (
              <Flex alignItems="center" key={el._id}>
                <Box bg="barChart.bg" h="18px" mb="42px" rounded="20px" w={`${(newArr[el._id] / maxValueOnDivider) * 100}%`} />
              </Flex>
            ))}
          </Flex>
          <Flex color="barChart.color" fontSize="11px" justifyContent="space-between" mt="-15px">
            {divider}
          </Flex>
        </>
      )}
    </Flex>
  );
};

export default BarChart;

export const barChartStyles = {
  barChart: {
    headerColor: '#818197',
    bg: '#462AC4',
    color: '#818197',
  },
};
