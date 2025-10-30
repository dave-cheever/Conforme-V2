interface DropdownArrowIconProps {
  readonly dataId?: string;
  readonly width?: string;
  readonly height?: string;
  readonly fill?: string;
  readonly style?: React.CSSProperties;
}

function DropdownArrowIcon({ 
  dataId = 'dropdown-arrow-icon', 
  width = '18px', 
  height = '19px', 
  fill = 'white',
  style
}: DropdownArrowIconProps) {
  return (
    <svg
      data-id={dataId}
      width={width}
      height={height}
      viewBox="0 0 18 19"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={style}>
      <path
        data-id="002734"
        d="M5.5575 6.91162L9 10.3541L12.4425 6.91162L13.5 7.97662L9 12.4766L4.5 7.97662L5.5575 6.91162Z"
        fill={fill}
        fillOpacity="0.8" />
    </svg>
  );
}

export default DropdownArrowIcon;
