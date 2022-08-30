export interface User {
   userName: string;
   lat: number;
   long: number;
   threshold: number;
}

export const initialState: User = {
   userName: '',
   lat: 0,
   long: 0,
   threshold: 60,
}

export interface UserState {
   currentUser?: User;
   userToken: string;
   status: {
      isLoading: boolean;
      hasError: boolean;
   }
}

export interface UserStore extends UserState {
   actions: {
      setUser: (newUser: User) => void;
      setUserToken: (newToken: string) => void;
      startLoading: () => void;
      catchError: () => void;
      resetError: () => void;
      clearUser: () => void;
      /**
       * Pass userName to sign in.
       * Pass no arguments to get user data on subsequent pageloads.
       */
      triggerLogin: (userName?: string) => void;
      createNewUser: (newUser: User) => void;
      updateThreshold: (threshold: number) => void;
   };
}
