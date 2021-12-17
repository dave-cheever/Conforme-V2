import { Datepicker, Switch, TextConfirmInput } from "../Forms";

interface IProps {
  name: string,
  placeholder: string | undefined,
  control: object,
  disabled?: boolean,
  required?: boolean,
  label: string,
  defaultvalue?: string,
  styles?:object
}
interface IFields {
  type: string,
  name: string,
  control: object,
  placeholder: string | undefined,
  disabled?: boolean,
  required?: boolean,
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
  required,
  defaultvalue,
  styles
}: IFields) => {
  const props: IProps = {
    name,
    control,
    placeholder,
    disabled,
    required,
    label,
    defaultvalue,
    styles
  };
  switch (type) {
    case 'text': {
      return <TextConfirmInput  {...props} />;
    }
    case 'datepicker': {
      return <Datepicker {...props} />;
    }
    case 'switch': {
      return <Switch {...props} />;
    }
    default:
      return <div>Field not supported</div>;
  }
};

export default Fields;
