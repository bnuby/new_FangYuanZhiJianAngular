import { MainClass } from "src/app/classes/main-class"
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { host } from 'src/app/services/server.service';
import swal from 'sweetalert';
import { jsonArrayToString } from 'src/app/components/share';
import * as $ from 'jquery';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent extends MainClass implements OnInit {

  detail_id = null

  constructor( private router: Router, private route: ActivatedRoute) {
    super(router)
   }

  ngOnInit() {
    super.ngOnInit()
    this.detail_id = this.route.snapshot.params['id']
    this.editDetailForm()
    this.loadDetail()

  }

  editDetailForm() {
    let parent = "#editDetail";

    $(`${parent} #type-selection`).change(e => {
      console.log("change");
      $(`${parent} #upload`).attr("disabled", false);
      switch (e.target.value) {
        case "image":
          $(`${parent} #upload`).attr("accept", ".jpg,.jpeg,.png");
          $(`${parent} #upload`).attr("name", "image");
          break;

        case "model":
          $(`${parent} #upload`).attr("accept", ".scn, .zip");
          $(`${parent} #upload`).attr("name", "model");
          break;

        case "video":
          $(`${parent} #upload`).attr("accept", ".mp4");
          $(`${parent} #upload`).attr("name", "video");
          break;

        default:
          $(`${parent} #upload`).attr("disabled", true);
      }
    });

    let formData = new FormData($(parent)[0])

    $(parent).submit((e) => {
      e.preventDefault()
      $.ajax({
        url: `${host}/details/${this.detail_id}`,
        type: "PUT",
        cache: false,
        data: formData,
        dataType: "json",
        contentType: false,
        processData: false,
        success: (data) => {
          let status = data.status
          let msg = data.msg
          if (status) {
            swal("成功修改解說")
            this.router.navigate(['collection/item/detail', this.detail_id])
          } else {
            swal(jsonArrayToString(msg))
          }
        }
      })
    })
  }

  loadDetail() {
    $.ajax({
      url: `${host}/details/${this.detail_id}`,
      success: (data) => {
        let status = data.status
        let msg = data.msg
        console.log(data)
        if (status) {
          $('#title').val(msg.title)
          $('#position').val(msg.position)
          $('#description').val(msg.description)
        } else {
          console.log(msg)
        }
      }
    })
  }

}
