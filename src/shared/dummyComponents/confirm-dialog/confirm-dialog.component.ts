import {Component, Inject, OnInit, ViewEncapsulation} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {DialogData} from "../../interfaces/dialog-data";

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ConfirmDialogComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) { }

  ngOnInit(): void {
    console.log(this.data)
  }
  public onClick(answer: boolean): void {
    this.dialogRef.close(answer);
  }
  public craftPhrase(): string {
    let result = 'A you sure want to';
    switch (this.data.dialogType) {
      case ('deactivate'):
        result += ' deactivate';
        switch (this.data.subject) {
          case ('pp'):
            result += ' Power Plant?';
        }
        break;
      case ('activate'):
        result += ' activate';
        switch (this.data.subject) {
          case ('pp'):
            result += ' Power Plant?';
        }
        break;
    }
    return result
  }
}
