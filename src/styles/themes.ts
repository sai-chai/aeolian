import {
   createTheme,
   PaletteColor,
   PaletteColorOptions,
} from '@mui/material/styles';
import * as colors from '@mui/material/colors';

export type AQIColors = 'good' 
   | 'moderate' 
   | 'sensitive'
   | 'unhealthy'
   | 'veryUnhealthy'
   | 'hazardous';
export type AQISubPalette = Record<AQIColors, PaletteColor>;
export type AQISubPaletteOptions = Record<AQIColors, PaletteColorOptions>;

export const lightAQIColors: AQISubPaletteOptions = {
   good: { main: colors.lightGreen['A700'] },
   moderate: { main: colors.yellow['A700'] },
   sensitive: { main: colors.orange[600] },
   unhealthy: { main: colors.red['A700'] },
   veryUnhealthy: { main: colors.purple[600] },
   hazardous: { main: '#731425' },
};

export const darkAQIColors: AQISubPaletteOptions = {
   good: { main: colors.lightGreen['A400'] },
   moderate: { main: colors.yellow['A400'] },
   sensitive: { main: colors.orange['A700'] },
   unhealthy: { main: colors.red[900] },
   veryUnhealthy: { main: colors.deepPurple[500] },
   hazardous: { main: '#731425' },
};

export const lightTheme = createTheme({
   palette: {
      mode: 'light',
      aqi: lightAQIColors,
   },
});

export const darkTheme = createTheme({
   palette: {
      mode: 'dark',
      aqi: darkAQIColors,
   },
});

declare module '@mui/material/styles' {
   interface Palette {
      aqi: AQISubPalette;
   }

   interface PaletteOptions {
      aqi: Partial<AQISubPaletteOptions>;
   }
}
