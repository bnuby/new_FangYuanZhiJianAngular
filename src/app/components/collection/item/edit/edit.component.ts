import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import * as $ from 'jquery';
import { host } from 'src/app/services/server.service';


@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {

  id: String
  type: String

  constructor(private router: Router, private route: ActivatedRoute) {
    this.id = route.snapshot.params['id']
    this.type = route.snapshot.queryParams['type']
   }

  ngOnInit() {
    $('form').submit((e) => {
      e.preventDefault()
      let formData = new FormData($("#editCollection-form")[0])
      console.log($("#editCollection-form"))
      console.log(formData)
      $.ajax({
        url: `${host}/items/${this.id}`,
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
    this.editMode()
  }

  editMode() {
    if(this.type == "edit") {
      $.ajax({
        url: `${host}/items/${this.id}`,
        success: (data) => {
          let status = data.status
          let msg = data.msg
          console.log(msg)
          if (status) {
            $('input[name=name]').val(msg.name)
            // $('select[name=type]').val(msg.type)
            $('textarea[name=description]').val(msg.description)
            var tags = ""
            if (msg.tags != null) {
              msg.tags.forEach((tag) => {
                tags += tag + " "
              })
            }
            console.log(tags)
            $('input#itemHastag').val(tags)
          } else {

          }
        }
      })



    $('#model-form').submit((e) => {
      e.preventDefault()
      $('input#itemHastag').val($('input#itemHastag').val.replace(' ', ','))
      let formdata = new FormData($('#model-form')[0])
      $.ajax({
        url: `${host}/items`,
        method: 'PUT',
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
          swal("Success Update!")
          this.router.navigate(['collection/item', this.id])
        } else {
          swal({
            text: "fail"
          })
        }
      })
    })
    }
  }

}
