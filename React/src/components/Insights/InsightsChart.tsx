import { useEffect, useRef } from 'react';

import { Box } from '@chakra-ui/react';
import { EChartsOption, init } from 'echarts';
import type { ECharts } from 'echarts';

function InsightsChart({ option }: { option: EChartsOption }) {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let chart: ECharts | undefined;
    if (chartRef.current !== null) chart = init(chartRef.current);

    chart?.setOption(option);

    function resizeChart() {
      chart?.resize();
    }

    // Use requestAnimationFrame to ensure container has final dimensions
    const rafId = requestAnimationFrame(() => {
      chart?.resize();
    });

    // Use ResizeObserver for better responsiveness
    let resizeObserver: ResizeObserver | undefined;
    if (chartRef.current) {
      resizeObserver = new ResizeObserver(() => {
        chart?.resize();
      });
      resizeObserver.observe(chartRef.current);
    }

    window.addEventListener('resize', resizeChart);

    return () => {
      cancelAnimationFrame(rafId);
      if (resizeObserver) resizeObserver.disconnect();

      chart?.dispose();
      window.removeEventListener('resize', resizeChart);
    };
  }, [option]);

  return <Box data-id="000496" h="500px" ref={chartRef} w="100%" />;
}

export default InsightsChart;
