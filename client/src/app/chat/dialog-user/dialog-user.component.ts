import { Component, OnInit, Inject, ViewChild, Optional,Input } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, Validators } from '@angular/forms';
import { DialogLoginComponent } from '../dialog-login/dialog-login.component';
import { User } from '../shared/model/user';

@Component({
  selector: 'tcc-dialog-user',
  templateUrl: './dialog-user.component.html',
  styleUrls: ['./dialog-user.component.css'],
})

export class DialogUserComponent {
  @Input() message : string;
  constructor(public dialogRef: MatDialogRef<DialogUserComponent>
  ) {}

  user = {
    "name": "",
    "email": "",
  }

  getInfo(data: any): void {
    console.log("inside dialog user component ")
    console.log(data);
    this.user.name = data.name;
    this.user.email = data.email;
  }

  printInfo(data):any {
    console.log("print info");
    console.log(data);
  }

  ngOnInit(): void {
  //  this.printInfo();
  }



}