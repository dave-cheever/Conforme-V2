import { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';

import { Box, Flex } from '@chakra-ui/react';

import { chartColors } from '../bootstrap/config';
import { IBaseWithName } from '../interfaces/IBaseWithName';

function Chart({ items, label }: { items: IBaseWithName[]; label: string }) {
  const [chartData, setChartData] = useState<number[]>([]);
  const [chartLabels, setChartLabels] = useState<string[]>([]);

  useEffect(() => {
    const names: string[] = [];
    const numbers: number[] = [];
    items.forEach(({ name, trackerItemsResponsesCount }: IBaseWithName) => {
      names.push(name);
      numbers.push(trackerItemsResponsesCount || 0);
    });
    setChartData(numbers);
    setChartLabels(names);
  }, [items]);

  const data = {
    datasets: [
      {
        data: [...chartData],
        weight: 1,
        backgroundColor: [...chartColors],
        borderWidth: 5,
      },
    ],

    // These labels appear in the legend and in the tooltips when hovering different arcs
    labels: [...chartLabels],
  };
  const options = {
    cutoutPercentage: 70,
    circumference: 2 * Math.PI,
    percentageInnerCutout: 100,
    legend: {
      display: false,
    },
    layout: {
      padding: 10,
    },
  };

  return (
    <Flex
        data-id="030925-c873a7"
        alignItems="center"
        direction="column"
        p="0 30px"
        position="fixed"
        right="30px">
      <Box
        data-id="030925-32b358"
        color="chart.labelFontColor"
        fontWeight="bold"
        mb="24px">
        Responses by {label}
      </Box>
      <Box
        data-id="030925-5f5ba7"
        alignItems="center"
        bgColor="#DBDBDC"
        borderRadius="100px"
        height="173px"
        justifyContent="center"
        width="173px">
        <Doughnut data-id="030925-3714a3" data={data} height={300} options={options} />
      </Box>
    </Flex>
  );
}

export default Chart;
