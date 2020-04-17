import {Component, OnDestroy, OnInit} from '@angular/core';
import {ModalComponent} from '../../../material/modal/modal.component';
import {EventModel} from '../../../models/event.model';
import {GenericModalComponent} from '../../../material/generic-modal/generic-modal.component';
import {Subscription} from 'rxjs';
import {NoticeModel} from '../../../models/notice.model';
import {DatabaseService} from '../../../services/database.service';
import {AngularFirestore} from '@angular/fire/firestore';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {AuthService} from '../../../services/auth.service';
import {AngularFireStorage} from '@angular/fire/storage';

@Component({
  selector: 'app-notice-list',
  templateUrl: './notice-list.component.html',
  styleUrls: ['./notice-list.component.scss']
})
export class NoticeListComponent implements OnInit, OnDestroy {

  notices: NoticeModel[] = [];
  subscription: Subscription;

  constructor(private dbService: DatabaseService,
              private authService: AuthService,
              private afFirestore: AngularFirestore,
              private afStorage: AngularFireStorage,
              private matDialog: MatDialog,
              private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.notices = this.dbService.getNotices();
    this.subscription = this.dbService.noticesObservable.subscribe(() => {
      this.notices = this.dbService.getNotices();
    });
  }

  async onNoticeDelete(notice: NoticeModel) {
    const spinnerRef = this.matDialog.open(ModalComponent, { disableClose: true });
    try {
      await this.afFirestore.collection<EventModel>(`posts/${this.authService.getUID()}/notices`).doc(notice.id).delete();
      await this.afStorage.ref(`posts/${this.authService.getUID()}/notices/${notice.id}/pdf`).delete().toPromise();
      this.snackBar.open('Notice Deleted Successfully !', null, { duration: 4000 });
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
