import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { PowerPlant } from '../shared/interfaces/power-plant';
import {ApiService} from '../shared/services/api.service';
import {map, tap} from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public powerPlants: Observable<PowerPlant[]>;
  public activePp: number = null;
  constructor(
    private title: Title,
    private apiService: ApiService
  ) {
   title.setTitle('Power Plants & Households');
   this.powerPlants = this.apiService.fetchPowerPlants().pipe(
     map((r: PowerPlant[]) => r),
     tap((r: PowerPlant[]) => {
       console.log(r);
       // this.activePp = r[0].id;
     })
   );
  }
  ngOnInit(): void {

  }
}
