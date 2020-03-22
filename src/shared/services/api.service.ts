import { Injectable } from '@angular/core';
import {Observable, of} from "rxjs";
import {PowerPlant} from "../interfaces/power-plant";
import {HouserHold} from "../interfaces/houser-hold";

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private ppArray: PowerPlant[] = [
      {
        id: Math.random(),
        isActive: true,
        ppName: 'first',
        connectedHH: [
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
        ]
      }
    ];
  private hhArray: HouserHold[] = [
    {
      id: Math.random(),
      hhName: 'first',
      connectedPP: [
      ]
    },
    {
      id: Math.random(),
      hhName: 'second',
      connectedPP: [
      ]
    },
    {
      id: Math.random(),
      hhName: 'third',
      connectedPP: [
      ]
    }
  ];
  constructor() { }
  public updatePowerPlant(state, id: string): Observable<any> {
    return of()
  }
  public fetchHouseholds(): Observable<HouserHold[]> {
    return of(
      this.hhArray
    )
  }
  public fetchPowerPlants(): Observable<PowerPlant[]> {
    return of(
      this.ppArray
    )
  }
}
