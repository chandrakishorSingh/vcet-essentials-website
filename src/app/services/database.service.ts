import { Injectable } from '@angular/core';
import {EventModel} from '../models/event.model';
import {NoticeModel} from '../models/notice.model';
import {BlogModel} from '../models/blog.model';
import {AngularFirestore} from '@angular/fire/firestore';
import {AuthService} from './auth.service';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  events: EventModel[] = [];
  notices: NoticeModel[] = [];
  blogs: BlogModel[] = [];

  eventsObservable: Observable<EventModel[]>;
  noticesObservable: Observable<NoticeModel[]>;
  blogsObservable: Observable<BlogModel[]>;

  constructor(private ngFirestore: AngularFirestore,
              private authService: AuthService) {
    this.registerObservables();
    this.resetDataOnLogout();
  }

  registerObservables() {
    this.eventsObservable = this.ngFirestore.collection<EventModel>(`posts/${this.authService.getUID()}/events`).valueChanges();
    this.noticesObservable = this.ngFirestore.collection<NoticeModel>(`posts/${this.authService.getUID()}/notices`).valueChanges();
    this.blogsObservable = this.ngFirestore.collection<BlogModel>(`posts/${this.authService.getUID()}/blogs`).valueChanges();

    this.eventsObservable.subscribe((data) => {
      this.events = this.sortEvents(data);
      // console.log(this.events);
    });

    this.noticesObservable.subscribe((data) => {
      this.notices = this.sortNotices(data);
      // console.log('notices', this.notices);
    });

    this.blogsObservable.subscribe((data) => {
      this.blogs = this.sortBlogs(data);
      // console.log('blogs', this.blogs);
    });
  }

  resetDataOnLogout() {
    this.authService.isAuthObservable.subscribe(() => {
      this.notices = [];
      this.events = [];
      this.blogs = [];
      this.registerObservables();
    });
  }

  // sort events in reverse chronological order
  sortEvents(events: EventModel[]): EventModel[] {
    return events.sort((a, b) => {
      if (a.startDate > b.startDate) { return 1; } else if (a.startDate === b.startDate) { return 0; } else { return -1; }
    });
  }

  // sort notices in reverse chronological order
  sortNotices(notices: NoticeModel[]): NoticeModel[] {
    return notices.sort((a, b) => {
      if (a.startDate > b.startDate) { return 1; } else if (a.startDate === b.startDate) { return 0; } else { return -1; }
    });
  }

  // sort blogs in reverse chronological order
  sortBlogs(blogs: BlogModel[]): BlogModel[] {
    return blogs.sort((a, b) => {
      if (a.createdAt > b.createdAt) { return 1; } else if (a.createdAt === b.createdAt) { return 0; } else { return -1; }
    });
  }


  getEvents(): EventModel[] {
    return [...this.events];
  }

  getNotices(): NoticeModel[] {
    return [...this.notices];
  }

  getBlogs(): BlogModel[] {
    return [...this.blogs];
  }

}
