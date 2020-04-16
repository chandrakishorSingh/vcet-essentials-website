import { Component, OnInit } from '@angular/core';
import {AbstractControl, FormArray, FormControl, FormGroup, NgForm, Validators} from '@angular/forms';
import {MatSelectChange} from '@angular/material/select';
import {Moment} from 'moment';
import {EventModel} from '../../../models/event.model';
import {MatDialog} from '@angular/material/dialog';
import {GenericModalComponent} from '../../../material/generic-modal/generic-modal.component';
import {AuthService} from '../../../services/auth.service';
import {AngularFirestore} from '@angular/fire/firestore';
import {AngularFireStorage} from '@angular/fire/storage';
import {ModalComponent} from '../../../material/modal/modal.component';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';

interface SocialMedia {
  code: string;
  platformName: string;
}

@Component({
  selector: 'app-event-edit',
  templateUrl: './event-edit.component.html',
  styleUrls: ['./event-edit.component.scss']
})
export class EventEditComponent implements OnInit {

  form: FormGroup;
  hasPDF = false;
  socialMediaOptions: SocialMedia[] = [
    { code: 'fb', platformName: 'facebook'},
    { code: 'ig', platformName: 'instagram'},
    { code: 'yt', platformName: 'youtube'},
    { code: 'in', platformName: 'linkedin'},
    { code: 'tw', platformName: 'twitter'}
  ];
  selectedSocialMediaOptions: SocialMedia[] = [];
  imagePreview: string = null;
  isPdfSelected = false;

