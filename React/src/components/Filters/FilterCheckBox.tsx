import { Checkbox, Text } from '@chakra-ui/react';

import { TickIcon } from '../../icons'

const FilterCheckBox = ({value, label}) => {
    return (
    <Checkbox
        icon={<TickIcon />}
        css={{
            ".chakra-checkbox__control": {
            borderRadius: "50%",
            width: "20px",
            height: "20px",
            background:"white",
            borderWidth:"1px",
            borderColor: "#81819750",
            paddingTop:"5px",
            "&[data-checked]": {
                background: "#462AC4",
                borderColor: "#462AC4",
                "&[data-hover]": {
                background: "#462AC4",
                borderColor: "#462AC4"
                }
            }
        }
        }}
        value={value}
        >
        <Text fontSize="14px" color="filterPanel.checkboxLabelColor">{label}</Text>
    </Checkbox>
    )
}

export default FilterCheckBox
