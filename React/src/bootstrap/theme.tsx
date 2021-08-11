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
        addButton: "#A2171E"
      },
      navigationLeft: {
        bg: "#1F1F1F",
      },
      brand: {
        ...(organizationTheme?.colors?.brand || {}),
      },
    },
    customStyles: {},
  };

  return customTheme;
};

export default getTheme;
