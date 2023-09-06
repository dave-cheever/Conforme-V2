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

  const divider: ReactElement[] = [<Text data-id="908451eebb30" key="0">0</Text>];
  if (maxCount !== -Infinity) for (let i = 1; i <= 5; i += 1) divider.push(<Text data-id="bd1df73c0f59" key={i * step}>{i * step}</Text>);

  return (
    (<Flex data-id="e05fd31468c3" flexDir="column">
      <Text
        color="barChart.headerColor"
        data-id="698498e1746e"
        fontSize="11px"
        h="25px"
        mb="25px"
        mt="20px">
        {label} rank by # of responses
      </Text>
      {maxCount !== -Infinity && (
        <>
          <Flex data-id="b6a30375c4e2" flexDir="column">
            {data.map((el) => (
              <Flex alignItems="center" data-id="0f7e27fa77b5" key={el._id}>
                <Box
                  bg="barChart.bg"
                  data-id="29821c7f7efb"
                  h="18px"
                  mb="42px"
                  rounded="20px"
                  w={`${(newArr[el._id] / maxValueOnDivider) * 100}%`} />
              </Flex>
            ))}
          </Flex>
          <Flex
            color="barChart.color"
            data-id="1a64565f620f"
            fontSize="11px"
            justifyContent="space-between"
            mt="-15px">
            {divider}
          </Flex>
        </>
      )}
    </Flex>)
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
