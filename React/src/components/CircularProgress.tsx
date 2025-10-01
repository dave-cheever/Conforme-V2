import { Box, CircularProgressLabel, CircularProgress as Progress, Text } from '@chakra-ui/react';

import { EllipsisIcon } from '../icons';
import { ICircularProgress } from '../interfaces/ICircularProgress';

function CircularProgress({ value }: ICircularProgress) {
  return (
    <Box data-id="000254">
      <EllipsisIcon boxSize={2} data-id="000255" transform="translate(-22px, 60px)" />
      <EllipsisIcon boxSize={2} data-id="000256" transform="translate(55px, -21px)" />
      <EllipsisIcon boxSize={2} data-id="000257" transform="translate(57px, 135px)" />
      <EllipsisIcon boxSize={2} data-id="000258" transform="translate(136px, 55px)" />
      <Progress
        bg="white"
        borderRadius="full"
        boxShadow="0px 10px 30px 0px #42424214"
        capIsRound
        color="circularProgress.progress"
        data-id="000259"
        max={100}
        min={0}
        size="120px"
        thickness="5px"
        trackColor="transparent"
        value={value}>
        <CircularProgressLabel data-id="000260">
          <Text
            color="circularProgress.text"
            data-id="000261"
            fontSize="2xl"
            fontWeight="900">{`${value.toString()}%`}</Text>
          <Text
            color="circularProgress.text"
            data-id="000262"
            fontSize="md"
            fontWeight="700">
            {value === 100 ? 'Completed' : 'In Progress'}
          </Text>
        </CircularProgressLabel>
      </Progress>
    </Box>
  );
}

export default CircularProgress;
