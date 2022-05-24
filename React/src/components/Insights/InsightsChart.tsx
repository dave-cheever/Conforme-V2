import { useEffect, useRef } from 'react';

import { Box } from '@chakra-ui/react';
import { EChartsOption, init } from 'echarts';
import type { ECharts } from 'echarts';

const InsightsChart = ({ option }: { option: EChartsOption }) => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let chart: ECharts | undefined;
    if (chartRef.current !== null) chart = init(chartRef.current);

    chart?.setOption(option);

    function resizeChart() {
      chart?.resize();
    }
    window.addEventListener('resize', resizeChart);

    return () => {
      chart?.dispose();
      window.removeEventListener('resize', resizeChart);
    };
  }, [option]);

  return <Box h="500px" ref={chartRef} w="100%" />;
};

export default InsightsChart;
