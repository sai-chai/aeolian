import { useState, useEffect, useMemo, useId } from 'react';

import Head from 'next/head';
import { useRouter } from 'next/router';

import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

import LoadingModal from 'components/LoadingModal';
import AQIGauge from 'components/AQIGauge';
import useUser from 'stores/User';
import useLocation from 'stores/Location';
import useAQI from 'stores/AQI';
import { modalStyles } from 'styles/styles';

const consentModalStyles = {
   ...modalStyles,
   bgcolor: 'background.paper',
   display: 'flex',
   flexDirection: 'column',
   justifyContent: 'space-between',
};

export default function HomePage() {
   const router = useRouter();

   const { breakpoints, palette: { mode: themeMode } } = useTheme();
   const smQuery = useMediaQuery(breakpoints.up('sm'));

   const consentLabelId = useId();
   const cancelBtnId = useId();

   const {
      currentUser,
      status: userStatus,
      actions: {
         updateThreshold,
      },
   } = useUser();
   const {
      coords,
      consent: locationConsent,
      status: locationStatus,
      actions: {
         setConsent,
         resetError: resetLocationError,
         getLocation,
      },
   } = useLocation();
   const {
      aqi: aqiValue, cityName, concern, description,
      status: aqiStatus,
      actions: { getAQI }, 
   } = useAQI();

   const [ threshold , setThreshold ] = useState(0);
   const [ showInput, setShowInput ] = useState(false);
   const [ showConsent, setShowConsent ] = useState(false);

   useEffect(() => {
      // Initial getLocation call
      if (!currentUser && !coords) {
         if (locationConsent && !locationStatus.hasError) {
            getLocation();
         } else if (locationConsent === false || locationStatus.hasError) {
            // If user doesn't approve location access.
            resetLocationError();
            router.replace('/login');
         } else {
            // If consent is null
            setShowConsent(true);
         }
      }
   }, [
      currentUser,
      coords,
      locationStatus.hasError,
      locationConsent,
      router,
      getLocation,
      resetLocationError,
   ]);

   useEffect(() => {
      if (currentUser || coords) {
         getAQI(!currentUser ? coords : {
            lat: currentUser.lat,
            long: currentUser.long,
         });
      }
   }, [ currentUser, coords, getAQI ]);

   // Formats coordinates into human-readable string
   const coordsString = useMemo(() => {
      const current = !!currentUser 
         ? {
            lat: currentUser.lat,
            long: currentUser.long,
         } 
         : coords;

      if (
         !locationStatus.isLoading 
         && !locationStatus.hasError 
         && current !== null
      ) {
         return <>
            {
               Math.abs(current.lat.toFixed(2))
            }&deg;{
               current.lat > 0 ? 'N, ' : 'S, '
            }{
               Math.abs(current.long.toFixed(2))
            }&deg;{
               current.long > 0 ? 'E' : 'W'
            }
         </>
      }
      return null;
   }, [ currentUser, coords, locationStatus ]);

   const handleConsentEvent = (event) => {
      setConsent(event.target.name === 'consent' && !!event.target.value);
      setShowConsent(false);
   }

   const handleThresholdInput = (event) => {
      setThreshold(event.target.value);
   };

   const handleThresholdBtn = (event) => {
      event.preventDefault();
      setShowInput((prevState) => !prevState);
      if (showInput && event.currentTarget.id !== cancelBtnId) {
         updateThreshold(threshold);
      }
   }

   const showLoading = userStatus.isLoading
      || locationStatus.isLoading
      || aqiStatus.isLoading;

   const showAlert = aqiValue > currentUser?.threshold;

   const padding = smQuery ? 24 : 16;
   const toolbarHeight = smQuery ? 64 : 56;
   
   return (
      <>
         <Head>
            <title>Aeolian | Air Quality Monitor</title>
            <meta name="description" content="Aeolian home page" />
         </Head>

         <LoadingModal isLoading={showLoading} />

         <Modal
            open={showConsent}
            onClose={handleConsentEvent}
            aria-label="Consent for location data"
         >
            <Box sx={consentModalStyles}>
               <Typography id={consentLabelId} align="center">
                  Would you like to grant Aeolian access to your location?
               </Typography>
               <Container sx={{ display: 'flex', alignItems: 'end' }}>
                  <ButtonGroup
                     variant="outlined"
                     aria-labelledby={consentLabelId}
                  >
                     <Button
                        name="consent"
                        value
                        onClick={handleConsentEvent}
                     >
                        Yes
                     </Button>
                     <Button
                        name="consent"
                        onClick={handleConsentEvent}
                     >
                        No
                     </Button>
                  </ButtonGroup>
               </Container>
            </Box>
         </Modal>

         {showAlert && (
            <Alert
               severity="warning"
               variant="outlined"
               sx={{
                  position: 'absolute',
                  top: `${toolbarHeight + padding}px`,
                  right: `${padding}px`,
                  ml: `${padding}px`,
               }}
            >
               The air quality index currently
               exceeds your chosen alert threshold!
               <br/>
               {concern}: {description}
            </Alert>
         )}

         <Grid
            container
            aria-live="polite"
            aria-busy={showLoading}
            direction="column"
            alignItems="center"
            justifyContent="center"
            rowGap={3}
            sx={{
               minHeight: `calc(100vh - ${toolbarHeight}px)`,
               width: {
                  xs: 280,
                  sm: 550,
                  md: 700,
               },
               margin: 'auto',
            }}
         >
            <Grid item>
               <Typography variant="h6" component="div" align="center">
                  {cityName}
               </Typography>
               <Typography variant="body1" component="div" align="center">
                  {coordsString}
               </Typography>
            </Grid>
            <Grid item>
               <AQIGauge
                  value={aqiValue}
                  size={300}
                  thickness={7}
                  showAlert={showAlert}
                  restColor={
                     `action.${
                        themeMode === 'light' 
                        ? 'selected' 
                        : 'disabledBackground' 
                     }`
                  }
               />
            </Grid>
            <Grid item>
               <Tooltip describeChild title={description}>
                  <Typography variant="h4" component="div" align="center">
                     {concern}
                  </Typography>
               </Tooltip>
            </Grid>
            {!!currentUser && (
               <Grid
                  component="form"
                  item
                  container
                  alignItems="center"
                  justifyContent="center"
                  gap={2}
                  onSubmit={handleThresholdBtn}
               >
                  {showInput && (
                     <TextField
                        name="threshold"
                        type="number"
                        value={threshold}
                        onChange={handleThresholdInput}
                        label="Threshold"
                        variant="outlined"
                     />
                  )}
                  <ButtonGroup>
                     {showInput && (
                        <Button id={cancelBtnId} onClick={handleThresholdBtn}>
                           Cancel
                        </Button>
                     )}
                     <Button type="button" onClick={handleThresholdBtn}>
                        {showInput ? 'Submit' : 'Update Threshold'}
                     </Button>
                  </ButtonGroup>
               </Grid>
            )}
         </Grid>
      </>
   );
}
