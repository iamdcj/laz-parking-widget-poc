import '@mui/material/styles';
import { PaletteColor, SimplePaletteColorOptions } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    accent: PaletteColor;
  }

  interface PaletteOptions {
    accent: SimplePaletteColorOptions;
  }
}