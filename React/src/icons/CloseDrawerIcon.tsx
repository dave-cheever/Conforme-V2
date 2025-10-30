interface CloseDrawerIconProps {
  readonly dataId?: string;
  readonly width?: number;
  readonly height?: number;
  readonly fill?: string;
}

function CloseDrawerIcon({ dataId, width = 24, height = 25, fill = '#2D3748' }: CloseDrawerIconProps) {
  return (
    <svg
      data-id={dataId}
      fill="none"
      height={height}
      viewBox="0 0 24 25"
      width={width}
      xmlns="http://www.w3.org/2000/svg">
      <path
        d="M17.2502 5.5L11.9994 10.75L6.74984 5.5L5 7.25L10.2495 12.5L5 17.75L6.74984 19.5L11.9994 14.25L17.2502 19.5L19 17.75L13.7505 12.5L19 7.25L17.2502 5.5Z"
        data-id="002487"
        fill={fill} />
    </svg>
  );
}

export default CloseDrawerIcon;
