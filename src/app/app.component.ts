import { Component, OnInit } from "@angular/core";
import { AppRoutingModule } from "./modules/router.module";
import { Router } from "@angular/router"
import * as $ from "jquery";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css", "../assets/share.css"]
})
export class AppComponent implements OnInit {
  title = "FangYuanZhiJian-angularWebApps";
  static status = false;

  constructor(private router: Router) {

    if (sessionStorage.getItem("isLogin") == null) {
      sessionStorage.setItem("isLogin", "false");
    }
    AppComponent.status = sessionStorage.getItem("isLogin") == "false" ? false : true;

    console.log("status", AppComponent.status )
    console.log("status type", typeof(AppComponent.status) )
  }

  getStatus() {
    return AppComponent.status
  }

  ngOnInit() {
    this.calculateBodyMargin()
    window.onresize = (e) => {
      this.calculateBodyMargin()
    }
  }

  calculateBodyMargin() {
    let nav = $('nav')
    let height = nav.height()
    let padTop = Number(nav.css('padding-top').replace(/px/g, ''))
    let padBot = Number(nav.css('padding-bottom').replace(/px/g, ''))
    let marTop = Number(nav.css('margin-top').replace(/px/g, ''))
    let marBot = Number(nav.css('margin-bottom').replace(/px/g, ''))
    let marginTop = height + padTop + padBot + marTop + marBot + 10
    $('.body').css('margin-top', marginTop)
  }

  test() {
    console.log("here");
  }

  logout() {
    sessionStorage.removeItem("id");
    sessionStorage.removeItem("username");
    sessionStorage.removeItem("isLogin");
    sessionStorage.removeItem("APIKey");
    AppComponent.status = false
    this.router.navigate(['login'])
  }
}
