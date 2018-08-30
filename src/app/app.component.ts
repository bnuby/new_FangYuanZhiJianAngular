import { Component, OnInit } from "@angular/core";
import { AppRoutingModule } from "./modules/router.module";
import { Router } from "@angular/router"
import * as $ from "jquery";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss", "../assets/share.css"]
})
export class AppComponent implements OnInit {
  title = "FangYuanZhiJian-angularWebApps";
  static status = false;

  constructor(private router: Router) {

    if (sessionStorage.getItem("isLogin") == null) {
      sessionStorage.setItem("isLogin", "false");
    }

    AppComponent.status = sessionStorage.getItem("isLogin") == "false" ? false : true;

    router.events.subscribe((e) => {
      $('#navbar-toggler[aria-expanded=true]').trigger('click')
    })
  }

  ngOnInit() {

    // calculate body margin on the first time
    this.calculateBodyMargin()

    this.documentReady()

    // update body margin when window is resize
    window.onresize = (e) => {
      this.calculateBodyMargin()
    }
  }

  documentReady() {
    $('#nav-searchbar').submit((e) => {
      e.preventDefault()
      let searchText = $('#searchText').val()
      this.router.navigate(['/search', searchText])
    })
  }

  getStatus() {
    return AppComponent.status
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
