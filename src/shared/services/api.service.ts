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
  public updatePowerPlant(state, id: number): Observable<boolean> {
    if (state) {
      const index: number = this.ppArray.findIndex((pp: PowerPlant) => pp.id === id);
      this.ppArray[index].isActive = !this.ppArray[index].isActive;
    }
    return of(this.ppArray[this.ppArray.findIndex((pp: PowerPlant) => pp.id === id)].isActive)
  }
  public removeHhFromPp(hhId, ppId): Observable<any> {
    let pIndex: number = this.ppArray.findIndex((pp: PowerPlant) => pp.id === ppId);
    let hIndex: number = this.ppArray[pIndex].connectedHH.findIndex((hh: HouserHold) => {
      hh.id === hhId;
    });
    this.ppArray[pIndex].connectedHH.slice(hIndex, 1);
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
