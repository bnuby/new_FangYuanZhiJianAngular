import { Component, OnInit, OnDestroy } from '@angular/core';
import { Location } from '@angular/common'
import { ActivatedRoute, Router, Params } from '@angular/router'
import * as $ from 'jquery';
import { host } from 'src/app/services/server.service';
import swal from 'sweetalert';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, OnDestroy {

  searchCollections = []

  constructor(private route: ActivatedRoute, private router: Router, private location: Location) {
    route.params.subscribe((params: Params) => {
      $('#searchInput').val(params['searchText'])
      this.doSearch()
    })
  }

  ngOnInit() {

    this.documentReady()

    $('#nav-searchbar').hide()
    $('.dropdown-menu').addClass('left')

    this.doSearch()
  }

  doSearch() {
    let searchText = this.route.snapshot.params.searchText
    let isTag = this.route.snapshot.queryParams.isTag == "true" ? true : false
    let tagOnly = this.route.snapshot.queryParams.tagOnly == "true" ? true : false

    if(isTag) {
      $('input[name=isTag]').attr('checked', true)
    }

    if (tagOnly) {
      $('input[name=tagOnly]').attr('checked', true)
    }

    $('#searchInput').val(searchText)
    $('.search-form').trigger('submit')
  }

  documentReady() {
    $('.search-form').submit((e) => {
      e.preventDefault()
      let searchText = $('#searchInput').val()
      let searchParam = this.route.snapshot.params.searchText
      console.log(this.router)
      if (searchText == searchParam) {
        this.searchCollection()
      } else {
        this.router.navigate(['search', searchText])
      }
      // this.searchCollection()
    })
  }

  searchCollection() {
    this.searchCollections = []
    let formData = new FormData($('.search-form')[0])

    $.ajax({
      url: host + '/collections/search',
      method: "post",
      contentType: false,
      processData: false,
      cache: false,
      dataType: 'json',
      data: formData,
      success: (res) => {
        let status = res.status
        let msg = res.msg
        if (status) {
          let collections = msg
          collections.some((collection) => {
            collection.image_url = `${host}/collections/images/${collection.id}`
          })
          collections.forEach(collection => {
            $.getJSON(`${host}/authors/${collection.author_id}`).done(data => {
              let status = data.status;
              if (status) {
                let author = data.msg;
                collection.image_url = `${host}/collections/images/${
                  collection.id
                }`;
                collection.author = author.name;
                this.searchCollections.push(collection);
                // $scope.$apply
                // createCollectionData('#normal', image_url, collection.name, author.name, collection)
              } else {
                console.log(data.msg);
              }
            });
          });

        } else {
          swal(msg)
        }
      }
    })
  }

  ngOnDestroy() {
    $('#nav-searchbar').show()
    $('.dropdown-menu').removeClass('left')
  }

  goToCollectionDetail(collection_id) {
    this.router.navigate(['/collection/detail'], { queryParams: {id: collection_id}});
  }

}
