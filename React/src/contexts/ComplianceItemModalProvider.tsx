import React, { createContext, useContext, useMemo, useState } from "react";
import { gql, useQuery } from "@apollo/client";
import { useForm } from "react-hook-form";

import { IComplianceItemModalContext } from "../interfaces/IComplianceItemModalContext";
import { IComplianceItemModalDialogDetails } from "../interfaces/IComplianceItemModalDialogDetails";
import { IComplianceItem } from "../interfaces/IComplianceItem";
import AdditionalDetailsForm from "../components/AdminComplianceItemModal/AdditionalDetails";
import BusinessUnitsForm from "../components/AdminComplianceItemModal/BusinessUnits";
import GeneralForm from "../components/AdminComplianceItemModal/General";
import QuestionsForm from "../components/AdminComplianceItemModal/Questions";
import Summary from "../components/AdminComplianceItemModal/Summary";

export const ComplianceItemModalContext = createContext({} as IComplianceItemModalContext);

const GET_FORM_DATA = gql`
  query {
    categories {
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
      region
    }
  }
`;

export const initialDialogDetails: IComplianceItemModalDialogDetails = {
  isOpen: false,
  title: undefined,
  description: undefined,
  state: undefined,
  showButtons: false,
  action: () => { },
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
  if (!context) {
    throw new Error('useComplianceItemModalContext must be used within the ComplianceItemModalProvider');
  }
  return context;
};

const ComplianceItemModalProvider = (props) => {
  
  const { data } = useQuery(GET_FORM_DATA);
  const [savingDialogDetails, setSavingDialogDetails] = useState<IComplianceItemModalDialogDetails>(initialDialogDetails);

  const complianceItemModalSections: IComplianceItemModalSection[] = [{
    name: 'General',
    fields: {
      name: '',
      description: '',
      categoryId: undefined,
      regulatoryBodyId: undefined,
      dueDate: undefined,
      frequency: undefined,
      published: false,
    },
    Component: GeneralForm,
  }, {
    name: 'Business units',
    fields: {
      businessUnitsIds: [],
    },
    Component: BusinessUnitsForm,
  }, {
    name: 'Evidence',
    fields: {
      evidenceItems: [],
    },
    Component: AdditionalDetailsForm,
  }, {
    name: 'Questions',
    fields: {
      questions: [],
    },
    Component: QuestionsForm,
  }, {
    name: 'Summary',
    Component: Summary,
    fields: {
      _id: undefined,
    },
  }];

  const defaultValues: Partial<IComplianceItem> = {
    ...complianceItemModalSections[0].fields, // General
    ...complianceItemModalSections[1].fields, // Business units
    ...complianceItemModalSections[2].fields, // Additional details
    ...complianceItemModalSections[3].fields, // Questions
  };

  const {
    control,
    formState: { errors },
    watch,
    setValue: setFormValue,
    trigger,
    reset: resetForm,
  } = useForm({
    mode: "all",
    defaultValues,
  });
  const complianceItem = watch() as Partial<IComplianceItem>;

  const [selectedSection, setSelectedSection] = useState<IComplianceItemModalSection>(complianceItemModalSections[0]);
  const selectedSectionIndex = useMemo(
    () => complianceItemModalSections.findIndex(({ name }) => name === selectedSection.name)
  , [selectedSection]); // eslint-disable-line react-hooks/exhaustive-deps

  const selectSection = (sectionIndex: number) => setSelectedSection(complianceItemModalSections[sectionIndex]);

  const setValue = (name, value) => {
    setFormValue(name, value);
    trigger(name, value);
  };

  const reset = (complianceItem?: Partial<IComplianceItem>, setSection: number = 0) => {
    if (setSection !== undefined) {
      setSelectedSection(complianceItemModalSections[setSection]);
    }
    resetForm(complianceItem || defaultValues);
  };

  const value = useMemo(() => ({
    control, errors, setValue, trigger, reset,
    complianceItem,
    categories: data?.categories || [],
    regulatoryBodies: data?.regulatoryBodies || [],
    businessUnits: data?.businessUnits || [],
    complianceItemModalSections, selectedSection, selectedSectionIndex, selectSection,
    savingDialogDetails, setSavingDialogDetails,
  }), [ // eslint-disable-line react-hooks/exhaustive-deps
    control, errors,
    complianceItem,
    data,
    selectedSection, selectedSectionIndex,
    savingDialogDetails,
  ]);

  return (
    <ComplianceItemModalContext.Provider value={value}>
      {props.children}
    </ComplianceItemModalContext.Provider>
  )
}

export default ComplianceItemModalProvider;
