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
          light: "#37A1FA",
          main: "#015EB8",
          dark: "#0251A4",
          contrastText: "#fff",
        },
        secondary: {
          main: "#5BFAD7",
          light: "#CAFFEE",
          dark: "#00D4AF",
        },
        accent: {
          main: "#AAB2F7",
          light: "#E2E6FD",
          dark: "#706BE9",
        },
        error: {
          main: "#FC2B2B",
          light: "#E2E6FD",
          dark: "#706BE9",
        },
        success: {
          main: "#179C54",
          light: "#CAFFEE",
          dark: "#155232",
        },
        warning: {
          main: "#FDB122",
          light: "#FFEFC6",
          dark: "#792E0E",
        },
        info: {
          main: "#596170",
          light: "#8c94a4",
          dark: "#25272c",
        },
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
