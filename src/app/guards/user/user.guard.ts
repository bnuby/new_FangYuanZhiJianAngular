import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Router } from '@angular/router'
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserGuard implements CanActivate {

  constructor(private router: Router) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.checkLogin();
  }

  checkLogin() {
    console.log("id", sessionStorage.getItem('id'))
    if (sessionStorage.getItem('isLogin') != null && sessionStorage.getItem('isLogin') == "true")
      return true

    alert("You are not login!")
    this.router.navigate(['/login'])
    return false
  }
}
