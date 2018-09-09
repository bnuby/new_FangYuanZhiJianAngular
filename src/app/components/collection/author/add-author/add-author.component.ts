import { Component, OnInit } from '@angular/core';
import { host } from 'src/app/services/server.service';
import { Router, ActivatedRoute } from '@angular/router';
import * as $ from 'jquery';
import swal from 'sweetalert';

@Component({
  selector: 'app-add-author',
  templateUrl: './add-author.component.html',
  styleUrls: ['./add-author.component.scss']
})

export class AddAuthorComponent implements OnInit {
  userID = ""
  editMode = false
  authorID = null

  constructor(private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.userID = sessionStorage.getItem("id")
    let authorID = this.route.snapshot.queryParams['authorID']
    let type = this.route.snapshot.queryParams['type']
    if (authorID) {
      this.authorID = authorID
    }

    if (type) {
      this.editMode = true
    }
    this.documentReady()
  }

  documentReady() {
    // update author detail
    if (this.editMode) {
      $.ajax({
        url: `${host}/authors/${this.authorID}`,
        type: "GET",
        success: (data) => {
          let status = data.status
          let msg = data.msg
          if(status) {
            console.log(msg)
            $('#name').val(msg.name)
            $('textarea#description').val(msg.description)
            $('#image').attr('required', false)
          } else {
            swal(msg)
          }
        }
      })
      $('#name')
    }

    $("#form").submit((e) => {
      e.preventDefault()
      var formData = new FormData($("#form")[0])
      if (!this.editMode) {
        // Add Author
        $.ajax({
          url: `${host}/authors/`,
          type: "POST",
          data: formData,
          contentType: false,
          processData: false,
          dataType: 'json',
          cache: false,
          success: (data) => {
            let status = data.status
            let msg = data.msg
            console.log(data)
            if (status) {
              console.log(msg)
              this.goToUserManage()
            } else {
              swal(msg)
            }
          }
        })
      } else {
        // Edit Author
        $.ajax({
          url: `${host}/authors/${this.authorID}`,
          type: "PUT",
          data: formData,
          contentType: false,
          processData: false,
          dataType: 'json',
          cache: false,
          success: (data) => {
            let status = data.status
            let msg = data.msg
            console.log(data)
            if (status) {
              console.log(msg)
              this.goToUserManage()
            } else {
              swal(msg)
            }
          }
        })
      }

    })
  }

  goToUserManage() {
    if (this.editMode) {
      this.router.navigate(["collection/author/detail"], {queryParams: { author_id: this.authorID }})
    } else {
      this.router.navigate(["user"])
    }
  }

}
