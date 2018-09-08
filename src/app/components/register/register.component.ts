import * as $ from "jquery";
import { Router } from "@angular/router";
import { Component, OnInit } from "@angular/core";
import { host } from "src/app/services/server.service";
import swal from "sweetalert"
@Component({
    selector: "app-register",
    templateUrl: "./register.component.html",
    styleUrls: ["./register.component.scss"]
})
export class RegisterComponent implements OnInit {

    constructor(private router: Router) {}

    ngOnInit() {
        this.documentReady();
    }

    documentReady() {

      $('#register-form').submit(e => {
        e.preventDefault();
        let formData = new FormData($("#register-form")[0]);
        $.ajax ({
            url: `${host}/users/`,
            method: "POST",
            data: formData,
            contentType: false,
            processData: false,
            dataType: "json",
            cache: false,
            success: (data) => {
              swal("Register Successful!")
            }
        })
      })

    }
}

