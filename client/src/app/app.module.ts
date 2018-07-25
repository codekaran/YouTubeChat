import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { DomSanitizer} from "@angular/platform-browser";
import { Pipe, PipeTransform } from '@angular/core';
import { LinkyModule } from 'angular-linky';
import { HttpClientModule } from '@angular/common/http';
import { NgxAutoScrollModule } from "ngx-auto-scroll";
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ChatModule } from './chat/chat.module';
import { SharedModule } from './shared/shared.module';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { WINDOW_PROVIDERS } from "./window.service";
import { ScrollEventModule } from 'ngx-scroll-event';
import linkifyStr from 'linkifyjs/string';
import { SocialLoginModule, AuthServiceConfig, GoogleLoginProvider } from "angular5-social-login";
import { Ng2EmojifyModule } from 'ng2-emojify';
import { EmojiModule } from 'angular-emoji/dist';
import { CUSTOM_ELEMENTS_SCHEMA} from "@angular/core";

export function getAuthServiceConfigs() {
  var PROVIDER_ID = '507083681558-9ohnhgcnnhojuj517ra72lu1u9qtosfk.apps.googleusercontent.com';
  let config = new AuthServiceConfig(
      [
        {
          id: GoogleLoginProvider.PROVIDER_ID,
	        provider: new GoogleLoginProvider(PROVIDER_ID)
        }
      ]);
  return config;
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ChatModule,
    SharedModule,
    HttpClientModule,
    FormsModule,
    NgxAutoScrollModule,
    ScrollEventModule,
    SocialLoginModule,
    EmojiModule,
    LinkyModule,
    Ng2EmojifyModule
  ],
  providers: [{
    provide: AuthServiceConfig,
    useFactory: getAuthServiceConfigs
  },
  {
    provide: MatDialogRef,
    useValue: {}
  },
  {
    provide: MAT_DIALOG_DATA,
    useValue: {}
  }
],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule { }
