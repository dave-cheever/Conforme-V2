import { createContext, useContext, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';

import { gql, useQuery } from '@apollo/client';
import { t } from 'i18next';
import { capitalize } from 'lodash';
import pluralize from 'pluralize';

import AdditionalDetailsForm from '../components/AdminComplianceItemModal/AdditionalDetails';
import BusinessUnitsForm from '../components/AdminComplianceItemModal/BusinessUnits';
import GeneralForm from '../components/AdminComplianceItemModal/General';
import LocationsForm from '../components/AdminComplianceItemModal/Locations';
import QuestionsForm from '../components/AdminComplianceItemModal/Questions';
import Summary from '../components/AdminComplianceItemModal/Summary';
import { IComplianceItem } from '../interfaces/IComplianceItem';
import { IComplianceItemModalContext } from '../interfaces/IComplianceItemModalContext';
import { IComplianceItemModalDialogDetails } from '../interfaces/IComplianceItemModalDialogDetails';

export const ComplianceItemModalContext = createContext({} as IComplianceItemModalContext);

const GET_FORM_DATA = gql`
  query {
    categories {
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

export const initialDialogDetails: IComplianceItemModalDialogDetails = {
  isOpen: false,
  title: undefined,
  description: undefined,
  state: undefined,
  showButtons: false,
  action: () => {},
};

export interface IComplianceItemModalSection {
  name: string;
  fields?: {
    [fieldName: string]: any;
  };
  Component: any;
}

export const useComplianceItemModalContext = () => {
  const context = useContext(ComplianceItemModalContext);
  if (!context) throw new Error('useComplianceItemModalContext must be used within the ComplianceItemModalProvider');

  return context;
};

const ComplianceItemModalProvider = ({ children }) => {
  const { data, refetch } = useQuery(GET_FORM_DATA);
  const [savingDialogDetails, setSavingDialogDetails] = useState<IComplianceItemModalDialogDetails>(initialDialogDetails);
  const [visitedTab, setVisitedTab] = useState<number>(0);

  const complianceItemModalSections: IComplianceItemModalSection[] = [
    {
      name: 'Details',
      fields: {
        name: '',
        description: '',
        categoryId: undefined,
        regulatoryBodyId: undefined,
        dueDate: undefined,
        frequency: undefined,
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
      name: pluralize(capitalize(t('businessUnit'))),
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
      name: 'Questions',
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

  const defaultValues: Partial<IComplianceItem> = {
    ...complianceItemModalSections[0].fields, // General
    ...complianceItemModalSections[1].fields, // Locations
    ...complianceItemModalSections[2].fields, // Business units
    ...complianceItemModalSections[3].fields, // Additional details
    ...complianceItemModalSections[4].fields, // Questions
  };

  const {
    control,
    formState: { errors },
    watch,
    setValue: setFormValue,
    trigger,
    reset: resetForm,
  } = useForm({
    mode: 'all',
    defaultValues,
  });
  const complianceItem = watch() as Partial<IComplianceItem>;

  const [selectedSection, setSelectedSection] = useState<IComplianceItemModalSection>(complianceItemModalSections[0]);
  const selectedSectionIndex = useMemo(
    () => complianceItemModalSections.findIndex(({ name }) => name === selectedSection.name),

    [selectedSection],
  );

  const selectSection = async (sectionIndex: number) => {
    setSelectedSection(complianceItemModalSections[sectionIndex]);
    if (sectionIndex > visitedTab) setVisitedTab(sectionIndex);
  };

  const setValue = (name, value) => {
    setFormValue(name, value);
    trigger(name, value);
  };

  const reset = (complianceItem?: Partial<IComplianceItem>, sectionIndex = 0) => {
    resetForm(complianceItem || defaultValues);
    setTimeout(() => {
      if (sectionIndex) {
        // Validate first page when opening the form in other page
        trigger(Object.keys(complianceItemModalSections[0].fields || []) as any);
      }
      setSelectedSection(complianceItemModalSections[sectionIndex]);
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
      complianceItem,
      categories: data?.categories || [],
      locations: data?.locations || [],
      regulatoryBodies: data?.regulatoryBodies || [],
      businessUnits: data?.businessUnits || [],
      complianceItemModalSections,
      selectedSection,
      selectedSectionIndex,
      selectSection,
      savingDialogDetails,
      setSavingDialogDetails,
      visitedTab,
      setVisitedTab,
    }),

    [control, errors, complianceItem, data, selectedSection, selectedSectionIndex, savingDialogDetails, visitedTab],
  ) as IComplianceItemModalContext;

  return <ComplianceItemModalContext.Provider value={value}>{children}</ComplianceItemModalContext.Provider>;
};

export default ComplianceItemModalProvider;
