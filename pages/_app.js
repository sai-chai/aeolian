import { useMemo } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import useMediaQuery from '@mui/material/useMediaQuery';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import useUser from 'utils/useUser';
import useLocalStorage from 'utils/useLocalStorage';
import '../styles/globals.css';

function Aeolian({ Component, pageProps }) {
   const router = useRouter();
   const [, setLocalStorage] = useLocalStorage();
   const [currentUser, userIsLoading] = useUser();
   const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
   console.log(prefersDarkMode);
   const theme = useMemo(
      () =>
         createTheme({
            palette: {
               mode: prefersDarkMode ? 'dark' : 'light',
            },
         }),
      [prefersDarkMode],
   );

   const handleLogout = event => {
      setLocalStorage('userToken', '');
   };
   let buttonEl;

   if (router.pathname.includes('login')) {
      buttonEl = (
         <Link href="/newUser.js" passHref>
            <Button>New User</Button>
         </Link>
      );
   } else if (!currentUser && !userIsLoading) {
      buttonEl = (
         <Link href="/login.js" passHref>
            <Button>Log In</Button>
         </Link>
      );
   } else {
      buttonEl = <Button onClick={handleLogout}>Log Out</Button>;
   }

   return (
      <ThemeProvider theme={theme}>
         <CssBaseline />
         <div>
            <AppBar position="static">
               <Toolbar>
                  <Typography variant="h3" component="h1" sx={{ flexGrow: 1 }}>
                     Aeolian
                  </Typography>
                  {buttonEl}
               </Toolbar>
            </AppBar>
            <main>
               <Grid
                  container
                  direction="column"
                  alignItems="center"
                  justify="center"
                  sx={{ minHeight: '100vh', pt: 'calc(50vh - 75px)' }}
               >
                  <Component {...pageProps} />
               </Grid>
            </main>
         </div>
      </ThemeProvider>
   );
}

export default Aeolian;
