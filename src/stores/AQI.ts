import create from 'zustand';

import { AQIData, AQIState, AQIStore } from 'types/AQI';

const initialState: AQIState = {
   aqi: 0,
   cityName: '',
   concern: '',
   description: '',
   status: {
      isLoading: false,
      hasError: false,
   },
};

const getLevel = (aqiValue: number): Partial<AQIData> => {
   if (aqiValue < 0) {
      throw new Error();
   }

   if (aqiValue <= 50) {
      return {
         concern: 'Good',
         description: "Air quality is satisfactory, and air pollution poses \
            little or no risk.",
      };
   } else if (aqiValue <= 100) {
      return {
         concern: 'Moderate',
         description: "Air quality is acceptable. However, there may be a risk \
            for some people, particularly those who are unusually sensitive to \
            air pollution.",
      };
   } else if (aqiValue <= 150) {
      return {
         concern: 'Unhealthy for Sensitive Groups',
         description: "Members of sensitive groups may experience health \
            effects. The general public is less likely to be affected.",
      };
   } else if (aqiValue <= 200) {
      return {
         concern: 'Unhealthy',
         description: "Some members of the general public may experience \
            health effects; members of sensitive groups may experience more \
            serious health effects.",
      };
   } else if (aqiValue <= 300) {
      return {
         concern: 'Very Unhealthy',
         description: "Health alert: The risk of health effects is increased \
            for everyone.",
      };
   } else if (aqiValue > 300) {
      return {
         concern: 'Hazardous',
         description: "Health warning of emergency conditions: everyone is \
            more likely to be affected.",
      };
   }
}

const useAQI = create<AQIStore>()(
   (set, get) => ({
      ...initialState,
      actions: {
         startLoading: () => set({
            status: {
               isLoading: true,
               hasError: false,
            },
         }),
         setData: (updatedData) => set({
            ...updatedData,
            status: {
               isLoading: false,
               hasError: false,
            },
         }),
         catchError: () => set({
            status: {
               isLoading: false,
               hasError: true,
            },
         }),
         getAQI: async (coords) => {
            try {
               get().actions.startLoading();
   
               const params = new URLSearchParams(Object.entries(coords));

               const res = await fetch(`/api/aqi?${params.toString()}`);
               
               if (res.ok) {
                  const { payload: aqiData } = await res.json();
   
                  get().actions.setData({
                     ...aqiData,
                     ...getLevel(aqiData.aqi),
                  });
               } else {
                  throw new Error(res.statusText);
               }
            } catch (error) {
               get().actions.catchError();
            }
         },
      },
   })
);

export default useAQI;
