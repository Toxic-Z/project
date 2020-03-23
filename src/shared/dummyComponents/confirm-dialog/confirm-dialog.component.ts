import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { DialogData } from "../../interfaces/dialog-data";

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
  }
  public onClick(answer: boolean): void {
    if (this.data.dialogType === 'create') {
      let data = {
        name: this.name,
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
            result+= ' Power Plant\'s name there:';
            break;
        }

    }
    return result
  }
}
