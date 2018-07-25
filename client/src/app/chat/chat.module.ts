import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DomSanitizer} from "@angular/platform-browser";
import { Pipe, PipeTransform } from '@angular/core';
import linkifyStr from 'linkifyjs/string';
import { HttpClientModule } from '@angular/common/http';
import { LinkyModule } from 'angular-linky';
import { MaterialModule } from '../shared/material/material.module';
import { ChatComponent } from './chat.component';
import { SocketService } from './shared/services/socket.service';
import { DialogLoginComponent } from './dialog-login/dialog-login.component';
import { DialogUserComponent } from './dialog-user/dialog-user.component';
import { AppService } from '../app.service';
import { Ng2EmojifyModule } from 'ng2-emojify';

@Pipe({ name: 'safe' })
export class SafePipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}
  transform(url) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    MaterialModule,
    LinkyModule,
    Ng2EmojifyModule
  ],
  declarations: [
    ChatComponent, 
    DialogLoginComponent, 
    DialogUserComponent, 
    SafePipe
  ],
  providers: [
    SocketService,
    AppService
  ],
  entryComponents: [ DialogLoginComponent ]
})
export class ChatModule { }
