import { createTheme } from "@mui/material/styles";
import { useAppContext } from "../context";
import { ExpandMore } from "@mui/icons-material";

export const useThemeConfig = () => {
  const {
    state: { theme },
  } = useAppContext();

  return createTheme({
    cssVariables: false,
    typography: {
      fontFamily: [
        '"Figtree"',
        "Arial",
        "sans-serif",
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
      ].join(","),
      fontSize: 14,
      h1: {
        fontSize: 56,
        fontWeight: 600,
      },
      h2: {
        fontSize: 40,
        fontWeight: 600,
      },
      h3: {
        fontSize: 32,
        fontWeight: 600,
      },
      h4: {
        fontSize: 24,
        fontWeight: 600,
      },
      h5: {
        fontSize: 20,
        fontWeight: 600,
      },
      h6: {
        fontSize: 16,
        fontWeight: 600,
      },
      body1: {
        fontSize: 14,
      },
      body2: {
        fontSize: 14,
      },
      caption: {
        fontSize: 12,
      },
    },
    spacing: 6,
    palette: {
      primary: {
        main: theme?.primary || "#005EB8",
      },
      secondary: {
        main: theme?.secondary || "#5BFAD7",
      },
      accent: {
        main: theme?.accent || "#AAB2F7",
      },
    },
    components: {
      MuiSelect: {
        defaultProps: {
          IconComponent: ExpandMore,
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: "none",
            borderRadius: 4,
          },
        },
      },
      MuiInputBase: {
        styleOverrides: {
          root: {
            background: "#fff",
            fontSize: 14,
          },
        },
      },
      MuiMenuItem: {
        styleOverrides: {
          root: {
            minHeight: 36,
          },
        },
      },
      MuiRadio: {
        styleOverrides: {
          root: {
            paddingLeft: 0,
          },
        },
      },
    },
  });
};
