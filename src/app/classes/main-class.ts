import { OnInit } from '@angular/core';
import { Router } from '@angular/router';

import * as $ from "jquery";

export class MainClass implements OnInit {

  constructor(private router: Router ) { }

  ngOnInit() {
    $('#page-title .navigationItem').click((e) => {
      let href = e.target.getAttribute('href')
      this.router.navigate([href])
    })
  }

}
