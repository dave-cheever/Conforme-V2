import React, { ReactElement } from 'react';

import { Box, Flex, Text } from '@chakra-ui/react';

function BarChart({ data, label }) {
  const newArr = data.reduce((acc, curr) => ({ ...acc, [curr._id]: curr.count }), {});

  const values: number[] = Object.values(newArr);
  // maximum value of the elements
  const maxCount = Math.max(...values);
  // calculate multpier to set max value on divider
  const multipier = Math.ceil(maxCount / 10);
  const maxValueOnDivider = 10 * multipier;
  const step = maxValueOnDivider / 5;

  const divider: ReactElement[] = [<Text data-id="030925-7c44aa" key="0">0</Text>];
  if (maxCount !== -Infinity) for (let i = 1; i <= 5; i += 1) divider.push(<Text data-id="030925-e9a8fd" key={i * step}>{i * step}</Text>);

  return (
    <Flex data-id="030925-bdcb61" flexDir="column">
      <Text
        color="barChart.headerColor"
        data-id="030925-36ce45"
        fontSize="11px"
        h="25px"
        mt="18px"
      >
        {label} rank by # of responses
      </Text>
      {maxCount !== -Infinity && (
        <>
          <Flex data-id="030925-dc4030" flexDir="column">
            {data.map((el) => (
              <Flex alignItems="center" color="#272727" data-id="030925-703857" h="55px" key={el._id} my="auto">
                <Box
                  bg="barChart.bg"
                  data-id="030925-172d92"
                  w={`${(newArr[el._id] / maxValueOnDivider) * 100}%`}
                  h="18px"
                  // mb="42px"
                  rounded="20px" />
              </Flex>
            ))}
          </Flex>
          <Flex
            color="barChart.color"
            data-id="030925-929942"
            fontSize="11px"
            justifyContent="space-between"
            mt="-15px">
            {divider}
          </Flex>
        </>
      )}
    </Flex>
  );
}

export default BarChart;

export const barChartStyles = {
  barChart: {
    headerColor: '#818197',
    bg: '#462AC4',
    color: '#818197',
  },
};
