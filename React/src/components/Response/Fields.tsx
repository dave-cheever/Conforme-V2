import Datepicker from "../Forms/Datepicker";
import TextInput from "../Forms/TextInput";
import Toggle from "./Toggle";


interface IProps {
  name: string,
  control: object,
  placeholder: string | undefined,
  disabled: boolean,
  label: string,
  defaultvalue?: string,
  styles?:object
}
interface IFileds {
  type: string,
  name: string,
  control: object,
  placeholder: string | undefined,
  disabled: boolean,
  label: string
  defaultvalue?: string
  styles?:object
}

const Fields = ({
  type,
  name,
  label,
  control,
  placeholder,
  disabled,
  defaultvalue,
  styles
}: IFileds) => {
  const props: IProps = {
    name,
    control,
    placeholder,
    disabled,
    label,
    defaultvalue,
    styles
  }
  switch (type) {
    case 'text': {
      return <TextInput  {...props} />
    }
    case 'datePicker': {
      return <Datepicker {...props} />;
    }
    case 'toggle': {
      return <Toggle {...props} />;
    }
    default:
      return <div>Field not supported</div>;
  }
}

export default Fields