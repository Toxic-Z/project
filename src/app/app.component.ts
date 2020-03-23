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
  public hhList: { name: string, id: number}[] = [];
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
     map((r: PowerPlant[]) => r)
   );
   this.households = this.apiService.fetchHouseholds().pipe(
     map((hh: HouserHold[]) => hh),
     tap((hh: HouserHold[]) => {
       hh.forEach((h: HouserHold) => {
         this.hhList.push({
           name: h.hhName,
           id: h.id
         });
       });
     })
   )
  }
  ngOnInit(): void {
  }
  public selected(event: MatAutocompleteSelectedEvent, pp: PowerPlant): void {
    this.apiService.connectHhToPP(event.option.value.id, pp.id);
    this.hhInput.nativeElement.value = '';
    this.formControl.setValue(null);
  }
  public add(event: MatChipInputEvent): void {
    if (event.input) {
      event.input.value = '';
    }
    this.formControl.setValue(null);
  }
  public filterHh(connectedHh: HouserHold[]): { name: string, id: number}[] {
    const connectedHhIds: number[] = [];
    connectedHh.forEach((h: HouserHold) => {
      connectedHhIds.push(h.id);
    });
    const resultArr:  { name: string, id: number}[] = [];
    this.hhList.forEach((h:  { name: string, id: number}) => {
      if (!connectedHhIds.includes(h.id)) {
        resultArr.push(h);
      }
    });
    return resultArr;
  }
  public openDialog(hh: HouserHold[] = [], type: string, pp, subject: string): void {
    const dialogRef = this.confirmDialog.open(ConfirmDialogComponent, {
      width: '400px',
      height: 'auto',
      data: {
        dialogType: type,
        subject: subject,
        hHList: this.craftHHList(hh)
      }
    });
    switch (type) {
      case ('activate'||'deactivate'):
        dialogRef.afterClosed().subscribe((state: boolean) => {
          this.apiService.updatePowerPlant(state, pp.id);
        });
        break;
      case ('create'):
        switch (subject) {
          case ('hh'):
            dialogRef.afterClosed().subscribe((res: {name: string, result: boolean}) => {
              if (res) {
                this.apiService.addHh(res);
                this.households = this.apiService.fetchHouseholds();
              }
            });
            break;
          case ('pp'):
            dialogRef.afterClosed().subscribe((res: {name: string, result: boolean}) => {
              if (res) {
                this.apiService.addPP(res);
              }
            });
            break;
        }
    }
  }
  public remove(hhId, ppId) {
    this.apiService.removeHhFromPp(hhId, ppId);
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
