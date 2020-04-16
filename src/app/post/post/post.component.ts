import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {POST_TYPE} from '../../types/types';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {

  postType: POST_TYPE;

  constructor(private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((paramMap) => {
      this.postType = paramMap.get('postType') as POST_TYPE;
    });
  }

}
