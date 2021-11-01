import { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Box, Flex } from "@chakra-ui/react";

import { chartColors } from "../bootstrap/config";
import { IBaseWithName } from "../interfaces/IBaseWithName";

const Chart = ({ items, label }: { items: IBaseWithName[]; label: string }) => {
  const [chartData, setChartData] = useState<number[]>([]);
  const [chartLabels, setChartLabels] = useState<string[]>([]);

  useEffect(() => {
    const names: string[] = [];
    const numbers: number[] = [];
    items.forEach(({ name, count }: IBaseWithName) => {
      names.push(name);
      numbers.push(count || 0);
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
        borderWidth: "5px",
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
      direction="column"
      alignItems="center"
      p="0 30px"
      position="fixed"
      right="30px"
    >
      <Box mb="24px" fontWeight="bold" color="chart.labelFontColor">
        Responses by {label}
      </Box>
      <Box
        bgColor="#DBDBDC"
        height="173px"
        width="173px"
        borderRadius="100px"
        alignItems="center"
        justifyContent="center"
      >
        <Doughnut data={data} height={300} options={options} />
      </Box>
    </Flex>
  );
};

export default Chart;
