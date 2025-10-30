interface BackArrowIconProps {
  readonly dataId?: string;
  readonly width?: string;
  readonly height?: string;
  readonly fill?: string;
}

function BackArrowIcon({ 
  dataId = 'back-arrow-icon', 
  width = '20px', 
  height = '21px', 
  fill = 'white'
}: BackArrowIconProps) {
  return (
    <svg
      data-id={dataId}
      width={width}
      height={height}
      viewBox="0 0 20 21"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        data-id="002725"
        d="M17.4998 9.64324H5.34479L9.75562 5.23241L8.57729 4.05408L2.15479 10.4766L8.57729 16.8991L9.75562 15.7207L5.34479 11.3099H17.4998V9.64324Z"
        fill={fill} />
    </svg>
  );
}

export default BackArrowIcon;
