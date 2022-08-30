import { useEffect } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import useMediaQuery from '@mui/material/useMediaQuery';

import MainBar from 'components/MainBar';
import { globalStyles } from 'styles/styles';
import { darkTheme, lightTheme } from 'styles/themes';
import useUser from 'stores/User';

function Aeolian({ Component, pageProps }) {
   const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
   const theme = prefersDarkMode ? darkTheme : lightTheme;
   const {
      currentUser,
      userToken,
      status: { isLoading },
      actions: { triggerLogin }, 
   } = useUser();

   useEffect(() => {
      if(userToken && !currentUser && !isLoading) {
         triggerLogin();
      }
   }, [ userToken, currentUser, isLoading, triggerLogin ]);

   return (
      <ThemeProvider theme={theme}>
         <CssBaseline />
         {globalStyles}
         <div>
            <MainBar />
            <main>
               <Component {...pageProps} />
            </main>
         </div>
      </ThemeProvider>
   );
}

export default Aeolian;
