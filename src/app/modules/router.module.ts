import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { HomeComponent } from 'src/app/components/home/home.component'
import { LoginComponent } from 'src/app/components/login/login.component'
import { UserComponent } from 'src/app/components/user/user.component'
import { SearchComponent } from 'src/app/components/search/search.component';
import { DetailComponent } from 'src/app/components/collection/detail/detail.component'
import { EditComponent } from 'src/app/components/collection/edit/edit.component'
import { UserGuard } from 'src/app/guards/user/user.guard'

const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'user', component: UserComponent, canActivate:[UserGuard] },
  { path: 'collection/detail', component: DetailComponent},
  { path: 'collection/edit', component: EditComponent, canActivate:[UserGuard]},
  { path: 'search/:searchText', component: SearchComponent }
]

@NgModule({
  imports: [ RouterModule.forRoot(appRoutes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }

