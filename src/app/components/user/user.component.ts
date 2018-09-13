import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { host } from "src/app/services/server.service";
import { Router, ActivatedRoute } from "@angular/router";
import { Location } from "@angular/common";
import swal from "sweetalert";
import * as $ from "jquery";

@Component({
  selector: "app-user",
  templateUrl: "./user.component.html",
  styleUrls: ["./user.component.scss"]
})
export class UserComponent implements OnInit {
  user_id = null;
  myCollections = [];
  myAuthors = [];
  host = null;

  constructor(private router: Router, private route: ActivatedRoute, private location: Location, private cdRef: ChangeDetectorRef) {}

  ngOnInit() {
    console.log("loaded");
    this.host = host;
    this.documentReady();
  }

  documentReady() {
    // this.addNewModelRequest()
    this.historyReplace()

    $("#user-nav a").click(e => {
      e.preventDefault();
    });

    let id = sessionStorage.getItem("id");
    this.user_id = id;
    this.createCollection(id);
    console.log(id);
    if (id != null) {
      // Get Collection
      $.ajax({
        type: "GET",
        dataType: "json",
        url: `${host}/users/collections/${id}`,
        success: data => {
          let status = data.status;
          let collections = data.msg;
          if (status) {
            collections.some(collection => {
              this.myCollections.push(collection);
            });
          } else {
            console.log(collections);
          }
        },
        failure: function() {
          alert("Error Loading");
        }
      });

      // Get Authors
      $.ajax({
        type: "GET",
        url: `${host}/users/authors/${id}`,
        success: data => {
          let status = data.status;
          let authors = data.msg;
          if (status) {
            authors.some(author => {
              author.image_url = `${host}/authors/image/${author.id}`;
              this.myAuthors.push(author);
            });
          } else {
            console.log(authors);
          }
        },
        failure: function() {
          alert("Error Loading");
        }
      });

      $.getJSON(`${host}/users/info/${id}`).done(data => {
        let status = data.status;
        let msg = data.msg;
        console.log(data);
        if (status) {
          $("#name")[0].innerHTML = `${msg.first_name} ${msg.last_name}`;
          console.log(msg.username);
          if (msg.profile_picture == "") {
            $("#profilePicture").attr("src", "../../../assets/img/logo.png");
          } else {
            //this got some problem, author != user, need to add author option
            $("#profilePicture").attr("src", `${host}/users/get_pic/${id}`);
          }
        } else {
          console.log(msg);
        }
      });
    } else {
      alert("You are not login");
    }

    $("#type-selection").change(e => {
      $("#model-upload").attr("disabled", false);
      switch (e.target.value) {
        case "image":
          $("#model-upload").attr("accept", ".jpg,.jpeg,.png");
          $("#model-upload").attr("name", "image");
          break;

        case "model":
          $("#model-upload").attr("accept", ".scn, .zip");
          $("#model-upload").attr("name", "model");
          break;

        case "video":
          $("#model-upload").attr("accept", ".mp4");
          $("#model-upload").attr("name", "video");
          break;

        default:
          $("#model-upload").attr("disabled", true);
      }
    });

    $("#model-form").submit(e => {
      e.preventDefault();
      let formdata = new FormData($("#model-form")[0]);
      $.ajax({
        url: `${host}/items/`,
        method: "post",
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
          swal("Success Added!");
        } else {
          swal("Failed!");
        }
      });
    });

    $("#createNewCollection").submit(e => {
      e.preventDefault();
      let formdata = new FormData($("#createNewCollection")[0]);
      console.log(formdata);
      $.ajax({
        url: `${host}/collections/`,
        method: "post",
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
          swal("Success Added!");
          location.reload()
        } else {
          swal({
            text: "fail"
          });
        }
      });
    });
  }

  goToCollectionDetail(collection_id) {
    this.router.navigate(["/collection/detail"], {
      queryParams: { id: collection_id }
    });
  }

  goToAuthorDetail(author_id) {
    this.router.navigate(["/collection/author/detail"], {
      queryParams: { author_id: author_id }
    });
  }

  goToAddAuthor(author_id) {
    this.router.navigate(["/collection/author/addAuthor"]);
  }

  historyReplace() {
    this.updateTab()

    $(".nav-item").click(e => {
      let tabAttr = e.target.getAttribute("href").replace("#", "");
      console.log(e.target);
      let newLocation =
        location.pathname + "?tab=" + tabAttr;
      this.location.replaceState(newLocation);
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

  // addNewModelRequest() {
  //   $('#model-form').submit((e) => {
  //     e.preventDefault()

  //     let formdata = new FormData($('#model-form')[0])

  //     $.ajax({
  //       url: `${host}/items/`,
  //       method: 'post',
  //       data: formdata,
  //       processData: false,
  //       contentType: false,
  //       dataType: 'json',
  //       cache: false,
  //     }).done((data) => {
  //       console.log(data)
  //       let status = data.status
  //       let msg = data.msg
  //       if (status) {
  //         swal("Success Added!")
  //       } else {
  //         swal({
  //           text: this.jsonArrayToString(msg),
  //           dangerMode: true
  //         })
  //       }
  //     })

  //   })
  // }

  jsonArrayToString(array) {
    let str = "";
    for (let json of array) {
      for (let key in json) {
        str += `${key}: ${json[key]}\n`;
      }
    }
    return str;
  }

  createCollection(id) {
    var key = sessionStorage.getItem("APIKey");
    console.log(key);
    var inner_html = "";

    inner_html =
      inner_html +
      `<input type="text" name="user_id" Value=${id} hidden=True>\
    <input type="text" name="author_id" Value="0" hidden=True>\
    <input type="text" name="APIKey" Value=${key} hidden=True>`;

    $("#hidden_form").append(inner_html);
  }
}
