import { Component, ViewChild, OnInit, Input } from '@angular/core';
import { AppService } from './app.service';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { ChatComponent } from './chat/chat.component';


@Component({
  selector: 'tcc-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
 
  // @Input() kuchv: string;
  // message:string="ahsdbfasrhbfa";
  constructor() { }
  @ViewChild(ChatComponent) chat;

  // showMessage: string = "test";


//   public getInfo(message: string) {
//     console.log("inside app component ")
//     this.showMessage = message;
//     console.log('message: ' + message);
// }
  ngOnInit() {
    // this.userImage = this.chat
  }


 }
