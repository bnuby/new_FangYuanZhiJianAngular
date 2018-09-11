import { Component, OnInit } from "@angular/core";
import { host } from "src/app/services/server.service";
import { Router, ActivatedRoute } from "@angular/router";
import swal from "sweetalert";
import * as $ from "jquery";

@Component({
  selector: "app-item",
  templateUrl: "./item.component.html",
  styleUrls: ["./item.component.scss"]
})
export class ItemComponent implements OnInit {
  id = null;
  image_url = "";
  name = "";
  description = "";
  type = "";
  format = "";
  hashtags = [];

  constructor(private router: Router, private route: ActivatedRoute) {
    this.id = route.snapshot.params["id"];
  }

  ngOnInit() {
    this.documentReady();
  }

  documentReady() {
    this.getItem(this.id);
  }

  private getItem(id) {
    $.ajax({
      url: `${host}/items/${id}`,
      success: data => {
        let status = data.status;
        let msg = data.msg;
        console.log(data);
        if (status) {

          this.image_url = `${host}/items/image/${id}`;
          this.name = msg.name;
          this.description = msg.description;
          this.type = msg.type;
          this.format = msg.format;
          this.hashtags = msg.tags
        } else {
        }
      }
    });
  }

  private searchTag(value) {
    this.router.navigate(['search', value], { queryParams: {isTag: true, tagOnly: true} })
  }

  private deleteItemAlert() {
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this collection and models!",
      icon: "warning",
      buttons: ["Cancel", "Delete"],
      dangerMode: true
    }).then(willDelete => {
      if (willDelete) {
        this.deleteItem(this.id)
        swal("Your collection has been deleted!", {
          icon: "success"
        });
      } else {
        swal("Your item is safe!");
      }
    });
  }

  private deleteItem(id) {
    $.ajax({
      url: `${host}/items/${id}`,
      type: "DELETE",
      success: (data) => {
        let status = data.status
        let msg = data.msg
          console.log(msg)
        if (status) {
          swal("Your item has been Deleted")
        } else {
          swal("Fail to delete your item")
        }
      }
    })
  }
}
