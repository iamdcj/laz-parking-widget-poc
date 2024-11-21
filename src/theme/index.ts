import { createTheme } from "@mui/material/styles";
import { useAppContext } from "../context";
import { ExpandMore } from "@mui/icons-material";

export const useThemeConfig = () => {
  const {
    state: { theme },
  } = useAppContext();

  const palette = theme
    ? {
        primary: {
          main: theme?.primary,
        },
        secondary: {
          main: theme?.secondary,
        },
        accent: {
          main: theme?.accent,
        },
      }
    : {
        primary: {
          light: "#0E85EB", // 500
          main: "#015EB8", // 600
          dark: "#0251A4", // 700
        },
        secondary: {
          light: "#0E85EB", // 500
          main: "#015EB8", // 600
          dark: "#0251A4", // 700
        },
        accent: {
          light: "#0E85EB", // 500
          main: "#015EB8", // 600
          dark: "#0251A4", // 700
        }
      };

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
    palette,
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
