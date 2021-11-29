import React, { ReactElement } from 'react';
import { Box, Flex, Text } from '@chakra-ui/react';

const BarChart = ({ data, label }) => {
  const newArr = data.reduce((acc, curr) => {
    return {...acc,
      [curr._id]: curr.count
    }
  }, {});
  
  const values: number[] = Object.values(newArr);
  // maximum value of the elements
  const maxCount = Math.max(...values);
  // calculate multpier to set max value on divider
  const multipier = Math.ceil(maxCount / 10);
  const maxValueOnDivider = 10 * multipier;
  const step = maxValueOnDivider / 5;

  const divider: ReactElement[] = [<Text key="0">0</Text>];
  if(maxCount !== -Infinity) {
    for(let i=1; i <= 5; i++) {
      divider.push(<Text key={i*step}>{i*step}</Text>);
    }
  }

  return (
    <Flex flexDir="column">
      <Text h="25px" mt="20px" color="barChart.headerColor" fontSize="11px">{label} rank by # of items</Text>
      {maxCount !== -Infinity && 
        <>
          {data.map(el => 
            <Flex key={el._id} h="79px" alignItems="center">
              <Box h="18px" w={`${newArr[el._id] / maxValueOnDivider * 100}%`} bg="barChart.bg" rounded="20px" />
            </Flex>)
          }
          <Flex color="barChart.color" justifyContent="space-between" fontSize="11px">
            {divider}
          </Flex>
        </>
      }
    </Flex>
  );
};

export default BarChart;

export const barChartStyles = {
  barChart: {
    headerColor: "#818197",
    bg: "#462AC4",
    color: "#818197"
  }
};
