import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { host } from 'src/app/services/server.service'
import * as $ from 'jquery';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
    var url_string = window.location.href;
    var url = new URL(url_string);
    let collection_id = url.searchParams.get('collection_id')

    $.ajax({
      url: `${host}/collections/${collection_id}`,
      type: 'GET',
      success: (data) => {
        let status = data.status
        let collection = data.msg
        if (status) {
          console.log(collection)
          $('input[name="name"]').val(collection.name)
          $('textarea[name="description"]').val(collection.description)

          console.log($('input[name="privacy"]'))
          if (collection.privacy == 0) {
            $('input[name="privacy"]')[0].checked = true
          } else {
            $('input[name="privacy"]')[1].checked = true
          }

          $('select').val(collection.type)

          let filename = collection.image_path.split('/').last
          $('#preview-image').attr('src', `${host}/collections/images/${collection_id}`)

        } else {
          console.log(collection)
        }
      }
    })

    $('input[type=file]').change(function(e) {
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
          } else {
            console.log(msg)
          }
        }
      })

    })
  }

}
