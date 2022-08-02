import { useState, useRef, useEffect, useCallback } from 'react';

/**
 *
 * @param {string[]} keys
 * @return {Object}
 */
const useLocalStorage = () => {
   const [localState, setLocalState] = useState({});
   const keys = useRef(['userToken']);

   useEffect(() => {
      keys.current.forEach(key =>
         setLocalState(prevState => ({
            ...prevState,
            [key]: localStorage.getItem(key),
         })),
      );
   }, [keys]);

   const storageHandler = useCallback(
      event => {
         if (
            event.storageArea === localStorage &&
            keys.current.includes(event.key)
         ) {
            setLocalState(prevState => ({
               ...prevState,
               [event.key]: event.newValue,
            }));
         }
      },
      [keys],
   );

   const setLocalStorage = (key, value) => {
      localStorage.setItem(key, value);
   };

   useEffect(() => {
      addEventListener('storage', storageHandler);
   }, [storageHandler]);

   return [localState, setLocalStorage];
};

export default useLocalStorage;
