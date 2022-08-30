import { Location } from "types/Location";

export interface AQIData {
   aqi: number;
   cityName: string;
   concern: string;
   description: string;
}

export interface AQIState extends AQIData {
   status: {
      isLoading: boolean;
      hasError: boolean;
   }
}

export interface AQIStore extends AQIState {
   actions: {
      startLoading: () => void;
      setData: (updatedData: Partial<AQIData>) => void;
      catchError: () => void;
      getAQI: (coords: Location) => void;
   }
}
