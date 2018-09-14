import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { host } from "src/app/services/server.service";
import * as $ from "jquery";
import swal from 'sweetalert';
import { AppComponent } from "src/app/app.component";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"]
})
export class LoginComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {
    this.documentReady();
  }

  documentReady() {
    let formData = new FormData($("input[type=password]")[0]);
    console.log($("input[type=password]")[0]);

    $("#signin-form").submit(e => {
      e.preventDefault();
      let formData = new FormData($("#signin-form")[0]);
      $.ajax({
        url: `${host}/users/login`,
        method: "POST",
        data: formData,
        contentType: false,
        processData: false,
        dataType: "json",
        cache: false,
        success: (data, _, xhr) => {
          console.log(xhr);
          let status = data.status;
          let msg = data.msg;

          if (status == null) {
            console.log("login", sessionStorage.getItem("isLogin"));
            console.log("login", String(true));
            sessionStorage.setItem("id", data.id);
            sessionStorage.setItem(
              "username",
              String(formData.get("username"))
            );
            sessionStorage.setItem("isLogin", String(true));
            sessionStorage.setItem("APIKey", data.api_key);
            AppComponent.status = true;
            this.router.navigate(["user"]);
          } else {
            swal(msg)
            console.log(msg);
          }
        }
      });
    });
  }

  registerAccount(e) {
    console.log('event', e)
    this.router.navigate(['register']);
  }
}
