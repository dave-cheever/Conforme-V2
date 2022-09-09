import { theme } from '@chakra-ui/react';
import { merge } from 'lodash';

import { actionListElementStyles } from '../components/Actions/ActionListItem';
import { actionModalStyles } from '../components/Actions/ActionModal';
import { actionsListStyles } from '../components/Actions/ActionsList';
import { actionSquareStyles } from '../components/Actions/ActionSquare';
import { adminModalStyles } from '../components/Admin/AdminModal';
import { adminTableHeaderStyles } from '../components/Admin/AdminTableHeader';
import { adminTableHeaderElementStyles } from '../components/Admin/AdminTableHeaderElement';
import { additionalDetailsStyles } from '../components/AdminTrackerItemModal/AdditionalDetails';
import { addTrackerItemAttributeStyles } from '../components/AdminTrackerItemModal/AddTrackerItemAttribute';
import { businessUnitsModalStyles } from '../components/AdminTrackerItemModal/BusinessUnits';
import { cloneTrackerItemModalStyles } from '../components/AdminTrackerItemModal/CloneTrackerItemModal';
import { deleteTrackerItemModalStyles } from '../components/AdminTrackerItemModal/DeleteTrackerItemModal';
import { locationsFormModalStyles } from '../components/AdminTrackerItemModal/Locations';
import { navigationMobileModalStyles } from '../components/AdminTrackerItemModal/NavigationMobileModal';
import { navigationModalStyles } from '../components/AdminTrackerItemModal/NavigationModal';
import { questionsModalStyles } from '../components/AdminTrackerItemModal/Questions';
import { summaryModalStyles } from '../components/AdminTrackerItemModal/Summary';
import { summaryItemModalStyles } from '../components/AdminTrackerItemModal/SummaryItem';
import { trackerItemModalStyles } from '../components/AdminTrackerItemModal/TrackerItemModal';
import { alertDialogStyles } from '../components/AlertDialog';
import { auditActionFormStyles } from '../components/Audit/AuditActionForm';
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
import { barChartStyles } from '../components/BarChart';
import { businessUnitsSelectorStyles } from '../components/BusinessUnitsSelector';
import { chatStyles } from '../components/Chat';
import { chatItemStyles } from '../components/ChatItem';
import { chatMentionStyles } from '../components/ChatMention';
import { chatConfirmDeleteModalStyles } from '../components/ConfirmDeleteModal';
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
import { auditsUsersInsightsStyles } from '../components/Insights/AuditsUsersInsights';
import { insightsCardStyles } from '../components/Insights/InsightsCard';
import { locationsSelectorStyles } from '../components/LocationsSelector';
import { moduleSwitcherStyles } from '../components/ModuleSwitcher';
import { navigationBottomMobileStyles } from '../components/NavigationBottomMobile';
import { navigationLeftStyles } from '../components/NavigationLeft/NavigationLeft';
import { navigationLeftFiltersStyles } from '../components/NavigationLeft/NavigationLeftFilters';
import { navigationLeftItemStyles } from '../components/NavigationLeft/NavigationLeftItem';
import { navigationLeftItemTabletStyles } from '../components/NavigationLeft/NavigationLeftItemTablet';
import { subSectionStyles } from '../components/NavigationLeft/SubSection';
import { navigationTopStyles } from '../components/NavigationTop';
import { participantAvatarStyles } from '../components/Participants/ParticipantAvatar';
import { participantListItemStyles } from '../components/Participants/ParticipantListItem';
import { participantsAddButtonStyles } from '../components/Participants/ParticipantsAddButton';
import { participantsDeleteModalStyles } from '../components/Participants/ParticipantsDeleteModal';
import { participantsModalStyles } from '../components/Participants/ParticipantsModal';
import { questionEmailFormStyles } from '../components/Questions/QuestionEmailForm';
import { questionFormStyles } from '../components/Questions/QuestionForm';
import { questionListStyles } from '../components/Questions/QuestionList';
import { questionListElementStyles } from '../components/Questions/QuestionListElement';
import { questionMultiChoiceFormStyles } from '../components/Questions/QuestionMultiChoiceForm';
import { questionSimpleFormStyles } from '../components/Questions/QuestionSimpleForm';
import { questionSingleChoiceFormStyles } from '../components/Questions/QuestionSingleChoiceForm';
import { responseRenewalDetailsStyles } from '../components/Response/Details';
import { evidenceStyles } from '../components/Response/Evidence';
import { historicalListItemStyles } from '../components/Response/HistoricalListItem';
import { messageInputStyles } from '../components/Response/MessageInput';
import { responseRenewalModalStyles } from '../components/Response/RenewalModal';
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
import { sortButtonStyles } from '../components/SortButton';
import { statusSelectorStyles } from '../components/StatusSelector';
import { trackerGroupItemsStyles } from '../components/TrackerItem/TrackerItemsGroup';
import { trackerListItemsStyles } from '../components/TrackerItem/TrackerItemsList';
import { trackerItemsSquareStyles } from '../components/TrackerItem/TrackerItemSquare';
import { userMenuStyles } from '../components/UserMenu';
import { userSelectorStyles } from '../components/UsersSelector';
import { walkItemModalStyles } from '../components/WalkItems/WalkItemModal';
import { walkItemsListStyles } from '../components/WalkItems/WalkItemsList';
import { walkItemSquareStyles } from '../components/WalkItems/WalkItemSquare';
import { responseLayoutStyles } from '../layouts/ResponseLayout';
import { actionsStyles } from '../pages/actions';
import { auditTypesAdminStyles } from '../pages/admin/audit-types';
import { businessUnitsStyles } from '../pages/admin/business-units';
import { categoriesStyles } from '../pages/admin/categories';
import { locationsStyles } from '../pages/admin/locations';
import { regulatoryBodiesStyles } from '../pages/admin/regulatory-bodies';
import { trackerItemsAdminWithContextStyles } from '../pages/admin/tracker-items';
import { userItemStyles } from '../pages/admin/users';
import { auditItemStyles } from '../pages/audit';
import { auditHistoryStyles } from '../pages/audit/history';
import { auditParticipantsStyles } from '../pages/audit/participants';
import { auditsStyles } from '../pages/audits';
import { insightsStyles } from '../pages/insights';
import { actionsInsightsStyles } from '../pages/insights/actions';
import { answersInsightsStyles } from '../pages/insights/answers';
import { auditsInsightsStyles } from '../pages/insights/audits';
import { loginPageStyles } from '../pages/login';
import { logoutPageStyles } from '../pages/logout';
import { historyPageStyles } from '../pages/tracker-item/history';
import { trackerItemResponseStyles } from '../pages/tracker-item/index';
import { teamPageStyles } from '../pages/tracker-item/team';
import { trackerItemStyles } from '../pages/tracker-items';
import { walkItemsStyles } from '../pages/walk-items';

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
      simple: '0px 0px 10px 0px #31323340',
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
        ...actionsListStyles,
        ...actionListElementStyles,
        ...actionModalStyles,
        ...actionSquareStyles,
        ...actionsStyles,
        ...adminModalStyles,
        ...additionalDetailsStyles,
        ...addTrackerItemAttributeStyles,
        ...adminModalStyles,
        ...adminTableHeaderElementStyles,
        ...adminTableHeaderStyles,
        ...alertDialogStyles,
        ...auditActionFormStyles,
        ...auditAnswerStyles,
        ...auditHeaderMenuItemStyles,
        ...auditHeaderStyles,
        ...auditHistoryStyles,
        ...auditItemStyles,
        ...auditLeftNavigationStyles,
        ...auditLeftTabItemStyles,
        ...auditLogDayStyles,
        ...auditLogRecordStyles,
        ...auditLogStyles,
        ...auditModalStyles,
        ...auditNewQuestionModalStyles,
        ...auditParticipantsStyles,
        ...auditSquareStyles,
        ...auditTypesAdminStyles,
        ...auditsGroupStyles,
        ...auditsListStyles,
        ...participantAvatarStyles,
        ...barChartStyles,
        ...businessUnitsModalStyles,
        ...businessUnitsSelectorStyles,
        ...businessUnitsStyles,
        ...categoriesStyles,
        ...chatConfirmDeleteModalStyles,
        ...chatItemStyles,
        ...chatStyles,
        ...chatMentionStyles,
        ...cloneTrackerItemModalStyles,
        ...trackerGroupItemsStyles,
        ...trackerItemModalStyles,
        ...trackerItemsAdminWithContextStyles,
        ...trackerItemResponseStyles,
        ...trackerItemStyles,
        ...trackerItemsSquareStyles,
        ...trackerListItemsStyles,
        ...customRadioButtonStyles,
        ...datepickerStyles,
        ...deleteTrackerItemModalStyles,
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
        ...insightsStyles,
        ...insightsCardStyles,
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
        ...participantListItemStyles,
        ...participantsAddButtonStyles,
        ...participantsDeleteModalStyles,
        ...participantsModalStyles,
        ...questionEmailFormStyles,
        ...questionFormStyles,
        ...questionListElementStyles,
        ...questionListStyles,
        ...questionsModalStyles,
        ...questionMultiChoiceFormStyles,
        ...questionSingleChoiceFormStyles,
        ...questionSimpleFormStyles,
        ...regulatoryBodiesStyles,
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
        ...sortButtonStyles,
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
        ...walkItemsStyles,
        ...walkItemsListStyles,
        ...walkItemSquareStyles,
        ...walkItemModalStyles,
        ...actionsInsightsStyles,
        ...answersInsightsStyles,
        ...auditsInsightsStyles,
        ...auditsUsersInsightsStyles,

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
        adminTrackerItems: {
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
        adminTrackerItemModal: {
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
              background: 'linear-gradient(to right, transparent 0%, black 200%)',
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
              background: 'linear-gradient(to right, transparent 0%, black 200%)',
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
              background: 'linear-gradient(to right, transparent 0%, black 200%)',
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
              width: ['calc(100% - 20px)', '480px'],
              minH: '200px',
              maxH: ['100vh', '700px'],
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
