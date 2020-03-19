import { Injectable } from '@angular/core';
import {Observable, of} from "rxjs";
import {PowerPlant} from "../interfaces/power-plant";

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor() { }
  public updatePowerPlant(pp: PowerPlant): Observable<any> {
    return of()
  }
  public fetchPowerPlants(): Observable<PowerPlant[]> {
    return of(
      [
        {
          id: Math.random(),
          isActive: true,
          ppName: 'first',
          connectedHH: [
            {
              name: 'household 1'
            },
            {
              name: 'household 2'
            },
            {
              name: 'household 3'
            }
          ]
        },
        {
          id: Math.random(),
          isActive: false,
          ppName: 'second',
          connectedHH: [
          ]
        },
        {
          id: Math.random(),
          isActive: true,
          ppName: 'third',
          connectedHH: [
            {
              name: 'household 3'
            }
          ]
        }
      ]
    )
  }
}
