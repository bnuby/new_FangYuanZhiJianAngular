import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { host } from 'src/app/services/server.service';
import * as $ from 'jquery';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {

  detail = null
  detail_id = null
  title = ""
  description = ""
  type = ""
  position = 0
  image_url = ""


  constructor(private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.detail_id = this.route.snapshot.params['id']
    this.loadDetail()
  }

  loadDetail() {
    $.ajax({
      url: `${host}/details/${this.detail_id}`,
      success: (data) => {
        let status = data.status
        let msg = data.msg
        console.log(data)
        if (status) {
          this.detail = msg
          this.title = msg.title
          this.description = msg.description
          this.type = msg.type
          this.position = msg.position
          if(msg.type != 'text') {
            this.image_url = `${host}/details/image/${this.detail_id}`
          }
        } else {

        }
      }
    })
  }

  editDetailPage() {
    this.router.navigate([location.pathname, 'edit'])
  }

  private deleteDetailAlert() {
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this detail!",
      icon: "warning",
      buttons: ["Cancel", "Delete"],
      dangerMode: true
    }).then(willDelete => {
      if (willDelete) {
        this.deleteDetail(this.detail_id)
        swal("Your detail has been deleted!", {
          icon: "success"
        });
        this.router.navigate(['/collection/item', this.detail.item_id, 'edit'], { queryParams: { type: 'edit', 'tab': 'manageDetail' }})
      } else {
        swal("Your detail is safe!");
      }
    });
  }

  private deleteDetail(id) {
    $.ajax({
      url: `${host}/details/${id}`,
      type: "DELETE",
      success: (data) => {
        let status = data.status
        let msg = data.msg
          console.log(msg)
        if (status) {
          swal("Your detail has been Deleted")
        } else {
          swal("Fail to delete your detail")
        }
      }
    })
  }

}
