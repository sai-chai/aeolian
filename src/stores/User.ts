import create from 'zustand';
import { persist } from 'zustand/middleware';

import { UserState, UserStore } from 'types/User';

const initialState: UserState = {
   currentUser: null,
   userToken: '',
   status: {
      isLoading: false,
      hasError: false,
   },
};

const useUser = create<UserStore>()(
   persist(
      (set, get) => ({
         ...initialState,
         actions: {
            setUser: (newUser) =>
               set({
                  currentUser: newUser,
                  status: {
                     isLoading: false,
                     hasError: false,
                  },
               }),
            setUserToken: (newToken) =>
               set({
                  userToken: newToken,
               }),
            startLoading: () =>
               set({
                  status: {
                     isLoading: true,
                     hasError: false,
                  },
               }),
            catchError: () =>
               set({
                  status: {
                     isLoading: false,
                     hasError: true,
                  },
               }),
            resetError: () => 
               set((state) => ({
                  status: {
                     ...state.status,
                     hasError: false,
                  },
               })),
            clearUser: () =>
               set({
                  ...initialState,
               }),
            triggerLogin: async (userName?) => {
               try {
                  let loginRes: Response, userToken: string;

                  get().actions.startLoading();

                  if (userName) {
                     loginRes = await fetch(
                        `/api/login?u=${encodeURIComponent(userName)}`
                     );

                     if (!loginRes.ok) {
                        throw new Error(loginRes.statusText);
                     }

                     ({ payload: userToken } = await loginRes.json());
                  } else {
                     userToken = get().userToken;
                  }
                  
                  const userRes = await fetch(
                     `/api/user?u=${encodeURIComponent(userToken || '')}`,
                  );

                  if (userRes.ok) {
                     const { payload: userResult } =
                        await userRes.json();
                     
                     get().actions.setUserToken(userToken);
                     get().actions.setUser(userResult);
                  } else {
                     get().actions.setUserToken(userToken);
                     throw new Error(userRes.statusText);
                  }
               } catch (error) {
                  get().actions.catchError();
               }
            },
            createNewUser: async (newUser) => {
               try {
                  get().actions.startLoading();

                  const response = await fetch(`/api/user`, {
                     method: 'POST',
                     body: JSON.stringify(newUser),
                  });
      
                  if (response.ok) {
                     const {
                        payload: { userToken, user: userResult },
                     } = await response.json();
                     
                     get().actions.setUserToken(userToken);
                     get().actions.setUser(userResult);
                  } else {
                     throw new Error(response.statusText);
                  }
               } catch (error) {
                  get().actions.catchError();
               }
            },
            updateThreshold: async (threshold) => {
               try {
                  get().actions.startLoading();

                  const response = await fetch(
                     `/api/user?u=${encodeURIComponent(get().userToken)}`,
                     {
                        method: 'PUT',
                        body: JSON.stringify({ threshold }),
                     },
                  );

                  if (response.ok) {
                     const {
                        payload: updatedUser,
                     } = await response.json();

                     get().actions.setUser(updatedUser);
                  } else {
                     throw new Error(response.statusText);
                  }
               } catch (error) {
                  get().actions.catchError();
               }
            },
         },
      }),
         // Persist options
      {
         name: 'aeolian-user',
         partialize: (state) => ({
            userToken: state.userToken,
         }),
      },
   ),
);

export default useUser;
