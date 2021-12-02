import React, { useMemo } from 'react';
import { Stack } from '@chakra-ui/react';

import { useSettingsContext } from '../../contexts/SettingsProvider';
import Dropdown from '../Forms/Dropdown';

const Defaults = () => {
    const { control, categories, businessUnits,regulatoryBodies, } = useSettingsContext();

    const businessUnitsOptions = useMemo(() => businessUnits.map(({ _id, name }) => ({ value: _id, label: name })), [businessUnits]);
    const categoriesOptions = useMemo(() => categories.map(({ _id, name }) => ({ value: _id, label: name })), [categories]);
    const regulatoryBodiesOptions = useMemo(() => regulatoryBodies.map(({ _id, name }) => ({ value: _id, label: name })), [regulatoryBodies]);
    
    return (
    <Stack w='full' spacing={10} h="full" pb={3} maxW="280px">
        <Dropdown
          control={control}
          name="defaultBusinessUnit"
          label="Default business unit"
          placeholder="Select"
          variant="secondaryVariant"
          options={businessUnitsOptions}
          help="Define business unit"
          tooltip="Use this setting to default to a specific business unit when adding a compliance item"
        />
        <Dropdown
          control={control}
          name="defaultRegulatoryBody"
          label="Default regulatory body"
          placeholder="Select"
          variant="secondaryVariant"
          options={regulatoryBodiesOptions}
          help="Define regulatory body"
          tooltip="Use this setting to default to a specific regulatory body when adding a compliance item"
        />
        <Dropdown
          control={control}
          name="defaultCategory"
          label="Default category"
          placeholder="Select"
          variant="secondaryVariant"
          options={categoriesOptions}
          help="Define category"
          tooltip="Use this setting to default to a specific regulatory body when adding a compliance item"
        />
    </Stack>
    )
}

export default Defaults
