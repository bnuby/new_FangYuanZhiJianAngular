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
  topDownloadCollectionsId = [];
  topDownloadCollectionName = []

  constructor(private router: Router) {}

  ngOnInit() {
    this.documentReady();
  }

  documentReady() {
    //get top download for carousel image
    $.getJSON(`${host}/collections/download/3/0`).done(data => {
      let status = data.status
      let topDownload = data.msg
      let imgHost = `${host}/collections/images`
      var inner_html = ""
      if (status) {
        topDownload.forEach(collection => {
          this.topDownloadCollectionsId.push(collection.id)
          this.topDownloadCollectionName.push(collection.name)
        })
        inner_html = inner_html +
        `<div class="carousel-item active">\
          <a (click)="goToCollectionDetail(${this.topDownloadCollectionsId[0]})">\
            <img class="carousel-image" src="${imgHost}/${this.topDownloadCollectionsId[0]}" alt="First slide"\
            style="width: 100%; height: 400px; object-fit: cover;">\
            <div class="carousel-caption">\
              <h3 style="background: rgba(0, 0, 0 , 0.4); padding: 10px 20px 10px 20px;">${this.topDownloadCollectionName[0]}</h3>\
            </div>\
          </a>\
        </div>\
        <div class="carousel-item">\
          <a (click)="goToCollectionDetail(${this.topDownloadCollectionsId[1]})">\
            <img class="carousel-image" src="${imgHost}/${this.topDownloadCollectionsId[1]}" alt="Second slide"\
            style="width: 100%; height: 400px; object-fit: cover;">\
            <div class="carousel-caption">\
              <h3 style="background: rgba(0, 0, 0 , 0.4); padding: 10px 20px 10px 20px;">${this.topDownloadCollectionName[1]}</h3>\
            </div>\
          </a>\
        </div>\
        <div class="carousel-item">\
          <a (click)="goToCollectionDetail(${this.topDownloadCollectionsId[2]})">\
            <img class="carousel-image" src="${imgHost}/${this.topDownloadCollectionsId[2]}" alt="Third slide"\
            style="width: 100%; height: 400px; object-fit: cover;">\
            <div class="carousel-caption">\
              <h3 style="background: rgba(0, 0, 0 , 0.4); padding: 10px 20px 10px 20px;">${this.topDownloadCollectionName[2]}</h3>\
            </div>\
          </a>\
        </div>`
        $('#carousel-image-container').append(inner_html)
      } else {
        console.log(data.msg);
      }
    });

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
