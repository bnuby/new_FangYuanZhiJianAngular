import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './modules/router.module';

import { AppComponent } from './app.component';
import { HomeComponent } from 'src/app/components/home/home.component';
import { LoginComponent } from 'src/app/components/login/login.component';
import { DetailComponent } from 'src/app/components/collection/detail/detail.component';
import { UserComponent } from 'src/app/components/user/user.component';
import { EditComponent } from 'src/app/components/collection/edit/edit.component';
import { AddItemComponent } from 'src/app/components/collection/addItem/addItem.component';
import { AuthorComponent } from 'src/app/components/collection/author/author.component';
import { SearchComponent } from 'src/app/components/search/search.component';
import { RegisterComponent } from 'src/app/components/register/register.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    DetailComponent,
    UserComponent,
    EditComponent,
    AddItemComponent,
    SearchComponent,
    RegisterComponent,
    AuthorComponent
   ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [
	AppComponent
]
})
export class AppModule { }
