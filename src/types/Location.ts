import {
   Dispatch,
   SetStateAction,
} from "react";

import { User } from "types/User";

export interface Location {
   lat: number;
   long: number;
}

export interface LocationState {
   coords: Location | null;
   status: {
      isLoading: boolean;
      hasError: boolean;
   },
   timer: NodeJS.Timer | number | null;
   consent: boolean | null;
}

export interface LocationStore extends LocationState {
   actions: {
      startLoading: () => void;
      catchError: () => void
      setConsent: (consent: boolean) => void;
      resetError: () => void;
      /**
       * Pass React.useState setter function to update user data.
       * Pass no arguments to update location every ten-minutes. 
       */
      getLocation: (userDispatch?: Dispatch<SetStateAction<User>>) => void;
   }
}