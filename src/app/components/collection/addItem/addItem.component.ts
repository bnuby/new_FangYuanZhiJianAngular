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

  ngOnInit() {
    // var url_string = window.location.href;
    // var url = new URL(url_string);
    // this.route.queryParams['collection_id']
    let collection_id =  this.route.queryParams['collection_id']

  }

}
