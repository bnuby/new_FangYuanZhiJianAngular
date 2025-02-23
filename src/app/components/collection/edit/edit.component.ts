import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { host } from 'src/app/services/server.service'
import swal from 'sweetalert';
import * as $ from 'jquery';
import { jsonArrayToString } from '../../share';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {

  myItems = []
  collection_id = null

  constructor(private router: Router, private route: ActivatedRoute, private location: Location) { }

  ngOnInit() {
    let collection_id = this.route.snapshot.queryParams['collection_id']
    this.collection_id = collection_id

    this.editCollectionForm(collection_id)
    this.addItemForm()
    this.historyReplace()
  }

  historyReplace() {
    let tab = this.route.snapshot.queryParams['tab']

    console.log(tab)
    if (tab != null) {
      $('.active').removeClass('active')
      $('.show').removeClass('show')
      $(`#${tab}`).addClass('active').addClass('show')
      $(`a[href="#${tab}"]`).addClass('active')
    }

    $('.nav-item').click((e) => {
      let tabAttr = e.target.getAttribute('href').replace('#', '')
      console.log(e.target)
      let newLocation = location.pathname + "?collection_id=" + this.collection_id + "&tab=" + tabAttr
      this.location.replaceState(newLocation)
    })
  }

  editCollectionForm(collection_id) {
    // Set Default Collection Value
    $.ajax({
      url: `${host}/collections/${collection_id}`,
      type: 'GET',
      success: (data) => {
        let status = data.status
        let collection = data.msg
        if (status) {
          console.log(collection)
          $('#editCollection input[name="name"]').val(collection.name)
          $('#editCollection textarea[name="description"]').val(collection.description)

          console.log($('input[name="privacy"]'))
          if (collection.privacy == 0) {
            $('#editCollection input[name="privacy"]')[0].checked = true
          } else {
            $('#editCollection input[name="privacy"]')[1].checked = true
          }

          $('#editCollection select').val(collection.type)

          let filename = collection.image_path.split('/').last
          $('#editCollection #preview-image').attr('src', `${host}/collections/images/${collection_id}`)

          collection.item_ids.forEach( (id) => {
            this.getItem(id)
          })

        } else {
          console.log(collection)
        }
      }
    })

    $('#editCollection input[type=file]').change(function(e) {
      let file = this.files[0]
      let reader = new FileReader()
      reader.onload = (e) => {
        $('#preview-image').attr('src', e.target['result'])
      }
      reader.readAsDataURL(file)
    })

    $('#editCollection-form').submit((e) => {
      e.preventDefault()
      let formData = new FormData($("#editCollection-form")[0])
      console.log($("#editCollection-form"))
      console.log(formData)
      $.ajax({
        url: `${host}/collections/${collection_id}`,
        type: 'PUT',
        contentType: false,
        processData: false,
        dataType: 'json',
        data: formData,
        cache: false,
        success: (data) => {
          let status = data.status
          let msg = data.msg
          console.log(data)
          if(status) {
            console.log(msg)
            location.href = document.referrer
            swal('成功修改作品集')
          } else {
            console.log(msg)
            swal(jsonArrayToString(msg))
          }
        }
      })
    })
  }

  addItemForm() {
    let parent = "#addItem"

    $(`${parent} #type-selection`).change((e) => {
      console.log("change")
      $(`${parent} #model-upload`).attr('disabled', false)
      switch (e.target.value) {
        case 'image':
          $(`${parent} #model-upload`).attr('accept', '.jpg,.jpeg,.png')
          $(`${parent} #model-upload`).attr('name', 'image')
        break

        case 'model':
          $(`${parent} #model-upload`).attr('accept', '.scn, .zip')
          $(`${parent} #model-upload`).attr('name', 'model')
          break

        case 'video':
          $(`${parent} #model-upload`).attr('accept', '.mp4')
          $(`${parent} #model-upload`).attr('name', 'video')
          break

        default:
          $(`${parent} #model-upload`).attr('disabled', true)
      }
    })

    $('#addItem form').submit((e) => {
      e.preventDefault()
      let formData = new FormData($("#addItem form")[0])
      console.log($("#editCollection-form"))
      console.log(formData)
      $.ajax({
        url: `${host}/items`,
        type: 'POST',
        contentType: false,
        processData: false,
        dataType: 'json',
        data: formData,
        cache: false,
        success: (data) => {
          let status = data.status
          let msg = data.msg
          console.log(data)
          if(status) {
            console.log(msg)
            // location.href = document.referrer
            swal("成功添加模型")
            location.reload()
          } else {
            console.log(msg)
            if(typeof(msg) == 'string') {
              swal(msg)
            } else {
              swal(jsonArrayToString(msg))
            }
          }
        }
      })
    })
  }

  getItem(id) {
    $.ajax({
      url: `${host}/items/${id}`,
      type: "GET",
      success: (data) => {
        let status = data.status
        let msg = data.msg
        if (status) {
          if (msg.type == "image")
            msg.image_url = `${host}/items/image/${id}`
          console.log(msg)
          this.myItems.push(msg)
          // return msg
        } else {
          swal(msg)
        }
      }
    })
  }

  goToItem(id) {
    this.router.navigate(['collection', 'item', id])
  }

}
