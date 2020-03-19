import {Component, Inject, OnInit} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from "@angular/material/dialog";
import {DialogData} from "../../interfaces/dialog-data";

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent implements OnInit {
  @Inject(MAT_DIALOG_DATA) public data: DialogData;
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>
  ) { }

  ngOnInit(): void {
    console.log(this.data)
  }
  public onClick(answer): void {
    this.dialogRef.close(answer);
  }
}
