import {Component, OnDestroy, OnInit} from '@angular/core';
import {DatabaseService} from '../../../services/database.service';
import {EventModel} from '../../../models/event.model';
import {Subscription} from 'rxjs';
import {SOCIAL_MEDIA_PLATFORM} from '../../../types/types';
import {SocialMediaModel} from '../../../models/social-media.model';
import {ModalComponent} from '../../../material/modal/modal.component';
import {GenericModalComponent} from '../../../material/generic-modal/generic-modal.component';
import {MatDialog} from '@angular/material/dialog';
import {AngularFirestore} from '@angular/fire/firestore';
import {AuthService} from '../../../services/auth.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {AngularFireStorage} from '@angular/fire/storage';

interface SocialMedia {
  code: string;
  platformName: string;
}

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.scss']
})
export class EventListComponent implements OnInit, OnDestroy {

  events: EventModel[] = [];
  subscription: Subscription;
  socialMediaOptions: SocialMedia[] = [
    { code: 'fb', platformName: 'facebook'},
    { code: 'ig', platformName: 'instagram'},
    { code: 'yt', platformName: 'youtube'},
    { code: 'in', platformName: 'linkedin'},
    { code: 'tw', platformName: 'twitter'}
  ];

  constructor(private dbService: DatabaseService,
              private authService: AuthService,
              private matDialog: MatDialog,
              private snackBar: MatSnackBar,
              private afFirestore: AngularFirestore,
              private afStorage: AngularFireStorage) {}

  ngOnInit(): void {
    this.events = this.dbService.getEvents();
    this.subscription = this.dbService.eventsObservable.subscribe(() => {
      this.events = this.dbService.getEvents();
    });
  }

  getSocialMedia(platform: SOCIAL_MEDIA_PLATFORM): SocialMedia {
    return this.socialMediaOptions.find(item => item.code === platform);
  }

  async onEventDelete(event: EventModel) {
    const spinnerRef = this.matDialog.open(ModalComponent, { disableClose: true });
    try {
      await this.afFirestore.collection<EventModel>(`posts/${this.authService.getUID()}/events`).doc(event.id).delete();
      await this.afStorage.ref(`posts/${this.authService.getUID()}/events/${event.id}/image`).delete().toPromise();
      if (event.pdfURL) {
        await this.afStorage.ref(`posts/${this.authService.getUID()}/events/${event.id}/pdf`).delete().toPromise();
      }
      this.snackBar.open('Event Deleted Successfully !', null, { duration: 4000 });
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
