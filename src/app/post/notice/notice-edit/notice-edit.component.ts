import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, NgForm, Validators} from '@angular/forms';
import {Moment} from 'moment';
import {GenericModalComponent} from '../../../material/generic-modal/generic-modal.component';
import {MatDialog} from '@angular/material/dialog';
import {AuthService} from '../../../services/auth.service';
import {AngularFirestore} from '@angular/fire/firestore';
import {AngularFireStorage} from '@angular/fire/storage';
import {NoticeModel} from '../../../models/notice.model';
import {ModalComponent} from '../../../material/modal/modal.component';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';

@Component({
  selector: 'app-notice-edit',
  templateUrl: './notice-edit.component.html',
  styleUrls: ['./notice-edit.component.scss']
})
export class NoticeEditComponent implements OnInit {

  form: FormGroup;
  pdfFileName: string;

  constructor(private matDialog: MatDialog,
              private snackBar: MatSnackBar,
              private authService: AuthService,
              private router: Router,
              private afFirestore: AngularFirestore,
              private afStorage: AngularFireStorage) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.form = new FormGroup({
      title: new FormControl(null, Validators.required),
      startDate: new FormControl(null, Validators.required),
      endDate: new FormControl(null, Validators.required),
      pdf: new FormControl(null, Validators.required)
    });
  }

  async onSubmit() {
    console.log('form', this.form);
    // extract all values from template
    const title = this.form.get('title').value;
    const startDate = (this.form.get('startDate').value as Moment).toDate();
    const endDate = (this.form.get('endDate').value as Moment).toDate();
    const pdf: File = this.form.get('pdf').value as File;

    // ensure that date and time of events are correct
    if (!this.checkDatesAndTime(startDate, endDate)) {
      return;
    }

    // show spinner while submitting the notice
    const spinnerRef = this.matDialog.open(ModalComponent);

    try {
      // create notice obj
      const org = this.authService.getOrg();
      const notice = new NoticeModel(title, startDate.toISOString(), endDate.toISOString(), org, null, null);

      // store notice obj and get it's ref
      const basePath = `posts/${this.authService.getUID()}/notices`;
      const docRef = await this.afFirestore.collection<NoticeModel>(basePath).add({...notice});
      notice.id = docRef.id;

      // upload notice pdf and get it's url
      notice.pdfURL = await this.uploadFile(basePath + `/${notice.id}/pdf`, this.form.get('pdf').value);

      // update the notice obj to include id and pdfURL
      await docRef.update({ ...notice });
      spinnerRef.close();
      this.snackBar.open('Notice Submitted Successfully !', null, { duration: 4000 });
      this.form.reset();
      this.router.navigate(['/', 'home']);
    } catch (err) {
      spinnerRef.close();
      this.matDialog.open(GenericModalComponent, { data: { header: 'Error', message: err.message || 'Unknown Error' } });
    }

  }

  async uploadFile(path: string, file: any): Promise<string> {
    const taskSnapshot = await this.afStorage.upload(path, file).snapshotChanges().toPromise();
    return taskSnapshot.ref.getDownloadURL();
  }

  onPdfPicked(event: Event) {
    // do nothing if file manager is opened but no pdf is selected
    if (!event) { return; }
    const file: File = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ pdf: file });
    this.form.get('pdf').updateValueAndValidity();
    // console.log('file', file);
    this.pdfFileName = file.name;
  }

  checkDatesAndTime(startDate: Date, endDate: Date): boolean {
    // console.log('start date', startDate);
    // console.log('end date', endDate);
    if (endDate >= startDate) {
      // console.log('modal should not open');
      return true;
    } else {
      // startDate is after endDate
      this.matDialog.open(GenericModalComponent, { data:
          { header: 'Invalid Date', message: 'Start date could not be after end date' }
      });
      // console.log('modal should open');
      return false;
    }
  }

}
