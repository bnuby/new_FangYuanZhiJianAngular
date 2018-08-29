import { Component, OnInit } from "@angular/core";
import { host } from "src/app/services/server.service";
import * as $ from "jquery";
import { Router } from "@angular/router";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css", "./home.component.scss"]
})

export class HomeComponent implements OnInit {
  newestCollections = [];
  mostViewCollections = [];
  mostDownloadCollections = [];

  constructor(private router: Router) {}

  ngOnInit() {
    this.documentReady();
  }

  documentReady() {
    console.log("here");
    // normal
    $.getJSON(`${host}/collections/10/0`).done(data => {
      let status = data.status;
      if (status) {
        let collections = data.msg;
        collections.forEach(collection => {
          $.getJSON(`${host}/authors/${collection.author_id}`).done(data => {
            let status = data.status;
            if (status) {
              let author = data.msg;
              collection.image_url = `${host}/collections/images/${
                collection.id
              }`;
              collection.author = author.name;
              this.newestCollections.push(collection);
              // $scope.$apply
              // createCollectionData('#normal', image_url, collection.name, author.name, collection)
            } else {
              console.log(data.msg);
            }
          });
        });
      } else {
        console.log(data.msg);
      }
    });

    // visit_count
    $.getJSON(`${host}/collections/visit/10/0`).done(data => {
      let status = data.status;
      if (status) {
        let collections = data.msg;
        collections.forEach(collection => {
          $.getJSON(`${host}/authors/${collection.author_id}`).done(data => {
            let status = data.status;
            if (status) {
              let author = data.msg;
              collection.image_url = `${host}/collections/images/${
                collection.id
              }`;
              collection.author = author.name;
              this.mostViewCollections.push(collection);
            } else {
              console.log(data.msg);
            }
          });
        });
      } else {
        console.log(data.msg);
      }
    });

    // download_count
    $.getJSON(`${host}/collections/download/10/0`).done(data => {
      let status = data.status;
      if (status) {
        let collections = data.msg;
        collections.forEach(collection => {
          $.getJSON(`${host}/authors/${collection.author_id}`).done(data => {
            let status = data.status;
            if (status) {
              let author = data.msg;
              collection.image_url = `${host}/collections/images/${
                collection.id
              }`;
              collection.author = author.name;
              this.mostDownloadCollections.push(collection);
            } else {
              console.log(data.msg);
            }
          });
        });
      } else {
        console.log(data.msg);
      }
    });
    var title = "Gibson";
  }

  goToCollectionDetail(collection_id) {
    this.router.navigate(['/collection/detail'], { queryParams: {id: collection_id}});
  }

}

function createCollectionData(query, image, title, author, collection) {
  console.log(collection.item_ids);
  $(query).append(
    `<div class='item' onclick='{{ getItems($JSON.stringify(collection)) }}'>\
    <img class='image' src=${image}>\
    <div class='body'>\
    <div class='content'>\
    <span class='title'>Title: </span> <span class='title'>${title}</span>\
    </div>\
    <div class='content'>\
    <span class='title'>Author: </span> <span class='title'>${author}</span>\
    </div>\
    </div></div>`
  );
}

function getItems(collection) {
  console.log(collection);
  var ids = collection.item_ids;
  ids.forEach(id => {
    let url = `${host}/items/${id}`;
    $.getJSON(url).done(data => {
      let status = data.status;
      let msg = data.msg;
      if (status) {
        console.log(msg);
      } else {
        console.log(msg);
      }
    });
  });
}
