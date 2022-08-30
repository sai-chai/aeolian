import create from 'zustand';
import { persist } from 'zustand/middleware';

import { LocationState, LocationStore } from 'types/Location';

const initialState: LocationState = {
   coords: null,
   status: {
      isLoading: false,
      hasError: false,
   },
   timer: null,
   consent: null,
};

// 10 minute interval
const GET_LOCATION_INTERVAL = 600000;

const useLocation = create<LocationStore>()(
   persist(
      (set, get) => ({
         ...initialState,
         actions: {
            startLoading: () => set({
               status: {
                  isLoading: true,
                  hasError: false,
               },
            }),
            catchError: () => set({
               status: {
                  isLoading: false,
                  hasError: true,
               },
            }),
            setConsent: (consent) => set({
               consent,
            }),
            resetError: () => set((state) => ({
               status: {
                  ...state.status,
                  hasError: false,
               },
            })),
            getLocation: (userDispatch?) => {
               get().actions.startLoading();

               navigator.geolocation.getCurrentPosition(
                  function success (position) {
                     set((state) => ({
                        coords:{
                           lat: position.coords.latitude,
                           long: position.coords.longitude,
                        },
                        status: {
                           ...state.status,
                           isLoading: false,
                        },
                     }));

                     if (userDispatch) {
                        userDispatch((prevState) => ({
                           ...prevState,
                           lat: position.coords.latitude,
                           long: position.coords.longitude,
                        }));
                     } else if (!get().timer) {
                        const timer = setInterval(
                           () => get().actions.getLocation(),
                           GET_LOCATION_INTERVAL,
                        );
                        set({ timer });
                     }
                  },
                  function error () {
                     get().actions.catchError();
                  }
               );
            },
         },
      }),
         // persist options
      {
         name: 'aeolian-location',
         partialize: (state) => ({
            consent: state.consent,
         }),
      },
   )
);

export default useLocation;
