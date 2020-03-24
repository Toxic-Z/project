import { Injectable } from '@angular/core';
import { Observable, of } from "rxjs";
import { PowerPlant } from "../interfaces/power-plant";
import { HouserHold } from "../interfaces/houser-hold";

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
      connectedPP: [],
      connectedHH: []
    },
    {
      id: Math.random(),
      hhName: 'second',
      connectedPP: [],
      connectedHH: []
    },
    {
      id: Math.random(),
      hhName: 'third',
      connectedPP: [],
      connectedHH: []
    }
  ];
  constructor() { }
  //Household's CRUD:
  public fetchHouseholds(): Observable<HouserHold[]> {
    return of(
      this.hhArray
    )
  }
  public addHh(data: {name: string, result: boolean}): Observable<HouserHold> {
    if (data.result) {
      this.hhArray.push(
        {
          id: Math.random(),
          hhName: data.name ? data.name : 'Household ' + (this.hhArray.length + 1),
          connectedPP: [],
          connectedHH: []
        }
      );
      this.hhArray = [...this.hhArray];
    }
    return of(this.hhArray[this.hhArray.length - 1]);
  }
  public connectHhToHh(sourceHh: HouserHold, addHh: HouserHold) :Observable<any> {
    this.hhArray[this.hhArray.indexOf(sourceHh)].connectedHH.push(addHh);
    this.hhArray[this.hhArray.indexOf(addHh)].connectedHH.push(sourceHh);
    return of()
  }
  public removeHhFromHh(sourceHh: HouserHold, removeHh: HouserHold): Observable<any> {
    let sourceIndex: number = this.hhArray.indexOf(sourceHh);
    let removeIndex: number =this.hhArray.indexOf(removeHh);
    let addSourceIndex: number = this.hhArray[sourceIndex].connectedHH.indexOf(removeHh);
    let addRemoveIndex: number = this.hhArray[removeIndex].connectedHH.indexOf(sourceHh);
    this.hhArray[sourceIndex].connectedHH.splice(addSourceIndex, 1);
    this.hhArray[removeIndex].connectedHH.splice(addRemoveIndex, 1);
    return of()
  }
  //PowerPlant's CRUD:
  public fetchPowerPlants(): Observable<PowerPlant[]> {
    return of(
      this.ppArray
    )
  }
  public removePPFromHh(hh: HouserHold, pp: PowerPlant): Observable<any> {
    let ppIndex: number = this.hhArray[this.hhArray.indexOf(hh)].connectedPP.indexOf(pp);
    this.hhArray[this.hhArray.indexOf(hh)].connectedPP.splice(ppIndex, 1);
    this.hhArray = [...this.hhArray];
    let additionalIndex: number = this.ppArray[this.ppArray.indexOf(pp)].connectedHH.indexOf(hh);
    this.ppArray[this.ppArray.indexOf(pp)].connectedHH.splice(additionalIndex, 1);
    return of()
  }
  public updatePowerPlant(state, PP: PowerPlant): Observable<boolean> {
    if (state) {
      const index: number = this.ppArray.indexOf(PP);
      this.ppArray[index].isActive = !this.ppArray[index].isActive;
    }
    return of(this.ppArray[this.ppArray.findIndex((pp: PowerPlant) => pp.id === PP.id)].isActive)
  }
  public addPP(data: {name: string, result: boolean}): Observable<PowerPlant> {
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
    return of(this.ppArray[this.ppArray.length - 1]);
  }
  //Marshmallow
  public removeHhFromPp(hh: HouserHold, pp: PowerPlant): Observable<any> {
    let pIndex: number = this.ppArray.indexOf(pp);
    let hIndex: number = this.ppArray[pIndex].connectedHH.indexOf(hh);
    this.ppArray[pIndex].connectedHH.splice(hIndex, 1);
    this.ppArray = [...this.ppArray];
    let additionalIndex: number = this.hhArray[this.hhArray.indexOf(hh)].connectedPP.indexOf(pp);
    this.hhArray[hIndex].connectedPP.splice(additionalIndex, 1);
    this.hhArray = [...this.hhArray];
    return of()
  }
  public connectHhToPP (hhId: number, ppId: number) {
    let hIndex: number = this.hhArray.findIndex((hh: HouserHold) => hh.id === hhId);
    let pIndex: number = this.ppArray.findIndex((pp: PowerPlant) => pp.id === ppId);
    this.ppArray[pIndex].connectedHH.push(this.hhArray[hIndex]);
    this.hhArray[hIndex].connectedPP.push(this.ppArray[pIndex]);
    return of()
  }
}
