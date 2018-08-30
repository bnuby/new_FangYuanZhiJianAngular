import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { host } from "src/app/services/server.service";
import * as $ from "jquery";
import swal from "sweetalert";

@Component({
  selector: "app-detail",
  templateUrl: "./detail.component.html",
  styleUrls: ["./detail.component.scss"]
})
export class DetailComponent implements OnInit {
  user_id = null;
  collection_id = null
  hashtags = []

  constructor(private router: Router) {}

  ngOnInit() {
    this.documentReady();
  }

  documentReady() {
    var url_string = window.location.href;
    var url = new URL(url_string);
    this.collection_id = url.searchParams.get("id");

    // Get Author Details
    $.ajax({
      type: "GET",
      dataType: "json",
      url: `${host}/authors/${this.collection_id}`,
      success: function(data) {
        var author = data.msg;
        document.getElementById("authorName").innerHTML = author.name;
      },
      failure: function() {
        alert("Error Loading");
      }
    });

    // Get Collections Details
    $.ajax({
      type: "GET",
      dataType: "json",
      url: `${host}/collections/${this.collection_id}`,
      success: data => {
        var collection = data.msg;
        var author_id = collection.author_id;

        this.user_id = collection.user_id;
        this.hashtags = collection.tags
        document.getElementById("collectionDescription").innerHTML =
          collection.description;
        document.getElementById("collectionName").innerHTML = collection.name;
        document.getElementById("collectionCreateDate").innerHTML = collection.created_date.slice(0,10);
        $("#collectionImage img")[0].setAttribute(
          "src",
          `${host}/collections/images/${this.collection_id}`
        );
        $.ajax({
          type: "GET",
          dataType: "json",
          url: `${host}/authors/${author_id}`,
          success: function(data) {
            var author = data.msg;
            document.getElementById("authorName").innerHTML = author.name;
          }
        });
      },
      failure: function() {
        alert("Error Loading");
      }
    });
  }

  deleteCollectionAlert() {
    console.log("clicked");
    let id = sessionStorage.getItem("id");
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this collection and models!",
      icon: "warning",
      buttons: ["Cancel", "Delete"],
      dangerMode: true
    }).then(willDelete => {
      if (willDelete) {
        $.ajax({
          url: `${host}/collections/${id}/${this.collection_id}`,
          type: "DELETE",
          success: data => {
            let status = data.status;
            let msg = data.msg;
            if (status) {
              console.log(msg);
              location.href = "/user.html";
            } else {
              console.log(msg);
            }
          }
        });
        swal("Your collection has been deleted!", {
          icon: "success"
        });
      } else {
        swal("Your collection is safe!");
      }
    });
  }

  searchTag(value) {
    this.router.navigate(['search', value], { queryParams: {isTag: true, tagOnly: true} })
  }

  editCollections() {
    this.router.navigate(['/collection/edit'], {queryParams: {collection_id: this.collection_id}});
  }

  checkUser() {
    // console.log("id", sessionStorage.getItem("id"))
    // console.log("2", sessionStorage.getItem("2"))
    // console.log("isLogin", sessionStorage.getItem("isLogin"))
    // console.log("userID", this.user_id )
    // console.log("id", sessionStorage.getItem("id") )
    if (this.user_id != null && sessionStorage.getItem("id") != null && this.user_id == sessionStorage.getItem("id")) {
      console.log(true)
      return true;
    }

    return false;
  }
}
