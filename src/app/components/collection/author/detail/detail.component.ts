import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import * as $ from 'jquery';
import { host } from 'src/app/services/server.service';
import swal from 'sweetalert'

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {

  id: Number
  name: String
  description: String
  photo_url = `${host}/authors/image/`
  authorCollections = []

  constructor(private router: Router, private route: ActivatedRoute) {
    this.id = route.snapshot.queryParams['author_id']
    this.photo_url += this.id
   }

  ngOnInit() {
    this.documentReady()
  }

  documentReady() {

    // Request Author Detail
    $.ajax({
      url: `${host}/authors/${this.id}`,
      type: "get",
      success: (data) => {
        let status = data.status
        let msg = data.msg
        if (status) {
          console.log(msg)
          this.name = msg['name']
          this.description = msg['description']
          var collection_ids = msg['collection_ids']
          collection_ids.forEach(id => {
            this.createCollection(id)
          });
        } else {
          swal(msg)
        }
      }
    })
  }

  createCollection(id) {
    console.log("create")
    $.ajax({
      url: `${host}/collections/${id}`,
      type: 'GET',
      success: (data) => {
        let status = data.status
        let msg = data.msg
        if (status) {
          msg.image_url = `${host}/collections/images/${id}`
          this.authorCollections.push(msg)
        } else {
          swal(msg)
        }
      }
    })
  }

  deleteAuthorAlert() {
    console.log("clicked");
    let id = sessionStorage.getItem("id");
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this author!",
      icon: "warning",
      buttons: ["Cancel", "Delete"],
      dangerMode: true
    }).then(willDelete => {
      if (willDelete) {
        $.ajax({
          url: `${host}/authors/${this.id}`,
          type: "DELETE",
          success: data => {
            let status = data.status;
            let msg = data.msg;
            if (status) {
              console.log(msg);
              this.router.navigate(['/user'])
            } else {
              console.log(msg);
            }
          }
        });
        swal("Your author has been deleted!", {
          icon: "success"
        });
      } else {
        swal("Your author is safe!");
      }
    });
  }

  goToEditPage() {
    this.router.navigate(['/collection/author/addAuthor'], {queryParams: {authorID: this.id, type: 'edit'}})
  }

  goToCollection(id) {
    this.router.navigate(['/collection/detail'], { queryParams: {id: id}})
  }

}
