import { Box, CircularProgressLabel, CircularProgress as Progress, Text } from '@chakra-ui/react';

import { EllipsisIcon } from '../icons';
import { ICircularProgress } from '../interfaces/ICircularProgress';

const CircularProgress = ({ value }: ICircularProgress) => (
  <Box data-id="0b869d26f7a0">
    <EllipsisIcon boxSize={2} data-id="6ad314715121" transform="translate(-22px, 60px)" />
    <EllipsisIcon boxSize={2} data-id="4b780ca5322e" transform="translate(55px, -21px)" />
    <EllipsisIcon boxSize={2} data-id="86c746fe7172" transform="translate(57px, 135px)" />
    <EllipsisIcon boxSize={2} data-id="5f7425ce4623" transform="translate(136px, 55px)" />
    <Progress
      bg="white"
      borderRadius="full"
      boxShadow="0px 10px 30px 0px #42424214"
      capIsRound
      color="circularProgress.progress"
      data-id="ec2ded95939f"
      max={100}
      min={0}
      size="120px"
      thickness="5px"
      trackColor="transparent"
      value={value}>
      <CircularProgressLabel data-id="97684c7c5903">
        <Text
          color="circularProgress.text"
          data-id="78238056b19d"
          fontSize="2xl"
          fontWeight="900">{`${value.toString()}%`}</Text>
        <Text
          color="circularProgress.text"
          data-id="a1da4fb246fe"
          fontSize="md"
          fontWeight="700">
          {value === 100 ? 'Completed' : 'In Progress'}
        </Text>
      </CircularProgressLabel>
    </Progress>
  </Box>
);

export default CircularProgress;
