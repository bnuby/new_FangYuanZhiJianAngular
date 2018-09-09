import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { host } from 'src/app/services/server.service'
import * as $ from 'jquery';

@Component({
  selector: 'app-addItem',
  templateUrl: './addItem.component.html',
  styleUrls: ['./addItem.component.scss']
})
export class AddItemComponent implements OnInit {

  constructor(private router: Router, private route: ActivatedRoute) { }

  user_id = null
  collectionName = null
  collectionId = null

  ngOnInit() {
    var url_string = window.location.href;
    var url = new URL(url_string);
    let collection_id = url.searchParams.get('collection_id')
    this.documentReady(collection_id)
  }

  documentReady(collection_id) {

    let id = sessionStorage.getItem("id")
    this.user_id = id
    this.collectionId = collection_id
    console.log(this.user_id)
    $.ajax({
      type: "GET",
      dataType: "json",
      url: `${host}/collections/${collection_id}`,
      success: (data) => {
        let status = data.status
        let collections = data.msg
        if (status) {
          this.collectionName = collections.name
          console.log(this.collectionName)
        } else {
          // console.log(collections)
        }
      },
      failure: function() {
        alert("Error Loading")
      }
    })

    $('#model-form').submit((e) => {
      e.preventDefault()
      let formdata = new FormData($('#model-form')[0])
      $.ajax({
        url: `${host}/items/`,
        method: 'post',
        data: formdata,
        processData: false,
        contentType: false,
        dataType: 'json',
        cache: false,
      }).done((data) => {
        console.log(data)
        let status = data.status
        let msg = data.msg
        console.log(msg)
        if (status) {
          swal("Success Added!")
        } else {
          swal({
            text: "fail"
          })
        }
      })
    })
  }
}
