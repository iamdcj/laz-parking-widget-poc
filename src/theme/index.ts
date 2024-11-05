import { createTheme } from "@mui/material/styles";

export const useThemeConfig = () => {
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
        main: "#005EB8",
        light: "#E0F0FE",
        dark: "#072a4a",
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
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 4,
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
    },
  });
};
