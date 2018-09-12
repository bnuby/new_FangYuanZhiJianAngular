import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { Location } from "@angular/common";
import * as $ from "jquery";
import { host } from "src/app/services/server.service";
import { jsonArrayToString } from "src/app/components/share"

@Component({
  selector: "app-edit",
  templateUrl: "./edit.component.html",
  styleUrls: ["./edit.component.scss"]
})

export class EditComponent implements OnInit {
  id: String;
  type: String;
  details = [];
  item = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private location: Location
  ) {
    this.id = route.snapshot.params["id"];
    this.type = route.snapshot.queryParams["type"];
  }

  ngOnInit() {

    this.addDetailFormSubmit();
    this.editSubmitForm();
    this.historyReplace();
  }

  historyReplace() {
    this.updateTab()

    $(".nav-item").click(e => {
      let tabAttr = e.target.getAttribute("href").replace("#", "");
      console.log(e.target);
      let newLocation =
        location.pathname + "?type=" + this.type + "&tab=" + tabAttr;
      this.location.replaceState(newLocation);
    });
  }

  addDetailFormSubmit() {
    let parent = "#addDetail";

    $(`${parent} #type-selection`).change(e => {
      console.log("change");
      $(`${parent} #upload`).attr("disabled", false);
      switch (e.target.value) {
        case "image":
          $(`${parent} #upload`).attr("accept", ".jpg,.jpeg,.png");
          $(`${parent} #upload`).attr("name", "image");
          break;

        case "model":
          $(`${parent} #upload`).attr("accept", ".scn, .zip");
          $(`${parent} #upload`).attr("name", "model");
          break;

        case "video":
          $(`${parent} #upload`).attr("accept", ".mp4");
          $(`${parent} #upload`).attr("name", "video");
          break;

        default:
          $(`${parent} #upload`).attr("disabled", true);
      }
    });

    $("#addDetailForm").submit(e => {
      e.preventDefault();
      let formData = new FormData($("#addDetailForm")[0]);
      $.ajax({
        url: `${host}/details/${this.id}`,
        type: "POST",
        contentType: false,
        processData: false,
        dataType: "json",
        data: formData,
        cache: false,
        success: data => {
          let status = data.status;
          let msg = data.msg;
          console.log(data);
          if (status) {
            console.log(msg);
            swal("成功新增解說")
            let href = `${location.pathname}?type=${this.type}&tab=manageDetail`
            this.details.push(msg)
            this.location.replaceState(href)
            // this.router.navigate([location.pathname], { queryParams: { type: this.type, tab: "manageDetail"} })
            this.updateTab()
          } else {
            swal(jsonArrayToString((msg)))
            console.log(msg);
          }
        }
      });
    });
  }

  editSubmitForm() {
    let parent = "#editItem";

    $(`${parent} #type-selection`).change(e => {
      console.log("change");
      $(`${parent} #model-upload`).attr("disabled", false);
      switch (e.target.value) {
        case "image":
          $(`${parent} #model-upload`).attr("accept", ".jpg,.jpeg,.png");
          $(`${parent} #model-upload`).attr("name", "image");
          break;

        case "model":
          $(`${parent} #model-upload`).attr("accept", ".scn, .zip");
          $(`${parent} #model-upload`).attr("name", "model");
          break;

        case "video":
          $(`${parent} #model-upload`).attr("accept", ".mp4");
          $(`${parent} #model-upload`).attr("name", "video");
          break;

        default:
          $(`${parent} #model-upload`).attr("disabled", true);
      }
    });

    if (this.type == "edit") {
      $.ajax({
        url: `${host}/items/${this.id}`,
        success: data => {
          let status = data.status;
          let msg = data.msg;
          console.log(msg);
          if (status) {
            this.item = msg;
            this.loadDetails();
            $("#editItem input[name=name]").val(msg.name);
            // $('select[name=type]').val(msg.type)
            $("#editItem textarea[name=description]").val(msg.description);
            var tags = "";
            if (msg.tags != null) {
              msg.tags.forEach(tag => {
                tags += tag + " ";
              });
            }
            console.log(tags);
            $("#editItem input#itemHastag").val(tags);
          } else {
          }
        }
      });
      console.log(this.type)
      $("#editItemForm").submit(e => {
        e.preventDefault();
        $("input#itemHastag").val($("input#itemHastag").val().replace(/ /g, ","));
        let formdata = new FormData($("#editItemForm")[0]);
        $.ajax({
          url: `${host}/items`,
          method: "PUT",
          data: formdata,
          processData: false,
          contentType: false,
          dataType: "json",
          cache: false
        }).done(data => {
          console.log(data);
          let status = data.status;
          let msg = data.msg;
          console.log(msg);
          if (status) {
            swal("Success Update!");
            this.router.navigate(["collection/item", this.id]);
          } else {
            swal({
              text: "fail"
            });
          }
        });
      });
    }
  }

  loadDetails() {
    if (this.item == null) {
      return;
    }
    let detail_ids = this.item.detail_ids;
    detail_ids.forEach(id => {
      $.ajax({
        url: `${host}/details/${id}`,
        success: data => {
          let status = data.status;
          let msg = data.msg;
          console.log(data);
          if (status) {
            if (msg.type == "image")
              msg.image_url = `${host}/details/image/${id}`;

            this.details.push(msg);
          } else {
          }
        }
      });
    });
  }

  private updateTab() {
    let tab = this.route.snapshot.queryParams["tab"];

    console.log(tab);
    if (tab != null) {
      $(".active").removeClass("active");
      $(".show").removeClass("show");
      $(`#${tab}`)
        .addClass("active")
        .addClass("show");
      $(`a[href="#${tab}"]`).addClass("active");
    }
  }

  goToItemDetail(detail_id) {
    this.router.navigate(["collection/item/detail", detail_id]);
  }
}
