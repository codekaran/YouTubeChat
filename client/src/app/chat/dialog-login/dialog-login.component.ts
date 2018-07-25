import { Component, OnInit, Inject, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, Validators } from '@angular/forms';
import { AuthService, GoogleLoginProvider } from 'angular5-social-login';

@Component({
  selector: 'tcc-dialog-login',
  templateUrl: './dialog-login.component.html',
  styleUrls: ['./dialog-login.component.css'],
})

export class DialogLoginComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<DialogLoginComponent>,
    public socialAuthService: AuthService,
  ) {}

  ngOnInit() {
  }

  userInfo = {};

  public socialSignIn(socialPlatform: string) {
    let socialPlatformProvider;
    if (socialPlatform == "google") {
      socialPlatformProvider = GoogleLoginProvider.PROVIDER_ID;
    }
    this.socialAuthService.signIn(socialPlatformProvider).then(
      (userData) => {
        var email = userData["email"];
        var name = userData["name"];
        var image = userData["image"];
        var id = userData["id"];
        var provider = userData["provider"];

        this.userInfo = {
          "email": email,
          "name": name,
          "image": image,
          "id": id,
          "provider": provider,
        }
        console.log("user info>>>>>>>>>>>>>>", this.userInfo);
        this.onSave(this.userInfo);
      });
  }

  public onSave(info): any {
    this.dialogRef.close({
      email: info.email,
      username: info.name,
      image: info.image,
      id: info.id,
      provider: info.provider
    });
  }
}



