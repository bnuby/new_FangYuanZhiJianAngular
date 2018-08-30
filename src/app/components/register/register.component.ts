import * as $ from "jquery";
import { Router } from "@angular/router";

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
        
    }
}
