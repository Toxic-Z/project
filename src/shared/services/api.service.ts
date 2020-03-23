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
  //Household's CRUD:
  public fetchHouseholds(): Observable<HouserHold[]> {
    return of(
      this.hhArray
    )
  }
  public removeHhFromPp(hhId, ppId): Observable<any> {
    let pIndex: number = this.ppArray.findIndex((pp: PowerPlant) => pp.id === ppId);
    let hIndex: number = this.ppArray[pIndex].connectedHH.findIndex((hh: HouserHold) => hh.id === hhId);
    this.ppArray[pIndex].connectedHH.splice(hIndex, 1);
    this.ppArray = [...this.ppArray];
    let additionalIndex: number = this.hhArray[this.hhArray.indexOf(this.ppArray[pIndex].connectedHH[hIndex])]
      .connectedPP.findIndex((pp: PowerPlant) => pp.id === ppId);
    this.hhArray[hIndex].connectedPP.splice(additionalIndex, 1);
    this.hhArray = [...this.hhArray]
    return of()
  }
  public connectHhToPP (hhId: number, ppId: number) {
    let hIndex: number = this.hhArray.findIndex((hh: HouserHold) => hh.id === hhId);
    let pIndex: number = this.ppArray.findIndex((pp: PowerPlant) => pp.id === ppId);
    this.ppArray[pIndex].connectedHH.push(this.hhArray[hIndex]);
    this.hhArray[hIndex].connectedPP.push(this.ppArray[pIndex])
    return of()
  }
  public addHh(data: {name: string, result: boolean}): Observable<any> {
    console.log(data)
    if (data.result) {
      this.hhArray.push(
        {
          id: Math.random(),
          hhName: data.name ? data.name : 'Household ' + (this.hhArray.length + 1),
          connectedPP: [],
        }
      );
      this.hhArray = [...this.hhArray];
    }
    return of()
  }
  //PowerPlant's CRUD:
  public fetchPowerPlants(): Observable<PowerPlant[]> {
    return of(
      this.ppArray
    )
  }
  public updatePowerPlant(state, id: number): Observable<boolean> {
    if (state) {
      const index: number = this.ppArray.findIndex((pp: PowerPlant) => pp.id === id);
      this.ppArray[index].isActive = !this.ppArray[index].isActive;
    }
    return of(this.ppArray[this.ppArray.findIndex((pp: PowerPlant) => pp.id === id)].isActive)
  }
  public addPP(data: {name: string, result: boolean}): Observable<any> {
    if (data.result) {
      this.ppArray.push(
        {
          ppName: data.name ? data.name : 'Power Plant ' + (this.ppArray.length + 1),
          id: Math.random(),
          connectedHH: [],
          isActive: true
        }
      );
    }
    return of()
  }
}
