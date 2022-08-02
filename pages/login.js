import Head from 'next/head';
import { useRouter } from 'next/router';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';

import useUser from 'utils/useUser';

export default function LoginPage() {
   const router = useRouter();
   const [currentUser, userIsLoading, userHasError] = useUser();

   const showLoadingCircle = userIsLoading || userHasError;
   const redirectToHome = currentUser && !userIsLoading && !userHasError;

   if (redirectToHome) {
      router.push('/index');
   }

   return (
      <>
         <Head>
            <title>Aeolian | Air Quality Monitor</title>
            <meta name="description" content="Generated by create next app" />
         </Head>

         {showLoadingCircle ? (
            <Grid item></Grid>
         ) : (
            <Paper elevation={6}></Paper>
         )}
      </>
   );
}