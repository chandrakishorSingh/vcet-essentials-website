import {Component, OnDestroy, OnInit} from '@angular/core';
import {DatabaseService} from '../../../services/database.service';
import {EventModel} from '../../../models/event.model';
import {ModalComponent} from '../../../material/modal/modal.component';
import {GenericModalComponent} from '../../../material/generic-modal/generic-modal.component';
import {BlogModel} from '../../../models/blog.model';
import {SOCIAL_MEDIA_PLATFORM} from '../../../types/types';
import {AuthService} from '../../../services/auth.service';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {AngularFirestore} from '@angular/fire/firestore';
import {Subscription} from 'rxjs';
import {AngularFireStorage} from '@angular/fire/storage';

interface SocialMedia {
  code: string;
  platformName: string;
}

@Component({
  selector: 'app-blog-list',
  templateUrl: './blog-list.component.html',
  styleUrls: ['./blog-list.component.scss']
})
export class BlogListComponent implements OnInit, OnDestroy {

  blogs: BlogModel[] = [];
  socialMediaOptions: SocialMedia[] = [
    { code: 'fb', platformName: 'facebook'},
    { code: 'ig', platformName: 'instagram'},
    { code: 'yt', platformName: 'youtube'},
    { code: 'in', platformName: 'linkedin'},
    { code: 'tw', platformName: 'twitter'}
  ];
  subscription: Subscription;

  constructor(private dbService: DatabaseService,
              private authService: AuthService,
              private matDialog: MatDialog,
              private snackBar: MatSnackBar,
              private afFirestore: AngularFirestore,
              private afStorage: AngularFireStorage) {}

  ngOnInit(): void {
    this.blogs = this.dbService.getBlogs();
    this.subscription = this.dbService.blogsObservable.subscribe(() => {
      this.blogs = this.dbService.getBlogs();
    });
  }

  getSocialMedia(platform: SOCIAL_MEDIA_PLATFORM): SocialMedia {
    return this.socialMediaOptions.find(item => item.code === platform);
  }

  async onBlogDelete(blog: BlogModel) {
    const spinnerRef = this.matDialog.open(ModalComponent, { disableClose: true });
    try {
      await this.afFirestore.collection<EventModel>(`posts/${this.authService.getUID()}/blogs`).doc(blog.id).delete();
      await this.afStorage.ref(`posts/${this.authService.getUID()}/blogs/${blog.id}/image`).delete().toPromise();
      this.snackBar.open('Blog Deleted Successfully !', null, { duration: 4000 });
    } catch (err) {
      spinnerRef.close();
      this.matDialog.open(GenericModalComponent, { data: { header: 'Error', message: err.message || 'Unknown Error' } });
    }
    spinnerRef.close();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
