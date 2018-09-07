import { Component, OnInit, ChangeDetectorRef } from "@angular/core"
import { host } from "src/app/services/server.service"
import { Router } from "@angular/router"
import swal from "sweetalert"
import * as $ from "jquery"

@Component({
  selector: "app-user",
  templateUrl: "./user.component.html",
  styleUrls: ["./user.component.scss"]
})
export class UserComponent implements OnInit {

  user_id = null
  myCollections = []

  constructor(private router: Router, private cdRef:ChangeDetectorRef) {}

  ngOnInit() {
    console.log("loaded")
    this.documentReady()
  }

  documentReady() {

    // this.addNewModelRequest()

    $("#user-nav a").click(e => {
      e.preventDefault()
    })

    let id = sessionStorage.getItem("id")
    this.user_id = id
    this.createCollection(id)
    console.log(id)
    if (id != null) {
      $.ajax({
        type: "GET",
        dataType: "json",
        url: `${host}/users/collections/${id}`,
        success: (data) => {
          let status = data.status
          let collections = data.msg
          if (status) {
            collections.some(collection => {
              this.myCollections.push(collection)
            })
          } else {
            console.log(collections)
          }
        },
        failure: function() {
          alert("Error Loading")
        }
      })

      $.getJSON(`${host}/users/info/${id}`).done(data => {
        let status = data.status
        let msg = data.msg
        console.log(data)
        if (status) {
          $("#name")[0].innerHTML = `${msg.first_name} ${msg.last_name} ( ${msg.username} )`
          console.log(msg.username)
          if(msg.profile_picture == "") {
            $('#profilePicture').attr('src', "../../../assets/img/logo.png")
          } else {
            $('#profilePicture').attr('src', `${host}/users/get_pic/${id}`)
          }
        } else {
          console.log(msg)
        }
      })
    } else {
      alert("You are not login")
    }

    $('#type-selection').change((e) => {
      $('#model-upload').attr('disabled', false)
      switch (e.target.value) {
        case 'image':
          $('#model-upload').attr('accept', '.jpg,.jpeg,.png')
          $('#model-upload').attr('name', 'image')
        break

        case 'model':
          $('#model-upload').attr('accept', '.scn, .zip')
          $('#model-upload').attr('name', 'model')
          break

        case 'video':
          $('#model-upload').attr('accept', '.mp4')
          $('#model-upload').attr('name', 'video')
          break

        default:
          $('#model-upload').attr('disabled', true)
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
          swal("Failed!")
        }
      })
    })
    
  
    $('#createNewCollection').submit((e) => {
      e.preventDefault()
      let formdata = new FormData($('#createNewCollection')[0])
      console.log(formdata)
      $.ajax({
        url: `${host}/collections/`,
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

  goToCollectionDetail(collection_id) {
    this.router.navigate(['/collection/detail'], { queryParams: {id: collection_id}})
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
    let str = ""
    for (let json of array) {
      for (let key in json) {
        str += `${key}: ${json[key]}\n`
      }
    }
    return str
  }

  createCollection(id) {
    var key = sessionStorage.getItem("APIKey")
    console.log(key)
    var inner_html = ""

    inner_html =
      inner_html +
      `<input type="text" name="user_id" Value=${id} hidden=True>\
    <input type="text" name="author_id" Value="0" hidden=True>\
    <input type="text" name="APIKey" Value=${key} hidden=True>`

    $("#hidden_form").append(inner_html)
  }
}
