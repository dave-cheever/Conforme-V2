import { theme } from "@chakra-ui/react";
import { additionalDetailsStyles } from "../components/AdminComplianceItemModal/AdditionalDetails";
import { addComplianceItemAttributeStyles } from "../components/AdminComplianceItemModal/AddComplianceItemAttribute";
import { adminModalStyles } from "../components/Admin/AdminModal";
import { adminTableHeaderElementStyles } from "../components/Admin/AdminTableHeaderElement";
import { adminTableHeaderStyles } from "../components/Admin/AdminTableHeader";
import { alertDialogStyles } from "../components/AlertDialog";
import { avatarUserStyles } from "../components/Team/AvatarUser";
import { barChartStyles } from "../components/BarChart";
import { businessUnitsModalStyles } from "../components/AdminComplianceItemModal/BusinessUnits";
import { businessUnitsSelectorStyles } from "../components/BusinessUnitsSelector";
import { businessUnitsStyles } from "../pages/admin/business-units";
import { categoriesStyles } from "../pages/admin/categories";
import { chatMentionStyles } from "../components/Response/ChatMention";
import { cloneComplianceItemModalStyles } from "../components/AdminComplianceItemModal/CloneComplianceItemModal";
import { complianceItemsAdminWithContextStyles } from "../pages/admin/compliance-items";
import { complianceGroupItemsStyles } from "../components/ComplianceItem/ComplianceItemsGroup";
import { complianceItemModalStyles } from "../components/AdminComplianceItemModal/ComplianceItemModal";
import { complianceItemResponseStyles } from "../pages/compliance-item/index";
import { complianceItemStyles } from "../pages/compliance-items";
import { complianceItemsSquareStyles } from "../components/ComplianceItem/ComplianceItemSquare";
import { complianceListItemsStyles } from "../components/ComplianceItem/ComplianceItemsList";
import { customRadioButtonStyles } from "../components/CustomRadioButton";
import { documentUploadedStyles } from "../components/Response/DocumentUploaded";
import { dropdownStyles } from '../components/Forms/Dropdown';
import { emailTemplateStyles } from "../components/Settings/EmailTemplate";
import { emailTemplatesStyles } from "../components/Settings/EmailTemplates";
import { evidenceStyles } from "../components/Response/Evidence";
import { filtersPanelItemStyles } from "../components/Filters/FiltersPanelItem";
import { filtersPanelStyles } from "../components/Filters/FiltersPanel";
import { headerStyles } from "../components/Header";
import { loginPageStyles } from "../pages/login";
import { messageInputStyles } from "../components/Response/MessageInput";
import { navigationLeftFiltersStyles } from "../components/NavigationLeft/NavigationLeftFilters";
import { navigationLeftItemStyles } from "../components/NavigationLeft/NavigationLeftItem";
import { navigationBottomMobileStyles } from "../components/NavigationBottomMobile";
import { navigationLeftItemTabletStyles } from "../components/NavigationLeft/NavigationLeftItemTablet";
import { navigationLeftStyles } from "../components/NavigationLeft/NavigationLeft";
import { navigationMobileModalStyles } from "../components/AdminComplianceItemModal/NavigationMobileModal";
import { navigationModalStyles } from "../components/AdminComplianceItemModal/NavigationModal";
import { navigationTopStyles } from "../components/NavigationTop";
import { questionEmailFormStyles } from "../components/Questions/QuestionEmailForm";
import { questionFormStyles } from "../components/Questions/QuestionForm";
import { questionListElementStyles } from "../components/Questions/QuestionListElement";
import { questionListStyles } from "../components/Questions/QuestionList";
import { questionsModalStyles } from "../components/AdminComplianceItemModal/Questions";
import { questionMultiChoiceFormStyles } from "../components/Questions/QuestionMultiChoiceForm";
import { questionSimpleFormStyles } from "../components/Questions/QuestionSimpleForm";
import { regulatoryBodiesStyles } from "../pages/admin/regulatory-bodies";
import { responseChatStyles } from "../components/Response/ResponseChat";
import { responseChatSentStyles } from "../components/Response/ResponseChatSent";
import { responseChatRecievedStyles } from "../components/Response/ResponseChatRecieved";
import { responseHeaderStyles } from "../components/Response/ResponseHeader/ResponseHeader";
import { responseHeaderStatusStyles } from "../components/Response/ResponseHeader/ResponseHeaderStatus";
import { responseHeaderMenuItemStyles } from "../components/Response/ResponseHeader/ResponseHeaderMenuItem";
import { responseLeftNavigationStyles } from "../components/Response/ResponseLeftNavigation";
import { responseTabItemStyles } from "../components/Response/ResponseTabItem";
import { responseLeftTabItemStyles } from "../components/Response/ResponseLeftTabItem";
import { responseQuestionsStyles } from "../components/Response/ResponseQuestions";
import { shareModalStyles } from "../components/ShareModal";
import { subSectionStyles } from "../components/NavigationLeft/SubSection";
import { settingsTabItemStyles } from "../components/Settings/TabItem";
import { summaryItemModalStyles } from "../components/AdminComplianceItemModal/SummaryItem";
import { summaryModalStyles } from "../components/AdminComplianceItemModal/Summary";
import { teamPageStyles } from "../pages/compliance-item/team";
import { textConfirmInputStyles } from "../components/Forms/TextConfirmInput";
import { toggleStyles } from "../components/Response/Toggle";
import { userMenuStyles } from "../components/UserMenu";

