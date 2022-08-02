import { useState, useEffect, useCallback } from 'react';
import useLocalStorage from './useLocalStorage';
import useSWR from 'swr';

const useUser = () => {
   const [user, setUser] = useState(null);
   const [isLoading, setIsLoading] = useState(true);
   const [hasError, setHasError] = useState(false);
   const [localStorage] = useLocalStorage(['userToken']);
   const searchParams = localStorage.userToken
      ? new URLSearchParams({ u: localStorage.userToken })
      : '';

   const { data, error } = useSWR(`/api/user?${searchParams.toString()}`, url =>
      fetch(url).then(res => res.json()),
   );

   useEffect(() => {
      setIsLoading(!error && !data);

      if (error) {
         setHasError(true);
      }

      if (data && data.success) {
         setUser(data.payload);
      }

      return () => {
         setIsLoading(true);
         setUser(null);
         setHasError(false);
      };
   }, [data, error, localStorage]);

   return [user, isLoading, hasError];
};

export default useUser;
