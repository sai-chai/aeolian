import { useState, useCallback, useEffect } from 'react';

import Head from 'next/head';
import { useRouter } from 'next/router';

import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import FormHelperText from '@mui/material/FormHelperText';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

import LoadingModal from 'components/LoadingModal';
import useUser from 'stores/User';
import useLocation from 'stores/Location';
import { initialState as initialUser } from 'types/User';

const locationInputProps = {
   endAdornment: <Typography variant="h5">&deg;</Typography>,
};

export default function NewUserPage() {
   const router = useRouter();

   const theme = useTheme();
   const smQuery = useMediaQuery(theme.breakpoints.up('sm'));
   
   const {
      currentUser,
      status: userStatus,
      actions: {
         startLoading,
         catchError,
         resetError: resetUserError,
         createNewUser,
      },
   } = useUser();
   const {
      status: locationStatus,
      actions: {
         getLocation,
         resetError: resetLocationError,
      },
   } = useLocation();

   const [ newUser, setNewUser ] = useState(initialUser);
   const [ errorText, setErrorText ] = useState('');

   const showLoading = userStatus.isLoading || locationStatus.isLoading;

   useEffect(() => {
      // If currently logged in, redirect to home page
      if (currentUser && !userStatus.isLoading) {
         router.push('/');
      }
   }, [ router, currentUser, userStatus.isLoading ]);

   const handleFieldInput = (event) => {
      setNewUser((prevState) => ({
         ...prevState,
         [event.target.name]: event.target.value,
      }));

      // reset errors on next input after error
      if (userStatus.hasError) {
         resetUserError();
      }
      if (locationStatus.hasError) {
         resetLocationError();
      }
   };

   const handleGetLocation = () => {
      getLocation(setNewUser);
   }

   const handleSubmit = useCallback(async (event) => {
      event.preventDefault();
      startLoading();

      const errMsg = <>
         {!newUser.userName && <>You must enter a username.<br/></>}
         {
            Math.abs(newUser.lat) > 90 
            && <>Latitude is between -90 (90&#176;S) and 90 (90&#176;N).<br/></>
         }
         {
            Math.abs(newUser.long) > 180 && <>
               Longitude is between -180 (180&#176;W) and 180 (180&#176;E).<br/>
            </>
         }
         {newUser.threshold < 0 && <>AQI cannot be negative.</>}
      </>;

      if (errMsg.props.children.some((child) => !!child)) {
         setErrorText(errMsg);
         catchError();
      } else {
         createNewUser(newUser);
      }
   }, [ catchError, newUser, createNewUser, startLoading ]);

   return (
      <>
         <Head>
            <title>Aeolian | New User</title>
            <meta name="description" content="New user form" />
         </Head>

         <LoadingModal isLoading={showLoading} />

         <Grid
            container
            component="form"
            name="newUser"
            aria-live="polite"
            aria-busy={showLoading}
            rowGap={4}
            direction="column"
            alignItems="center"
            justifyContent="center"
            sx={{
               minHeight: `calc(100vh - ${smQuery ? 64 : 56}px)`,
               width: {
                  xs: 280,
                  sm: 550,
                  md: 700,
               },
               margin: 'auto',
            }}
         >
            <Grid item xs={12}>
               <Typography variant="h4" component="h2">
                  New User
               </Typography>
            </Grid>
            <Grid item xs={12}>
               <TextField
                  label="Username"
                  name="userName"
                  value={newUser.userName}
                  onChange={handleFieldInput}
               />
            </Grid>
            <Grid
               container
               item
               justifyContent="center"
               alignItems="center"
               gap={4}
               direction="row"
            >
               <Grid item>
                  <TextField
                     label="Latitude"
                     name="lat"
                     type="number"
                     value={newUser.lat}
                     onChange={handleFieldInput}
                     InputProps={locationInputProps}
                  />
               </Grid>
               <Grid item>
                  <TextField
                     label="Longitude"
                     name="long"
                     type="number"
                     value={newUser.long}
                     onChange={handleFieldInput}
                     InputProps={locationInputProps}
                  />
               </Grid>
               <Grid item>
                  <Button
                     variant="outlined"
                     color={locationStatus.hasError ? 'error' : 'primary'}
                     onClick={handleGetLocation}
                  >
                     Fill Location
                  </Button>
               </Grid>
            </Grid>
            <Grid item xs={12}>
               <TextField
                  label="AQI Threshold"
                  name="threshold"
                  value={newUser.threshold}
                  onChange={handleFieldInput}
               />
            </Grid>
            <Grid item xs={12} hidden={!userStatus.hasError}>
               <FormHelperText error>{errorText || ' '}</FormHelperText>
            </Grid>
            <Grid item xs={12}>
               <Button
                  type="submit"
                  variant="outlined"
                  color={userStatus.hasError ? 'error' : 'primary'}
                  onClick={handleSubmit}
               >
                  Submit
               </Button>
            </Grid>
         </Grid>
      </>
   );
}
