import {Component, ElementRef, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {Observable} from 'rxjs';
import {PowerPlant} from '../shared/interfaces/power-plant';
import {ApiService} from '../shared/services/api.service';
import {map, tap} from 'rxjs/operators';
import {HouserHold} from "../shared/interfaces/houser-hold";
import {MatDialog} from "@angular/material/dialog";
import {ConfirmDialogComponent} from "../shared/dummyComponents/confirm-dialog/confirm-dialog.component";
import {FormControl} from "@angular/forms";
import {COMMA, ENTER} from "@angular/cdk/keycodes";
import {MatAutocomplete} from "@angular/material/autocomplete";

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
  public displayedColumns: string[] = ['1', '2', '3'];
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
     map((r: PowerPlant[]) => r),
     tap((r: PowerPlant[]) => {
       console.log(r, 'rqrq');
       // this.activePp = r[0].id;
     })
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
       console.log(this.hhList)
     })
   )
  }
  ngOnInit(): void {

  }
  public openDialog(hh: HouserHold[] = [], type: string, pp): void {
    const dialogRef = this.confirmDialog.open(ConfirmDialogComponent, {
      width: '400px',
      height: 'auto',
      data: {
        dialogType: type,
        subject: 'pp',
        hHList: this.craftHHList(hh)
      }
    });
    dialogRef.afterClosed().subscribe((state: boolean) => {
      this.apiService.updatePowerPlant(state, pp.id);
    });
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