  constructor(private matDialog: MatDialog,
              private snackBar: MatSnackBar,
              private authService: AuthService,
              private router: Router,
              private afStorage: AngularFireStorage,
              private afFirestore: AngularFirestore) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.form = new FormGroup({
      title: new FormControl(null, Validators.required),
      image: new FormControl(null, Validators.required),
      startDate: new FormControl(null, Validators.required),
      endDate: new FormControl(null, Validators.required),
      startTime: new FormControl(null, Validators.required),
      endTime: new FormControl(null, Validators.required),
      venue: new FormControl(null, Validators.required),
      description: new FormControl(null, [Validators.required, Validators.maxLength(200)]),
      pdf: new FormControl(null),
      socialMedia: new FormGroup({})
    });
  }

  onSocialMediaSelectChange(event: MatSelectChange) {
    // add a new control in form and also a new input[type="url"] in template
    (this.form.get('socialMedia') as FormGroup).addControl(event.value, new FormControl(null, Validators.required));
    const socialMediaOption = this.socialMediaOptions.find(item => event.value === item.code);
    this.selectedSocialMediaOptions.push(socialMediaOption);
  }

  onSocialMediaCancel(code) {
    // remove the control for specified selectedSocialMediaOptions item and also remove it's <input> from template
    (this.form.get('socialMedia') as FormGroup).removeControl(code);
    this.selectedSocialMediaOptions = this.selectedSocialMediaOptions.filter(item => item.code !== code);
  }

  async onSubmit() {
    // extract all the data from the template
    const title: string = this.form.get('title').value;
    const startDate = (this.form.get('startDate').value as Moment).toDate();
    const endDate = (this.form.get('endDate').value as Moment).toDate();
    const startTime: string = this.form.get('startTime').value;
    const endTime: string = this.form.get('endTime').value;
    const image: File = this.form.get('image').value;
    const venue: string = this.form.get('venue').value;
    const description: string = this.form.get('description').value;
    // if (this.isPdfSelected) {
    //   const pdf: File = this.form.get('pdf').value;
    // }
    const socialMedia = [];
    const controls = (this.form.get('socialMedia') as FormGroup).controls;
    for (const key in controls) {
      socialMedia.push({ platform: key, url: controls[key].value });
    }
    const org = this.authService.getOrg();

    // ensure that date and time of events are correct
    if (!this.checkDatesAndTime(startDate, endDate, startTime, endTime)) {
      return;
    }

    const event = new EventModel(
      description,
      startDate.toISOString(),
      endDate.toISOString(),
      startTime,
      endTime,
      null,
      org,
      title,
      venue,
      new Date().toISOString(),
      null,
      socialMedia,
      null);

    // start the spinner while data is uploaded
    const spinnerRef = this.matDialog.open(ModalComponent);

    try {
      // store the event obj in db and get it's ref
      const docRef = await this.afFirestore.collection<EventModel>(`posts/${this.authService.getUID()}/events`).add({...event});
      event.id = docRef.id;

      // store the img(and optionally pdf) and get it's download url
      const basePath = `posts/${this.authService.getUID()}/events/${docRef.id}`;
      const posterUrlPromise = this.uploadFile(basePath + '/image', this.form.get('image').value);
      let pdfUrlPromise;
      if (this.isPdfSelected) {
        pdfUrlPromise = this.uploadFile(basePath + '/pdf', this.form.get('pdf').value);
      }
      event.posterURL = await posterUrlPromise;
      if (this.isPdfSelected) {
        event.pdfURL = await pdfUrlPromise;
      }

      // store the updated event obj with download urls of image and pdf
      await docRef.update({...event});
      // close the spinner and show successful submission of event
      spinnerRef.close();
      this.snackBar.open('Event Submitted Successfully !', null, { duration: 4000 });
      this.form.reset();
      this.router.navigate(['/', 'home']);
    } catch (err) {
      spinnerRef.close();
      this.matDialog.open(GenericModalComponent, { data: { header: 'Error', message: err.message || 'Unknown Err' } });
    }

  }

  async uploadFile(path: string, file: any): Promise<string> {
    const taskSnapshot = await this.afStorage.upload(path, file).snapshotChanges().toPromise();
    return taskSnapshot.ref.getDownloadURL();
  }

  checkDatesAndTime(startDate: Date, endDate: Date, startTime: string, endTime: string): boolean {
    if (endDate > startDate) {
      return true;
    } else if (endDate.getTime() === startDate.getTime()) {
      const startTimeData = startTime.split(':').map(item => parseInt(item, 10));
      const endTimeData = endTime.split(':').map(item => parseInt(item, 10));
      if (startTimeData[0] < endTimeData[0]) {
        return true;
      } else if (startTimeData[0] > endTimeData[0]) {
        // startTime is after the endTime on same date
        this.matDialog.open(GenericModalComponent, { data:
            { header: 'Invalid Time', message: 'Start time could not be after end time' }
        });
        return false;
      } else {
        const result = endTimeData[1] > startTimeData[1];
        if (!result) {
          // the minute of startTime is ahead of the minute of endTime
          this.matDialog.open(GenericModalComponent, { data:
              { header: 'Invalid Time', message: 'Start time could not be after end time' }
          });
        }
        return result;
      }
    } else {
      // startDate is after endDate
      this.matDialog.open(GenericModalComponent, { data:
          { header: 'Invalid Date', message: 'Start date could not be after end date' }
      });
      return false;
    }
  }

  onImagePicked(event: any) {
    // if file manager is opened but no file is selected then return
    if (!event) { return; }

    const file: File = (event.target as HTMLInputElement).files[0];
    const fileReader = new FileReader();
    fileReader.onload = () => {
      this.imagePreview = fileReader.result as string;
    };
    fileReader.readAsDataURL(file);
    this.form.patchValue({ image: file });
    this.form.get('image').updateValueAndValidity();
  }

  async onPdfPicked(event: Event) {
    // if file manager is opened but no file is selected then return
    if (!event) { return; }
    console.log(event);

    const file: File = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ pdf: file });
    this.form.get('pdf').updateValueAndValidity();
    this.isPdfSelected = true;
  }

  onPdfRemove() {
    this.form.get('pdf').reset();
    this.isPdfSelected = false;
  }
}