// http://chir.ag/projects/name-that-color - Get color names
// https://smart-swatch.netlify.app/#462AC4 - Get color schemes

const getTheme = (organizationTheme?: any) => {
  const customTheme: any = {
    ...theme,
    breakpoints: {
      tablet: "768px",
      desktop: "1280px"
    },
    shadows: {
      ...theme.shadows,
      outline: "none",
    },
    fonts: {
      ...theme.fonts,
      body: "'Lato', sans-serif",
      heading: "'Lato', sans-serif",
      mono: "'Lato', sans-serif",
    },
    fontSizes: {
      ...theme.fontSizes,
      xs: "10px",
      ssm: "11px",
      sm: "12px",
      smm: "14px",
      md: "16px",
      lg: "18px",
      xl: "20px",
      xxl: "24px",
    },
    fontWeights: {
      ...theme.fontWeights,
      normal: 300,
      semi_medium: 400,
      medium: 500,
      bold: 700,
    },
    colors: {
      ...theme.colors,
      ...adminModalStyles,
      ...additionalDetailsStyles,
      ...addComplianceItemAttributeStyles,
      ...adminModalStyles,
      ...adminTableHeaderElementStyles,
      ...adminTableHeaderStyles,
      ...alertDialogStyles,
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
      ...documentUploadedStyles,
      ...dropdownStyles,
      ...emailTemplateStyles,
      ...emailTemplatesStyles,
      ...evidenceStyles,
      ...filtersPanelItemStyles,
      ...filtersPanelStyles,
      ...headerStyles,
      ...loginPageStyles,
      ...messageInputStyles,
      ...navigationBottomMobileStyles,
      ...navigationLeftFiltersStyles,
      ...navigationLeftItemStyles,
      ...navigationLeftItemTabletStyles,
      ...navigationLeftStyles,
      ...navigationMobileModalStyles,
      ...navigationModalStyles,
      ...navigationTopStyles,
      ...questionEmailFormStyles,
      ...questionFormStyles,
      ...questionListElementStyles,
      ...questionListStyles,
      ...questionsModalStyles,
      ...questionMultiChoiceFormStyles,
      ...questionSimpleFormStyles,
      ...regulatoryBodiesStyles,
      ...responseChatRecievedStyles,
      ...responseChatSentStyles,
      ...responseChatStyles,
      ...responseLeftNavigationStyles,
      ...responseQuestionsStyles,
      ...responseTabItemStyles,
      ...responseHeaderStyles,
      ...responseHeaderStatusStyles,
      ...responseHeaderMenuItemStyles,
      ...responseLeftTabItemStyles,
      ...shareModalStyles,
      ...settingsTabItemStyles,
      ...subSectionStyles,
      ...summaryItemModalStyles,
      ...summaryModalStyles,
      ...teamPageStyles,
      ...textConfirmInputStyles,
      ...toggleStyles,
      ...userMenuStyles,

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

      auditModal: {
        title: {
          text: "#434B4F",
        },
        avatar: {
          bg: "#F69942",
          text: "#9A9EA1",
        },
        location: {
          text: "#9A9EA1",
        },
        questionGroup: {
          checked: "#41B916",
          activeButton: {
            500: "#A2171E",
            600: "#A2171E",
          },
          nonActiveButton: {
            500: "#FFF",
            600: "#FFF",
          },
        },
        menu: {
          bg: "transparent",
          text: "#9A9EA1",
          active: {
            icon: "#1F1F1F",
            text: "#1F1F1F",
            indicator: "#A2171E",
          },
          inActive: {
            icon: "#9A9EA1",
            text: "#9A9EA1",
            indicator: "transparent",
          },
        },
        participants: {
          text: "#1F1F1F",
          avatar: {
            bg: "#F69942",
            text: {
              name: "#1F1F1F",
              designation: "#9A9EA1",
            },
          },
          customSearch: {
            bg: "white",
            border: "#9A9EA180",
          },
          inspect: {
            text: "#1F1F1F",
            area: {
              text: {
                name: "#1F1F1F",
                location: "#9A9EA1",
              },
            },
          },
          auditType: {
            text: "#1F1F1F",
          },
        },
        button: {
          bg: "#A2171E",
          hoverBg: "#CC242D",
        },
      },
      additionalQuestions: {
        active: {
          icon: "#1F1F1F",
          requiredIcon: "#A2171E",
          text: "#1F1F1F",
          indicator: "#A2171E",
        },
        inActive: {
          icon: "#9A9EA1",
          text: "#9A9EA1",
          indicator: "transparent",
          requiredIcon: "#D08B90",
        },
      },
      homePage: {
        button: {
          bg: "#A2171E",
          hoverBg: "#CC242D",
        },
      },
      circularProgress: {
        text: "#9A9EA1",
        progress: "#A2171E",
      },
      layout: {
        bg: "#E5E5E5",
      },
      dashboardFilters: {
        active: "#FFFFFF",
        inActive: "#1F1F1F",
      },
      auditPanel: {
        header: "#9A9EA1",
        bg: "#FFFFFF",
        button: "#1F1F1F",
        headerText: "#FFFFFF",
        ribbon: "#F69942",
        mentionHeader: "#A2171E",
        mentionRibbon: "#A2171E",
        text: "#313233",
        healthKitIcon: "#9A9EA1",
      },
      licensesPanel: {
        header: "#9A9EA1",
        bg: "#FFFFFF",
        button: "#1F1F1F",
        headerText: "#FFFFFF",
        ribbon: "#F69942",
        text: "#313233",
      },
      investigationPanel: {
        header: "#9A9EA1",
        bg: "#FFFFFF",
        button: "#1F1F1F",
        headerText: "#FFFFFF",
        ribbon: "#F69942",
        text: "#313233",
      },
      settings: {
        header: {
          bg: "#2B3236",
          tabPanels: "#424B50",
          selectedTab: "#A2171E",
        },
      },
      chart: {
        labelFontColor: "#2B3236",
      },
      loginPage: {
        bg: "#2B3236",
      },
      loader: {
        color: "#A2171E",
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
          }
        },
      },
      businessUnitsCarousel: {
        manyBg: '#FFFFFF',
        elementBg: '#FFFFFF',
      },
      adminComplianceItemModal: {
        bg: "#F2F2F2",
        primaryButton: {
          bg: "#A2171E",
          hoverBg: "#CC242D",
        },
        secondaryButton: {
          bg: "#424B50",
        },
        section: {
          emptyCircle: '#9A9EA1',
          fullCircle: {
            error: "#E53E3E",
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
              }
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
            bg: "#A2171E",
            hover: "#CC242D",
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
        datepicker: {
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
          error: '#E53E3E',
        },
        numberInput: {
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
        switch: {
          enableColor: "#282F36",
          disableColor: "#818197",
          color: {
            50: '#ede9ff',
            100: '#c9bff7',
            200: '#a596ea',
            300: '#816ce1',
            400: '#5d42d7',
            500: '#c9bff7',
            600: '#342094',
            700: '#24166b',
            800: '#150d42',
            900: '#07041c',
          }
        }
      },
      response: {
        leftNavigation: {
          bg: "#424B50",
          businessUnitBg: "#2B3236",
          businessUnitImageBg: "#ffffff",
          businessUnitImageFont: "#2B3236",
          building: "#2B3236",
          copy: "#FC5960",
          avatar: "#FC5960",
        },
        expandButtonText: "#FC5960",
        delegates: {
          fontColor: "#2B3236",
          avatar: "#2B3236",
          button: "#2B3236",
          addButton: "#1C8586",
          inputFocusFont: "#2B3236"
        }
      },

      brand: {
        ...(organizationTheme?.colors?.brand || {}),
      },
    },
    styles: {
      global: {
        ".chakra-collapse": {
          width: "100% !important",
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
              minW: ["100%", "700px"],
            },
            dialogContainer: {
              justifyContent: "flex-end"
            },
            overlay: {
              background:
                "linear-gradient(to right, transparent 0%, black 200%)",
            },
          },
          adminModal: {
            dialog: {
              minW: ["100%", "510px"],
            },
            dialogContainer: {
              justifyContent: "flex-end"
            },
            overlay: {
              background:
                "linear-gradient(to right, transparent 0%, black 200%)",
            },
          },
          shareModal: {
            dialog: {
              maxW: "330px",
              minW: ["calc(100% - 50px)", "330px"]
            }
          },
          teamModal: {
            dialog: {
              minWidth: ["calc(100% - 50px)", "330px"],
              maxWidth: ["calc(100% - 50px)", "330px"],
              minH: "196px",
              maxH: "356px",
              boxShadow: "0px 0px 80px rgba(49, 50, 51, 0.25)",
              rounded: "20px"
            }
          },
        },
      },
      Input: {
        ...theme.components.Input,
        variants: {
          auditModalSearchInput: {
            field: {
              top: "5px",
              border: "none",
              outline: "0",
              bg: "white",
            },
          },
        },
      },
    },
  };

  return customTheme;
};

export default getTheme;
