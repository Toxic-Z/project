import {PowerPlant} from "./power-plant";

export interface HouserHold {
  hhName: string;
  id: number;
  connectedPP: PowerPlant[];
  connectedHH: HouserHold[];
}
