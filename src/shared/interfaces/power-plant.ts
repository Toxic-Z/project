import {HouserHold} from "./houser-hold";

export interface PowerPlant {
  ppName: string;
  id: number;
  isActive: boolean;
  connectedHH: HouserHold[];
}
