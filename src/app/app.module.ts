import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {MatButtonModule} from '@angular/material/button';
import {MatListModule} from "@angular/material/list";
import {MatTooltipModule} from "@angular/material/tooltip";
import {ConfirmDialogComponent} from "../shared/dummyComponents/confirm-dialog/confirm-dialog.component";
import {MAT_DIALOG_DEFAULT_OPTIONS, MatDialogModule} from "@angular/material/dialog";
import {MatTableModule} from "@angular/material/table";

@NgModule({
  declarations: [
    AppComponent,
    ConfirmDialogComponent,

  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        NoopAnimationsModule,
        MatExpansionModule,
        MatFormFieldModule,
        MatIconModule,
        HttpClientModule,
        MatButtonModule,
        MatListModule,
        MatTooltipModule,
        MatDialogModule,
        MatTableModule
    ],
  providers: [{provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: {hasBackdrop: false}}],
  bootstrap: [AppComponent],
})
export class AppModule { }
