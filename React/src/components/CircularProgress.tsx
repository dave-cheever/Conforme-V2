import { Box, CircularProgress as Progress, CircularProgressLabel, Text } from "@chakra-ui/react"
import { EllipsisIcon } from "../icons"
import { ICircularProgress } from "../interfaces/ICircularProgress"

const CircularProgress = ({ value }: ICircularProgress) => {
  return (
    <Box>
      <EllipsisIcon
        boxSize={2}
        transform="translate(-22px, 60px)"
      />
      <EllipsisIcon
        boxSize={2}
        transform="translate(55px, -21px)"
      />
      <EllipsisIcon
        boxSize={2}
        transform="translate(57px, 135px)"
      />
      <EllipsisIcon
        boxSize={2}
        transform="translate(136px, 55px)"
      />
      <Progress value={value}
        bg="white"
        borderRadius="full"
        boxShadow="0px 10px 30px 0px #42424214"
        capIsRound
        trackColor="transparent"
        color="circularProgress.progress" size="120px" thickness="5px"
        min={0}
        max={100}
      >
        <CircularProgressLabel>
          <Text color="circularProgress.text" fontSize="2xl"
            fontWeight="900">{`${value.toString()}%`}</Text>
          <Text color="circularProgress.text" fontSize="md"
            fontWeight="700">{value === 100 ? "Completed" : "In Progress"}</Text>
        </CircularProgressLabel>
      </Progress>
    </Box>
  )
}

export default CircularProgress
