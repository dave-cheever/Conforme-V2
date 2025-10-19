interface BackArrowIconProps {
  readonly dataId?: string;
  readonly width?: number;
  readonly height?: number;
  readonly fill?: string;
}

function BackArrowIcon({ dataId, width = 24, height = 24, fill = '#4A5568' }: BackArrowIconProps) {
  return (
    <svg
      data-id={dataId}
      fill="none"
      height={height}
      viewBox="0 0 24 24"
      width={width}
      xmlns="http://www.w3.org/2000/svg">
      <path
        data-id="002486"
        d="M20.9999 11H6.41394L11.7069 5.70697L10.2929 4.29297L2.58594 12L10.2929 19.707L11.7069 18.293L6.41394 13H20.9999V11Z"
        fill={fill} />
    </svg>
  );
}

export default BackArrowIcon;
