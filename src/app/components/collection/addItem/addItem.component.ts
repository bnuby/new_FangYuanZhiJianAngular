import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { host } from 'src/app/services/server.service'
import * as $ from 'jquery';

@Component({
  selector: 'app-addItem',
  templateUrl: './addItem.component.html',
  styleUrls: ['./addItem.component.scss']
})
export class AddItemComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
    var url_string = window.location.href;
    var url = new URL(url_string);
    let collection_id = url.searchParams.get('collection_id')

  }

}
