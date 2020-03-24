import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { PowerPlant } from '../shared/interfaces/power-plant';
import { ApiService } from '../shared/services/api.service';
import { map, tap } from 'rxjs/operators';
import { HouserHold } from "../shared/interfaces/houser-hold";
import { MatDialog } from "@angular/material/dialog";
import { ConfirmDialogComponent } from "../shared/dummyComponents/confirm-dialog/confirm-dialog.component";
import { FormControl } from "@angular/forms";
import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { MatAutocomplete, MatAutocompleteSelectedEvent } from "@angular/material/autocomplete";
import { MatChipInputEvent } from "@angular/material/chips";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [ ConfirmDialogComponent ]
})
export class AppComponent implements OnInit {
  public powerPlants: Observable<PowerPlant[]>;
  public households: Observable<HouserHold[]>;
  public activePp: number = null;
  public separatorKeysCodes: number[] = [ENTER, COMMA];
  public removable = true;
  public selectable: boolean = true;
  public displayedColumns: string[] = ['name', 'connectedPPList', 'connectedHhList'];
  public hhList: HouserHold[] = [];
  public ppList: PowerPlant[] = [];
  formControl = new FormControl();
  @ViewChild('hhInput') hhInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;
  constructor(
    private title: Title,
    private apiService: ApiService,
    public confirmDialog: MatDialog
  ) {
   title.setTitle('Power Plants & Households');
   this.powerPlants = this.apiService.fetchPowerPlants().pipe(
     map((r: PowerPlant[]) => r),
     tap((pp: PowerPlant[]) => {
       this.ppList = pp;
     })
   );
   this.households = this.apiService.fetchHouseholds().pipe(
     map((hh: HouserHold[]) => hh),
     tap((hh: HouserHold[]) => {
       this.hhList = hh;
     })
   )
  }
  ngOnInit(): void {
  }
  public selected(event: MatAutocompleteSelectedEvent, pp: PowerPlant): void {
    this.apiService.connectHhToPP(event.option.value.id, pp.id).subscribe(() => {
      this.hhInput.nativeElement.value = '';
      this.formControl.setValue(null);
    });
  }
  public add(event: MatChipInputEvent): void {
    if (event.input) {
      event.input.value = '';
    }
    this.formControl.setValue(null);
  }
  public filterHh(connectedHh: HouserHold[]): HouserHold[] {
    const connectedHhIds: number[] = [];
    connectedHh.forEach((h: HouserHold) => {
      connectedHhIds.push(h.id);
    });
    const resultArr:  HouserHold[] = [];
    this.hhList.forEach((h:  HouserHold) => {
      if (!connectedHhIds.includes(h.id)) {
        resultArr.push(h);
      }
    });
    return resultArr;
  }
  public openDialog(hhArr: HouserHold[] = [], type: string, pp: PowerPlant = null, subject: string, hh: HouserHold = null, disconnectingHh: HouserHold = null): void {
    const dialogRef = this.confirmDialog.open(ConfirmDialogComponent, {
      width: 'auto',
      height: 'auto',
      data: {
        dialogType: type,
        subject: subject,
        hHList: this.craftHHList(hhArr),
        hhArr: this.hhList,
        hh: hh,
        ppArray: this.ppList,
        disconnectingHh: disconnectingHh
      }
    });
    switch (type) {
      case ('deactivate'):
      case ('activate'):
        switch (subject) {
          case ('ppfromhh'):
            dialogRef.afterClosed().subscribe((state: boolean) => {
              if (state) {
                this.apiService.removePPFromHh(hh, pp);
              }
            });
            break;
          case ('pp'):
            dialogRef.afterClosed().subscribe((state: boolean) => {
              this.apiService.updatePowerPlant(state, pp);
            });
        }
        break;
      case ('create'):
        switch (subject) {
          case ('hh'):
            dialogRef.afterClosed().subscribe((res: {name: string, result: boolean}) => {
              if (res.result) {
                this.apiService.addHh(res).subscribe((hh: HouserHold) => {
                  if (!this.hhList.includes(hh)) {
                    this.hhList.push(hh);
                  }
                });
                this.households = this.apiService.fetchHouseholds();
              }
            });
            break;
          case ('pp'):
            dialogRef.afterClosed().subscribe((res: {name: string, result: boolean}) => {
              if (res.result) {
                this.apiService.addPP(res).subscribe((pp: PowerPlant) => {
                  if (!this.ppList.includes(pp)) {
                    this.ppList.push(pp);
                  }
                });
              }
            });
            break;
        }
      case ('connect'):
        switch (subject) {
          case ('hhtohh'):
            dialogRef.afterClosed().subscribe((res: {hhForConnect: HouserHold, result: boolean}) => {
              if (res.result) {
                this.apiService.connectHhToHh(hh, res.hhForConnect);
              }
            });
        }
        break;
      case ('disconnect'):
        switch (subject) {
          case ('hhfromhh'):
            dialogRef.afterClosed().subscribe((res: boolean) => {
              if (res) {
                this.apiService.removeHhFromHh(hh, disconnectingHh);
              }
            });
            break;
        }
    }
  }
  public remove(hh: HouserHold, pp: PowerPlant) {
    this.apiService.removeHhFromPp(hh, pp);
  }
  public checkActivePP(hh: HouserHold): boolean {
    let res = false;
    hh.connectedHH.forEach((hh: HouserHold) => {
      hh.connectedPP.forEach((pp: PowerPlant) => {
        if (pp.isActive) {
          res = true;
        }
      });
      hh.connectedHH.forEach((hh: HouserHold) => {
        hh.connectedPP.forEach((pp: PowerPlant) => {
          if (pp.isActive) {
            res = true;
          }
        });
      });
    });
    hh.connectedPP.forEach((pp: PowerPlant) => {
      if (pp.isActive) {
        res = true;
      }
    });
    return res;
  }
  public craftHHList(hh: HouserHold[]): string[] {
    if (hh.length) {
      let res: string[] = [];
      hh.forEach((h: HouserHold) => {
        res.push(h.hhName);
      });
      return res;
    } else return [];
  }
}
