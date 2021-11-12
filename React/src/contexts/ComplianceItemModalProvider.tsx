import React, { createContext, useContext, useMemo, useState } from "react";
import { gql, useQuery } from "@apollo/client";
import { useForm } from "react-hook-form";

import { IComplianceItemModalContext } from "../interfaces/IComplianceItemModalContext";
import { IComplianceItemModalDialogDetails } from "../interfaces/IComplianceItemModalDialogDetails";
import { IComplianceItem } from "../interfaces/IComplianceItem";
import AdditionalDetailsForm from "../components/AdminComplianceItemModal/AdditionalDetails";
import BusinessUnitsForm from "../components/AdminComplianceItemModal/BusinessUnits";
import DetailsForm from "../components/AdminComplianceItemModal/Details";
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
    functionalAreas {
      _id
      name
    }
    regulatoryBodies {
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
  action: () => { },
};

export interface IComplianceItemModalSection {
  name: string;
  fields?: {
    [fieldName: string]: any;
  };
  Component: any;
}

export const complianceItemModalSections: IComplianceItemModalSection[] = [{
  name: 'General',
  fields: {
    name: '',
    description: '',
  },
  Component: GeneralForm,
}, {
  name: 'Details',
  fields: {
    categoryId: undefined,
    regulatoryBodyId: undefined,
    functionalAreaId: undefined,
    dueDate: undefined,
    frequency: undefined,
    published: false,
  },
  Component: DetailsForm,
}, {
  name: 'Business units',
  fields: {
    businessUnitsIds: [],
  },
  Component: BusinessUnitsForm,
}, {
  name: 'Additional details',
  fields: {
    evidenceItems: [],
    retentionPeriod: undefined,
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
  ...complianceItemModalSections[1].fields, // Details
  ...complianceItemModalSections[2].fields, // Business units
  ...complianceItemModalSections[3].fields, // Additional details
  ...complianceItemModalSections[4].fields, // Questions
};

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
  const selectedSectionIndex = useMemo(() => complianceItemModalSections.findIndex(({ name }) => name === selectedSection.name), [selectedSection]);

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

  const businessUnits: any = [{
    "name": "Piotr's BU1",
    "ed": {
      "id": "a2472486-00dc-4f5a-85f1-91c28757030a",
      "firstName": "Piotr",
      "displayName": "Piotr Michalak",
      "lastName": null,
      "email": "admin@piotrccdev.onmicrosoft.com"
    },
    "type": "Corporate",
    "region": "Head office",
    "_id": "5d33059f-83fe-4426-9495-3a5dd7bacc0b",
  }];

  const value = useMemo(() => ({
    control, errors, setValue, trigger, reset,
    complianceItem,
    categories: data?.categories || [],
    regulatoryBodies: data?.regulatoryBodies || [],
    functionalAreas: data?.functionalAreas || [],
    businessUnits,
    selectedSection, selectedSectionIndex, setSelectedSection,
    savingDialogDetails, setSavingDialogDetails,
  }), [ // eslint-disable-line react-hooks/exhaustive-deps
    control, errors,
    complianceItem,
    data,
    businessUnits,
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
