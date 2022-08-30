import { css } from '@emotion/react';
import GlobalStyles from '@mui/material/GlobalStyles';

export const globalStyles = (
   <GlobalStyles
      styles={css`
         html,
         body {
            padding: 0;
            margin: 0;
         }

         a:link,
         a:visited {
            color: inherit;
            text-decoration: none;
         }
         a:hover {
            text-decoration: underline;
            text-decoration-thickness: 0.05em;
            text-underline-offset: 0.1em;
         }

         * {
            box-sizing: border-box;
         }
      `} 
   />
);
