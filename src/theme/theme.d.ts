import '@mui/material/styles';
import { PaletteColor, SimplePaletteColorOptions } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    accent: PaletteColor;
    custom: any
  }

  interface PaletteOptions {
    accent: SimplePaletteColorOptions;
    custom: any;
  }
}