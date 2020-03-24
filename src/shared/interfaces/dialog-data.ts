import { HouserHold } from "./houser-hold";
import { PowerPlant } from "./power-plant";

export interface DialogData {
  subject: string;
  dialogType: string;
  hHList?: string[];
  answer?: boolean;
  hhArr?: HouserHold[];
  hh?: HouserHold;
  ppArray?: PowerPlant[];
  disconnectingHh?: HouserHold;
}
