import { theme } from "@chakra-ui/react";
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
      navigationTop: {
        bg: "#313233",
        addButton: "#A2171E",
      },
      navigationLeft: {
        bg: "#1F1F1F",
        menuList: {
          activeIndicator: "#A2171E",
          unselectedMenuItem: "#9A9EA1",
          selectedMenuItem: "#FFFFFF",
        },
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
        button: {
          bg: "#A2171E",
          hoverBg: "#CC242D",
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

      brand: {
        ...(organizationTheme?.colors?.brand || {}),
      },
    },
    customStyles: {},
    components: {
      ...theme.components,
      Modal: {
        ...theme.components.Modal,
        variants: {
          auditModal: {
            dialogContainer: {
              justifyContent: "flex-end",
            },
            overlay: {
              background:
                "linear-gradient(to right, transparent 0%, black 200%)",
            },
            dialog: {
              backgroundColor: "#F2F2F2",
            },
          },
        },
      },
    },
  };

  return customTheme;
};

export default getTheme;
