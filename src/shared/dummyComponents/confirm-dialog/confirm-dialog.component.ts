import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { DialogData } from "../../interfaces/dialog-data";
import { HouserHold } from "../../interfaces/houser-hold";

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ConfirmDialogComponent implements OnInit {
  public name: string = '';
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) { }

  ngOnInit(): void {
    if (this.data.hhArr) {
      this.data.hhArr = this.data.hhArr.filter((hh: HouserHold) => !this.data.hh.connectedHH.includes(hh))
        .filter((hh: HouserHold) => hh.id !== this.data.hh.id);
    }
  }
  public onClick(answer: boolean, hh: HouserHold = null): void {
    if (this.data.dialogType === 'create') {
      let data = {
        name: this.name,
        result: answer
      };
      this.dialogRef.close(data);
      return;
    }
    if (this.data.dialogType === 'connect') {
      let data = {
        hhForConnect: hh,
        result: answer
      };
      this.dialogRef.close(data);
      return;
    }
    this.dialogRef.close(answer);
  }
  public craftPhrase(): string {
    let result = '';
    switch (this.data.dialogType) {
      case ('deactivate'):
        switch (this.data.subject) {
          case ('pp'):
            result += 'A you sure want to deactivate Power Plant?';
            break;
          case ('ppfromhh'):
            result += 'Are you sure want to disconnect this Power Plant?';
            break;
        }
        break;
      case ('activate'):
        result += 'A you sure want to activate';
        switch (this.data.subject) {
          case ('pp'):
            result += ' Power Plant?';
        }
        break;
      case ('create'):
        result += 'Input';
        switch (this.data.subject) {
          case ('hh'):
            result += ' household\'s name there:';
            break;
          case ('pp'):
            result += ' Power Plant\'s name there:';
            break;
        }
      case ('connect'):
        switch (this.data.subject) {
          case ('hhtohh'):
            result += 'Choose household you want to connect there';
            break;
        }
      case ('disconnect'):
        switch (this.data.subject) {
          case ('hhfromhh'):
            result += 'Do you really want to disconnect household from existing?'
            break;
        }
    }
    return result
  }
}
