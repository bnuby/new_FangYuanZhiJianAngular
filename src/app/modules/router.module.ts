import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { HomeComponent } from 'src/app/components/home/home.component'
import { LoginComponent } from 'src/app/components/login/login.component'
import { RegisterComponent } from 'src/app/components/register/register.component'
import { UserComponent } from 'src/app/components/user/user.component'
import { SearchComponent } from 'src/app/components/search/search.component';
import { DetailComponent } from 'src/app/components/collection/detail/detail.component'
import { EditComponent } from 'src/app/components/collection/edit/edit.component'

import { AddItemComponent } from 'src/app/components/collection/addItem/addItem.component'
import { ItemComponent } from 'src/app/components/collection/item/item.component';
import { EditComponent as ItemEditComponent } from 'src/app/components/collection/item/edit/edit.component'

import { DetailComponent as ItemDetailComponent } from 'src/app/components/collection/item/detail/detail.component';
import { EditComponent as ItemDetailEditComponent } from 'src/app/components/collection/item/detail/edit/edit.component';

import { UserGuard } from 'src/app/guards/user/user.guard'

import { DetailComponent as AuthorDetail } from 'src/app/components/collection/author/detail/detail.component';
import { AddAuthorComponent } from 'src/app/components/collection/author/add-author/add-author.component';


const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'user', component: UserComponent, canActivate:[UserGuard] },
  { path: 'collection/detail', component: DetailComponent},
  { path: 'collection/edit', component: EditComponent, canActivate:[UserGuard]},
  { path: 'collection/addItem', component: AddItemComponent, canActivate:[UserGuard]},

  { path: 'collection/item/:id/edit', component: ItemEditComponent, canActivate:[UserGuard]},
  { path: 'collection/item/:id', component: ItemComponent, children: [
    // { path: '' , redirectTo: 'edit', pathMatch: "full" },
    // { path: 'edit',component: ItemEditComponent }
  ]},

  { path: 'collection/item/detail/:id/edit', component: ItemDetailEditComponent, canActivate:[UserGuard]},
  { path: 'collection/item/detail/:id', component: ItemDetailComponent, canActivate:[UserGuard], children:[
    // { path: 'edit', component: ItemDetailEditComponent }
  ]},

  { path: 'collection/author/detail', component: AuthorDetail},
  { path: 'collection/author/addAuthor', component: AddAuthorComponent, canActivate:[UserGuard]},
  { path: 'search/:searchText', component: SearchComponent }
]

@NgModule({
  imports: [ RouterModule.forRoot(appRoutes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
