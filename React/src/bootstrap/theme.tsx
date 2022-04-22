import { theme } from '@chakra-ui/react';
import { merge } from 'lodash';

import { actionFormStyles } from '../components/Actions/ActionForm';
import { actionListElementStyles } from '../components/Actions/ActionListItem';
import { adminModalStyles } from '../components/Admin/AdminModal';
import { adminTableHeaderStyles } from '../components/Admin/AdminTableHeader';
import { adminTableHeaderElementStyles } from '../components/Admin/AdminTableHeaderElement';
import { addComplianceItemAttributeStyles } from '../components/AdminComplianceItemModal/AddComplianceItemAttribute';
import { additionalDetailsStyles } from '../components/AdminComplianceItemModal/AdditionalDetails';
import { businessUnitsModalStyles } from '../components/AdminComplianceItemModal/BusinessUnits';
import { cloneComplianceItemModalStyles } from '../components/AdminComplianceItemModal/CloneComplianceItemModal';
import { complianceItemModalStyles } from '../components/AdminComplianceItemModal/ComplianceItemModal';
import { deleteComplianceItemModalStyles } from '../components/AdminComplianceItemModal/DeleteComplianceItemModal';
import { locationsFormModalStyles } from '../components/AdminComplianceItemModal/Locations';
import { navigationMobileModalStyles } from '../components/AdminComplianceItemModal/NavigationMobileModal';
import { navigationModalStyles } from '../components/AdminComplianceItemModal/NavigationModal';
import { questionsModalStyles } from '../components/AdminComplianceItemModal/Questions';
import { summaryModalStyles } from '../components/AdminComplianceItemModal/Summary';
import { summaryItemModalStyles } from '../components/AdminComplianceItemModal/SummaryItem';
import { alertDialogStyles } from '../components/AlertDialog';
import { auditAnswerStyles } from '../components/Audit/AuditAnswer';
import { auditHeaderStyles } from '../components/Audit/AuditHeader';
import { auditHeaderMenuItemStyles } from '../components/Audit/AuditHeaderMenuItem';
import { auditLeftNavigationStyles } from '../components/Audit/AuditLeftNavigation';
import { auditLeftTabItemStyles } from '../components/Audit/AuditLeftTabItem';
import { auditNewQuestionModalStyles } from '../components/Audit/AuditNewQuestionModal';
import { auditsGroupStyles } from '../components/Audit/AuditsGroup';
import { auditsListStyles } from '../components/Audit/AuditsList';
import { auditSquareStyles } from '../components/Audit/AuditSquare';
import { auditLogStyles } from '../components/AuditLog/AuditLog';
import { auditLogDayStyles } from '../components/AuditLog/AuditLogDay';
import { auditLogRecordStyles } from '../components/AuditLog/AuditLogRecord';
import { auditModalStyles } from '../components/AuditModal/AuditModal';
import { auditTeamModalStyles } from '../components/AuditModal/AuditTeamModal';
import { barChartStyles } from '../components/BarChart';
import { businessUnitsSelectorStyles } from '../components/BusinessUnitsSelector';
import { complianceGroupItemsStyles } from '../components/ComplianceItem/ComplianceItemsGroup';
import { complianceListItemsStyles } from '../components/ComplianceItem/ComplianceItemsList';
import { complianceItemsSquareStyles } from '../components/ComplianceItem/ComplianceItemSquare';
import { customRadioButtonStyles } from '../components/CustomRadioButton';
import { documentUploadedStyles } from '../components/Documents/DocumentUploaded';
import { filtersPanelStyles } from '../components/Filters/FiltersPanel';
import { filtersPanelItemStyles } from '../components/Filters/FiltersPanelItem';
import { datepickerStyles } from '../components/Forms/Datepicker';
import { dropdownStyles } from '../components/Forms/Dropdown';
import { multipleChoicesStyles } from '../components/Forms/MultipleChoices';
import { numberInputStyles } from '../components/Forms/NumberInput';
import { peoplePickerStyles } from '../components/Forms/PeoplePicker';
import { switchStyles } from '../components/Forms/Switch';
import { textMultilineInputStyles } from '../components/Forms/Textarea';
import { textConfirmInputStyles } from '../components/Forms/TextConfirmInput';
import { textInputStyles } from '../components/Forms/TextInput';
import { textMultilineConfirmInputStyles } from '../components/Forms/TextMultilineConfirmInput';
import { toggleStyles } from '../components/Forms/Toggle';
import { headerStyles } from '../components/Header';
import { locationsSelectorStyles } from '../components/LocationsSelector';
import { moduleSwitcherStyles } from '../components/ModuleSwitcher';
import { navigationBottomMobileStyles } from '../components/NavigationBottomMobile';
import { navigationLeftStyles } from '../components/NavigationLeft/NavigationLeft';
import { navigationLeftFiltersStyles } from '../components/NavigationLeft/NavigationLeftFilters';
import { navigationLeftItemStyles } from '../components/NavigationLeft/NavigationLeftItem';
import { navigationLeftItemTabletStyles } from '../components/NavigationLeft/NavigationLeftItemTablet';
import { subSectionStyles } from '../components/NavigationLeft/SubSection';
import { navigationTopStyles } from '../components/NavigationTop';
import { questionEmailFormStyles } from '../components/Questions/QuestionEmailForm';
import { questionFormStyles } from '../components/Questions/QuestionForm';
import { questionListStyles } from '../components/Questions/QuestionList';
import { questionListElementStyles } from '../components/Questions/QuestionListElement';
import { questionMultiChoiceFormStyles } from '../components/Questions/QuestionMultiChoiceForm';
import { questionSimpleFormStyles } from '../components/Questions/QuestionSimpleForm';
import { chatMentionStyles } from '../components/Response/ChatMention';
import { responseRenewalDetailsStyles } from '../components/Response/Details';
import { evidenceStyles } from '../components/Response/Evidence';
import { historicalListItemStyles } from '../components/Response/HistoricalListItem';
import { messageInputStyles } from '../components/Response/MessageInput';
import { responseRenewalModalStyles } from '../components/Response/RenewalModal';
import { responseChatStyles } from '../components/Response/ResponseChat';
import { responseChatItemStyles } from '../components/Response/ResponseChatItem';
import { responseHeaderStyles } from '../components/Response/ResponseHeader/ResponseHeader';
import { responseHeaderMenuItemStyles } from '../components/Response/ResponseHeader/ResponseHeaderMenuItem';
import { responseHeaderStatusStyles } from '../components/Response/ResponseHeader/ResponseHeaderStatus';
import { responseLeftNavigationStyles } from '../components/Response/ResponseLeftNavigation';
import { responseLeftTabItemStyles } from '../components/Response/ResponseLeftTabItem';
import { responseQuestionsStyles } from '../components/Response/ResponseQuestions';
import { responseTabItemStyles } from '../components/Response/ResponseTabItem';
import { emailTemplateStyles } from '../components/Settings/EmailTemplate';
import { emailTemplatesStyles } from '../components/Settings/EmailTemplates';
import { settingsTabItemStyles } from '../components/Settings/TabItem';
import { shareModalStyles } from '../components/ShareModal';
import { statusSelectorStyles } from '../components/StatusSelector';
import { avatarUserStyles } from '../components/Team/AvatarUser';
import { userMenuStyles } from '../components/UserMenu';
import { userSelectorStyles } from '../components/UsersSelector';
import { responseLayoutStyles } from '../layouts/ResponseLayout';
import { auditTypesAdminStyles } from '../pages/admin/audit-types';
import { businessUnitsStyles } from '../pages/admin/business-units';
import { categoriesStyles } from '../pages/admin/categories';
import { complianceItemsAdminWithContextStyles } from '../pages/admin/compliance-items';
import { locationsStyles } from '../pages/admin/locations';
import { regulatoryBodiesStyles } from '../pages/admin/regulatory-bodies';
import { userItemStyles } from '../pages/admin/users';
import { auditItemStyles } from '../pages/audit';
import { auditsStyles } from '../pages/audits';
import { historyPageStyles } from '../pages/compliance-item/history';
import { complianceItemResponseStyles } from '../pages/compliance-item/index';
import { teamPageStyles } from '../pages/compliance-item/team';
import { complianceItemStyles } from '../pages/compliance-items';
import { loginPageStyles } from '../pages/login';
import { logoutPageStyles } from '../pages/logout';

