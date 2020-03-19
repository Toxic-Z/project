import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {Observable} from 'rxjs';
import {PowerPlant} from '../shared/interfaces/power-plant';
import {ApiService} from '../shared/services/api.service';
import {map, tap} from 'rxjs/operators';
import {HouserHold} from "../shared/interfaces/houser-hold";
import {MatDialog} from "@angular/material/dialog";
import {ConfirmDialogComponent} from "../shared/dummyComponents/confirm-dialog/confirm-dialog.component";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [ ConfirmDialogComponent ]
})
export class AppComponent implements OnInit {
  public powerPlants: Observable<PowerPlant[]>;
  public activePp: number = null;
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
  }
  ngOnInit(): void {

  }
  public openDialog(hh: HouserHold[], type: string, pp): void {
    const dialogRef = this.confirmDialog.open(ConfirmDialogComponent, {
      width: '250px',
      data: {
        dialogType: type,
        subject: 'hh',
        hHList: this.craftHHList(hh)
      }
    });
    console.log(dialogRef)

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.apiService.updatePowerPlant(pp)
      }
    });
  }
  public craftHHList (hh: HouserHold[]) {
    if (hh.length) {
      let res = '';
      hh.forEach((h: HouserHold) => {
        res += h.name + ', '
      });
      return res;
    } else return '';
  }
}
