import { Component, OnInit } from '@angular/core';
import { AppRoutingModule } from './router.module';
import * as $ from 'jquery';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css', '../assets/share.css']
})

export class AppComponent implements OnInit {
  title = 'FangYuanZhiJian-angularWebApps';
  status = true

  ngOnInit() {
    console.log("Init")
    console.log("appRoutes", AppRoutingModule)
  }

  test() {
    console.log("here")
  }
}
