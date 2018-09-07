import * as $ from "jquery";
import { Router } from "@angular/router";
import { Component, OnInit } from "@angular/core";
import { host } from "src/app/services/server.service";
import swal from "sweetalert"

@Component({
    selector: "app-author",
    templateUrl: "./author.component.html",
    styleUrls: ["./author.component.scss"]
})
export class AuthorComponent implements OnInit {

    constructor(private router: Router) {}

    ngOnInit() {
        this.documentReady();
    }

    documentReady() {
        
    }
}