import { createContext, useContext, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';

import { gql, useQuery } from '@apollo/client';
import { t } from 'i18next';
import { capitalize } from 'lodash';
import pluralize from 'pluralize';

import AdditionalDetailsForm from '../components/AdminTrackerItemModal/AdditionalDetails';
import BusinessUnitsForm from '../components/AdminTrackerItemModal/BusinessUnits';
import GeneralForm from '../components/AdminTrackerItemModal/General';
import LocationsForm from '../components/AdminTrackerItemModal/Locations';
import QuestionsForm from '../components/AdminTrackerItemModal/Questions';
import Summary from '../components/AdminTrackerItemModal/Summary';
import { ITrackerItem } from '../interfaces/ITrackerItem';
import { ITrackerItemModalContext } from '../interfaces/ITrackerItemModalContext';
import { ITrackerItemModalDialogDetails } from '../interfaces/ITrackerItemModalDialogDetails';
import { useAppContext } from './AppProvider';

export const TrackerItemModalContext = createContext({} as ITrackerItemModalContext);

const GET_FORM_DATA = gql`
  query ($moduleId: ID!) {
    categories (moduleId: $moduleId){
      _id
      name
    }
    locations {
      _id
      name
    }
    regulatoryBodies {
      _id
      name
    }
    businessUnits {
      _id
      name
    }
  }
`;

export const initialDialogDetails: ITrackerItemModalDialogDetails = {
  isOpen: false,
  title: undefined,
  description: undefined,
  state: undefined,
  showButtons: false,
  action: () => {},
};

export interface ITrackerItemModalSection {
  name: string;
  fields?: {
    [fieldName: string]: any;
  };
  Component: any;
}

export const useTrackerItemModalContext = () => {
  const context = useContext(TrackerItemModalContext);
  if (!context) throw new Error('useTrackerItemModalContext must be used within the TrackerItemModalProvider');

  return context;
};

function TrackerItemModalProvider({ children }) {
  const { module } = useAppContext();
  const { data, refetch } = useQuery(GET_FORM_DATA, { variables: { moduleId: module?._id }, skip: !module?._id });
  const [savingDialogDetails, setSavingDialogDetails] = useState<ITrackerItemModalDialogDetails>(initialDialogDetails);
  const [visitedTab, setVisitedTab] = useState<number>(0);

  const trackerItemModalSections: ITrackerItemModalSection[] = [
    {
      name: 'Details',
      fields: {
        name: '',
        description: '',
        categoryId: undefined,
        regulatoryBodyId: undefined,
        dueDate: undefined,
        frequency: undefined,
        dueDateCalculation: 'fromDueDate',
        dueDateEditable: false,
      },
      Component: GeneralForm,
    },
    {
      name: 'Locations',
      fields: {
        locationsIds: [],
      },
      Component: LocationsForm,
    },
    {
      name: pluralize(capitalize(t('business unit'))),
      fields: {
        businessUnitsIds: [],
      },
      Component: BusinessUnitsForm,
    },
    {
      name: 'Evidence',
      fields: {
        evidenceItems: [],
        allowAttachments: true,
      },
      Component: AdditionalDetailsForm,
    },
    {
      name: capitalize(pluralize(t('question'))),
      fields: {
        questions: [],
      },
      Component: QuestionsForm,
    },
    {
      name: 'Summary',
      Component: Summary,
      fields: {
        _id: undefined,
        published: false,
      },
    },
  ];

  const defaultValues: Partial<ITrackerItem> = {
    ...trackerItemModalSections[0].fields, // General
    ...trackerItemModalSections[1].fields, // Locations
    ...trackerItemModalSections[2].fields, // Business units
    ...trackerItemModalSections[3].fields, // Additional details
    ...trackerItemModalSections[4].fields, // Questions
  };

  const {
    control,
    formState: { errors },
    watch,
    setValue: setFormValue,
    trigger,
    reset: resetForm,
  } = useForm({
    mode: 'onChange',
    defaultValues,
  });
  const trackerItem = watch() as Partial<ITrackerItem>;

  const [selectedSection, setSelectedSection] = useState<ITrackerItemModalSection>(trackerItemModalSections[0]);
  const selectedSectionIndex = useMemo(
    () => trackerItemModalSections.findIndex(({ name }) => name === selectedSection.name),

    [selectedSection],
  );

  const [isValidating, setIsValidating] = useState(false);

  const selectSection = async (sectionIndex: number) => {
    if (isValidating) return;
    setIsValidating(true);
    try {
      const fields = Object.keys(trackerItemModalSections[selectedSectionIndex].fields || []);
      if (fields.length > 0) {
        const isValid = await trigger(fields as any);
        if (!isValid) {
          setIsValidating(false);
          return;
        }
      }
      setSelectedSection(trackerItemModalSections[sectionIndex]);
      if (sectionIndex > visitedTab) setVisitedTab(sectionIndex);
    } finally {
      setIsValidating(false);
    }
  };

  const setValue = (name, value) => {
    setFormValue(name, value);
    trigger(name, value);
  };

  const reset = (trackerItem?: Partial<ITrackerItem>, sectionIndex = 0) => {
    resetForm(trackerItem || defaultValues);
    setTimeout(() => {
      if (sectionIndex) {
        // Validate first page when opening the form in other page
        trigger(Object.keys(trackerItemModalSections[0].fields || []) as any);
      }
      setSelectedSection(trackerItemModalSections[sectionIndex]);
      setVisitedTab(sectionIndex);
    }, 1);
  };

  const value = useMemo(
    () => ({
      control,
      errors,
      setValue,
      trigger,
      reset,
      refetch,
      trackerItem,
      categories: data?.categories || [],
      locations: data?.locations || [],
      regulatoryBodies: data?.regulatoryBodies || [],
      businessUnits: data?.businessUnits || [],
      trackerItemModalSections,
      selectedSection,
      selectedSectionIndex,
      selectSection,
      savingDialogDetails,
      setSavingDialogDetails,
      visitedTab,
      setVisitedTab,
      isValidating,
    }),

    [control, errors, trackerItem, data, selectedSection, selectedSectionIndex, savingDialogDetails, visitedTab, isValidating],
  ) as ITrackerItemModalContext;

  return <TrackerItemModalContext.Provider value={value}>{children}</TrackerItemModalContext.Provider>;
}

export default TrackerItemModalProvider;
