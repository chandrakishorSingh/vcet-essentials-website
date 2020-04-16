import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NoticeEditComponent } from './notice/notice-edit/notice-edit.component';
import { NoticeDetailComponent } from './notice/notice-detail/notice-detail.component';
import { NoticeListComponent } from './notice/notice-list/notice-list.component';
import { EventEditComponent } from './event/event-edit/event-edit.component';
import { EventListComponent } from './event/event-list/event-list.component';
import { EventDetailComponent } from './event/event-detail/event-detail.component';
import { BlogEditComponent } from './blog/blog-edit/blog-edit.component';
import { BlogDetailComponent } from './blog/blog-detail/blog-detail.component';
import { BlogListComponent } from './blog/blog-list/blog-list.component';
import { PostComponent } from './post/post.component';
import {AngularMaterialModule} from '../material/material.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {RouterModule} from '@angular/router';



@NgModule({
  declarations: [
    NoticeEditComponent,
    NoticeDetailComponent,
    NoticeListComponent,
    EventEditComponent,
    EventListComponent,
    EventDetailComponent,
    BlogEditComponent,
    BlogDetailComponent,
    BlogListComponent,
    PostComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    AngularMaterialModule,
    HttpClientModule
  ]
})
export class PostModule { }