// http://chir.ag/projects/name-that-color - Get color names
// https://smart-swatch.netlify.app/#462AC4 - Get color schemes

const getTheme = (organizationTheme?: any) => {
  const customTheme: any = {
    ...theme,
    breakpoints: {
      tablet: '768px',
      desktop: '1280px',
    },
    shadows: {
      ...theme.shadows,
      outline: 'none',
    },
    fonts: {
      ...theme.fonts,
      body: "'Lato', sans-serif",
      heading: "'Lato', sans-serif",
      mono: "'Lato', sans-serif",
    },
    fontSizes: {
      ...theme.fontSizes,
      xs: '10px',
      ssm: '11px',
      sm: '12px',
      smm: '14px',
      md: '16px',
      lg: '18px',
      xl: '20px',
      xxl: '24px',
    },
    fontWeights: {
      ...theme.fontWeights,
      normal: 300,
      semi_medium: 400,
      medium: 500,
      bold: 700,
    },
    colors: merge(
      {
        ...theme.colors,
        ...actionFormStyles,
        ...actionListElementStyles,
        ...adminModalStyles,
        ...additionalDetailsStyles,
        ...addComplianceItemAttributeStyles,
        ...adminModalStyles,
        ...adminTableHeaderElementStyles,
        ...adminTableHeaderStyles,
        ...alertDialogStyles,
        ...auditAnswerStyles,
        ...auditHeaderMenuItemStyles,
        ...auditHeaderStyles,
        ...auditItemStyles,
        ...auditLeftNavigationStyles,
        ...auditLeftTabItemStyles,
        ...auditLogDayStyles,
        ...auditLogRecordStyles,
        ...auditLogStyles,
        ...auditModalStyles,
        ...auditNewQuestionModalStyles,
        ...auditSquareStyles,
        ...auditTeamModalStyles,
        ...auditTypesAdminStyles,
        ...auditsGroupStyles,
        ...auditsListStyles,
        ...avatarUserStyles,
        ...barChartStyles,
        ...businessUnitsModalStyles,
        ...businessUnitsSelectorStyles,
        ...businessUnitsStyles,
        ...categoriesStyles,
        ...chatMentionStyles,
        ...cloneComplianceItemModalStyles,
        ...complianceGroupItemsStyles,
        ...complianceItemModalStyles,
        ...complianceItemsAdminWithContextStyles,
        ...complianceItemResponseStyles,
        ...complianceItemStyles,
        ...complianceItemsSquareStyles,
        ...complianceListItemsStyles,
        ...customRadioButtonStyles,
        ...datepickerStyles,
        ...deleteComplianceItemModalStyles,
        ...documentUploadedStyles,
        ...dropdownStyles,
        ...emailTemplateStyles,
        ...emailTemplatesStyles,
        ...evidenceStyles,
        ...filtersPanelItemStyles,
        ...filtersPanelStyles,
        ...headerStyles,
        ...historicalListItemStyles,
        ...historyPageStyles,
        ...loginPageStyles,
        ...locationsStyles,
        ...locationsFormModalStyles,
        ...locationsSelectorStyles,
        ...logoutPageStyles,
        ...messageInputStyles,
        ...moduleSwitcherStyles,
        ...multipleChoicesStyles,
        ...navigationBottomMobileStyles,
        ...navigationLeftFiltersStyles,
        ...navigationLeftItemStyles,
        ...navigationLeftItemTabletStyles,
        ...navigationLeftStyles,
        ...navigationMobileModalStyles,
        ...navigationModalStyles,
        ...navigationTopStyles,
        ...numberInputStyles,
        ...peoplePickerStyles,
        ...questionEmailFormStyles,
        ...questionFormStyles,
        ...questionListElementStyles,
        ...questionListStyles,
        ...questionsModalStyles,
        ...questionMultiChoiceFormStyles,
        ...questionSimpleFormStyles,
        ...regulatoryBodiesStyles,
        ...responseChatItemStyles,
        ...responseChatStyles,
        ...responseLeftNavigationStyles,
        ...responseHeaderMenuItemStyles,
        ...responseHeaderStyles,
        ...responseHeaderStatusStyles,
        ...responseLayoutStyles,
        ...responseLeftTabItemStyles,
        ...responseRenewalDetailsStyles,
        ...responseRenewalModalStyles,
        ...responseTabItemStyles,
        ...responseQuestionsStyles,
        ...shareModalStyles,
        ...settingsTabItemStyles,
        ...shareModalStyles,
        ...statusSelectorStyles,
        ...subSectionStyles,
        ...summaryItemModalStyles,
        ...summaryModalStyles,
        ...switchStyles,
        ...teamPageStyles,
        ...textConfirmInputStyles,
        ...textInputStyles,
        ...textMultilineConfirmInputStyles,
        ...textMultilineInputStyles,
        ...toggleStyles,
        ...userItemStyles,
        ...auditsStyles,
        ...userMenuStyles,
        ...userSelectorStyles,

        purpleHeart: {
          50: '#ede9ff',
          100: '#c9bff7',
          200: '#a596ea',
          300: '#816ce1',
          400: '#5d42d7',
          500: '#462AC4',
          600: '#342094',
          700: '#24166b',
          800: '#150d42',
          900: '#07041c',
        },

        additionalQuestions: {
          active: {
            icon: '#1F1F1F',
            requiredIcon: '#A2171E',
            text: '#1F1F1F',
            indicator: '#A2171E',
          },
          inActive: {
            icon: '#9A9EA1',
            text: '#9A9EA1',
            indicator: 'transparent',
            requiredIcon: '#D08B90',
          },
        },
        homePage: {
          button: {
            bg: '#A2171E',
            hoverBg: '#CC242D',
          },
        },
        circularProgress: {
          text: '#9A9EA1',
          progress: '#A2171E',
        },
        layout: {
          bg: '#E5E5E5',
        },
        dashboardFilters: {
          active: '#FFFFFF',
          inActive: '#1F1F1F',
        },
        auditPanel: {
          header: '#9A9EA1',
          bg: '#FFFFFF',
          button: '#1F1F1F',
          headerText: '#FFFFFF',
          ribbon: '#F69942',
          mentionHeader: '#A2171E',
          mentionRibbon: '#A2171E',
          text: '#313233',
          healthKitIcon: '#9A9EA1',
        },
        licensesPanel: {
          header: '#9A9EA1',
          bg: '#FFFFFF',
          button: '#1F1F1F',
          headerText: '#FFFFFF',
          ribbon: '#F69942',
          text: '#313233',
        },
        investigationPanel: {
          header: '#9A9EA1',
          bg: '#FFFFFF',
          button: '#1F1F1F',
          headerText: '#FFFFFF',
          ribbon: '#F69942',
          text: '#313233',
        },
        settings: {
          header: {
            bg: '#2B3236',
            tabPanels: '#424B50',
            selectedTab: '#A2171E',
          },
        },
        chart: {
          labelFontColor: '#2B3236',
        },
        loader: {
          color: '#A2171E',
        },
        adminTableRow: {
          bg: '#FFFFFF',
          font: '#272727',
          eye: '#A2171E',
        },
        adminComplianceItems: {
          headers: '#9A9EA1',
          element: {
            bg: '#FFFFFF',
            font: '#272727',
            unnamed: '#9A9EA1',
            category: '#888888',
            draft: {
              bg: '#EAEAEB',
              font: '#9A9EA1',
            },
            edit: '#A2171E',
          },
        },
        businessUnitsSelector: {
          label: '#777777',
          border: {
            normal: '#CBCCCD',
            focus: '#777777',
          },
          note: '#424B50',
          checkbox: {
            border: '#CBCCCD',
            500: '#A2171E',
          },
          list: {
            checkbox: {
              border: '#CBCCCD',
              500: '#A2171E',
            },
            bg: {
              normal: '#F2F2F2',
              selected: '#A2171E',
            },
            font: {
              normal: '#777777',
              selected: '#FFFFFF',
            },
          },
        },
        businessUnitsCarousel: {
          manyBg: '#FFFFFF',
          elementBg: '#FFFFFF',
        },
        adminComplianceItemModal: {
          bg: '#F2F2F2',
          primaryButton: {
            bg: '#A2171E',
            hoverBg: '#CC242D',
          },
          secondaryButton: {
            bg: '#424B50',
          },
          section: {
            emptyCircle: '#9A9EA1',
            fullCircle: {
              error: '#E53E3E',
              success: '#009400',
            },
            errorSign: '#E53E3E',
            general: {
              description: '#2B3236',
            },
            details: {
              description: '#2B3236',
            },
            businessUnits: {
              description: '#2B3236',
            },
            questions: {
              description: '#2B3236',
              tile: {
                bg: '#F2F2F2',
                icon: '#2B3236',
                button: {
                  bg: '#A2171E',
                  font: '#FFFFFF',
                },
              },
              form: {
                bg: '#F2F2F2',
                icon: '#2B3236',
                button: {
                  primary: {
                    bg: '#A2171E',
                    font: '#FFFFFF',
                  },
                  secondary: {
                    bg: '#9A9EA1',
                    font: '#FFFFFF',
                  },
                },
              },
              list: {
                element: {
                  bg: '#F2F2F2',
                  icon: '#2B3236',
                  name: '#2B3236',
                  description: '#777777',
                  asterisk: '#A2171E',
                  remove: '#2B3236',
                },
              },
            },
            summary: {
              label: '#282F36',
              value: '#2B3236',
              section: '#2B3236',
              questionBg: '#FFFFFF',
              error: '#E53E3E',
            },
          },
          delete: {
            bg: 'rgba(67, 76, 81, 0.95)',
            font: '#FFFFFF',
            keep: {
              bg: '#A2171E',
              hover: '#CC242D',
              font: '#FFFFFF',
            },
          },
        },
        form: {
          checkbox: {
            icon: {
              border: '#CBCCCD',
              500: '#462AC4',
            },
            error: '#E53E3E',
          },
          textarea: {
            font: '#777777',
            bg: '#FFFFFF',
            labelFont: {
              normal: '#818197',
              error: '#E53E3E',
            },
            border: {
              normal: '#CBCCCD',
              error: '#E53E3E',
              focus: {
                normal: '#777777',
                error: '#E53E3E',
              },
            },
            activeBg: '#EEEEEE',
            disabled: {
              font: '#2B3236',
              border: '#EEEEEE',
              bg: '#f7f7f7',
            },
            placeholder: '#CBCCCD',
            error: '#E53E3E',
          },
          textInput: {
            font: '#777777',
            bg: '#FFFFFF',
            labelFont: {
              normal: '#818197',
              error: '#E53E3E',
            },
            border: {
              normal: '#CBCCCD',
              error: '#E53E3E',
              focus: {
                normal: '#777777',
                error: '#E53E3E',
              },
            },
            activeBg: '#EEEEEE',
            disabled: {
              font: '#2B3236',
              border: '#EEEEEE',
              bg: '#f7f7f7',
            },
            placeholder: '#CBCCCD',
            error: '#E53E3E',
          },
        },
        response: {
          leftNavigation: {
            bg: '#424B50',
            businessUnitBg: '#2B3236',
            businessUnitImageBg: '#ffffff',
            businessUnitImageFont: '#2B3236',
            building: '#2B3236',
            copy: '#FC5960',
            avatar: '#FC5960',
          },
          expandButtonText: '#FC5960',
          delegates: {
            fontColor: '#2B3236',
            avatar: '#2B3236',
            button: '#2B3236',
            addButton: '#1C8586',
            inputFocusFont: '#2B3236',
          },
        },
      },
      organizationTheme?.colors || {},
    ),
    styles: {
      global: {
        '.chakra-collapse': {
          width: '100% !important',
        },
      },
    },
    customStyles: {},
    components: {
      ...theme.components,
      Modal: {
        ...theme.components.Modal,
        variants: {
          conformeModal: {
            dialog: {
              minW: ['100%', '700px'],
            },
            dialogContainer: {
              justifyContent: 'flex-end',
            },
            overlay: {
              background:
                'linear-gradient(to right, transparent 0%, black 200%)',
            },
          },
          deleteModal: {
            dialog: {
              minW: '330px',
            },
            dialogContainer: {
              justifyContent: 'flex-end',
            },
            overlay: {
              background:
                'linear-gradient(to right, transparent 0%, black 200%)',
            },
          },
          adminModal: {
            dialog: {
              minW: ['100%', '510px'],
            },
            dialogContainer: {
              justifyContent: 'flex-end',
            },
            overlay: {
              background:
                'linear-gradient(to right, transparent 0%, black 200%)',
            },
          },
          shareModal: {
            dialog: {
              maxW: '330px',
              minW: ['calc(100% - 50px)', '330px'],
            },
          },
          teamModal: {
            dialog: {
              minWidth: ['calc(100% - 50px)', '380px'],
              maxWidth: ['calc(100% - 50px)', '380px'],
              minH: '196px',
              maxH: '500px',
              boxShadow: '0px 0px 80px rgba(49, 50, 51, 0.25)',
              rounded: '20px',
            },
          },
        },
      },
      Input: {
        ...theme.components.Input,
        variants: {
          auditModalSearchInput: {
            field: {
              top: '5px',
              border: 'none',
              outline: '0',
              bg: 'white',
            },
          },
        },
      },
    },
  };

  return customTheme;
};

export default getTheme;
