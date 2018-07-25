import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChatComponent } from './chat/chat.component';
import { DialogUserComponent } from './chat/dialog-user/dialog-user.component';

const routes: Routes = [
  { path: '', component: ChatComponent },
  { path: 'userProfile', component: DialogUserComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
