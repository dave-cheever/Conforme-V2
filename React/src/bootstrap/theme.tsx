import { theme } from "@chakra-ui/react";
import { navigationLeftStyles } from "../components/NavigationLeft/NavigationLeft";
import { navigationLeftFiltersStyles } from "../components/NavigationLeft/NavigationLeftFilters";
import { navigationLeftItemStyles } from "../components/NavigationLeft/NavigationLeftItem";
import { subSectionStyles } from "../components/NavigationLeft/SubSection";
import { navigationTopStyles } from "../components/NavigationTop";
import { userMenuStyles } from "../components/UserMenu";
import { headerStyles } from "../components/Header";
import { complianceItemStyles } from "../pages/compliance-items";
// http://chir.ag/projects/name-that-color - Get color names

const getTheme = (organizationTheme?: any) => {
  const customTheme: any = {
    ...theme,
    breakpoints: {
      mobile: "0",
      tablet: "421px",
      desktop: "769px",
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
      ...navigationLeftStyles,
      ...navigationLeftItemStyles,
      ...navigationLeftFiltersStyles,
      ...subSectionStyles,
      ...navigationTopStyles,
      ...userMenuStyles,
      ...headerStyles,
      ...complianceItemStyles,
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
      categories: {
        fontColor: "#9A9EA1",
      },
      functionalAreas: {
        fontColor: "#9A9EA1",
      },
      regulatoryBodies: {
        fontColor: "#9A9EA1",
      },
      businessUnit: {
        binIconColor: "#FC5960",
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
          additionalDetails: {
            description: '#2B3236',
            evidence: {
              bg: '#F2F2F2',
              title: '#2B3236',
              label: '#2B3236',
              input: {
                font: {
                  normal: '#777777',
                  focus: '#2B3236',
                },
                bg: '#FFFFFF',
                border: '#CBCCCD',
              },
              remove: '#E53E3E',
              add: {
                bg: '#A2171E',
                font: '#FFFFFF',
              },
            },
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
            label: '#9A9EA1',
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
      adminModal: {
        content: {
          bg: "#FFFFFF",
        },
        body: {
          bg: "#FFFFFF",
        },
        button: {
          bg: "#A2171E",
          hover: "#CC242D",
          keep: {
            bg: "#A2171E",
            hover: "#CC242D",
          },
          color: "#ffffff",
        },
        text: {
          color: "#ffffff",
        },
        delete: {
          bg: 'rgba(67, 76, 81, 0.95)',
        },
      },
      complianceList: {
        compliant: "#62c240",
        nonCompliant: "#FC5960",
        comingUp: "#FFA012",
        fontColor: "#2B3236",
        buildingIcon: "#2B3236",
        crossIcon: "#FC5960",
        tickIcon: "#41BA17",
        imageBg: "#ffffff",
        evidenceFontColor: "#424B50"
      },
      complianceSquare: {
        compliant: "#62c240",
        nonCompliant: "#FC5960",
        comingUp: "#FFA012",
        statusFontColor: '#FFFFFF',
        imageBg: "#ffffff",
        rightIcon: "#9A9EA1",
        crossIcon: "#FC5960",
        tickIcon: "#41BA17",
        fontColor: "#2B3236",
        regulatoryFontColor: "#424B50",
        renewalFontColor: "#424B50",
        evidenceFontColor: "#424B50",
        businessUnitFontColor: "#424B50",
        categoryFontColor: "#424B50",
      },
      complianceGroup: {
        compliant: "#62c240",
        nonCompliant: "#FC5960",
      },
      form: {
        checkbox: {
          icon: {
            border: '#CBCCCD',
            500: '#A2171E',
          },
          error: '#E53E3E',
        },
        datepicker: {
          font: '#777777',
          bg: '#FFFFFF',
          labelFont: {
            normal: '#2B3236',
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
        dropdown: {
          font: '#777777',
          bg: '#FFFFFF',
          labelFont: {
            normal: '#2B3236',
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
        numberInput: {
          font: '#777777',
          bg: '#FFFFFF',
          labelFont: {
            normal: '#2B3236',
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
            normal: '#2B3236',
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
            normal: '#2B3236',
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
            dialogContainer: {
              justifyContent: "flex-end",
            },
            overlay: {
              background:
                "linear-gradient(to right, transparent 0%, black 200%)",
            },
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
