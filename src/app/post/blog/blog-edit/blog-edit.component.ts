import { Component, OnInit } from '@angular/core';
import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';
import {MatSelectChange} from '@angular/material/select';
import {BlogModel} from '../../../models/blog.model';
import {AuthService} from '../../../services/auth.service';
import {AngularFirestore} from '@angular/fire/firestore';
import {AngularFireStorage} from '@angular/fire/storage';
import {MatDialog} from '@angular/material/dialog';
import {Router} from '@angular/router';
import {SocialMediaModel} from '../../../models/social-media.model';
import {ModalComponent} from '../../../material/modal/modal.component';
import {GenericModalComponent} from '../../../material/generic-modal/generic-modal.component';
import {MatSnackBar} from '@angular/material/snack-bar';

interface SocialMedia {
  code: string;
  platformName: string;
}

@Component({
  selector: 'app-blog-edit',
  templateUrl: './blog-edit.component.html',
  styleUrls: ['./blog-edit.component.scss']
})
export class BlogEditComponent implements OnInit {

  form: FormGroup;
  imagePreview: string;
  socialMediaOptions: SocialMedia[] = [
    { code: 'fb', platformName: 'facebook'},
    { code: 'ig', platformName: 'instagram'},
    { code: 'yt', platformName: 'youtube'},
    { code: 'in', platformName: 'linkedin'},
    { code: 'tw', platformName: 'twitter'}
  ];
  selectedSocialMediaOptions: SocialMedia[] = [];

  constructor(private authService: AuthService,
              private afFirestore: AngularFirestore,
              private afStorage: AngularFireStorage,
              private matDialog: MatDialog,
              private snackBar: MatSnackBar,
              private router: Router) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.form = new FormGroup({
      title: new FormControl(null, Validators.required),
      blogPoster: new FormControl(null, Validators.required),
      blogURL: new FormControl(null, Validators.required),
      description: new FormControl(null, [Validators.required, Validators.maxLength(180)]),
      blogPoints: new FormArray([new FormControl(null, [Validators.required, Validators.maxLength(100)])]),
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

  onAddMorePoints() {
    (this.form.get('blogPoints') as FormArray).push(new FormControl(null, Validators.required));
  }

  getBlogPointsControls() {
    return (this.form.controls.blogPoints as FormArray).controls;
  }

  onBlogPointCancel(controlIndex: number) {
    (this.form.get('blogPoints') as FormArray).removeAt(controlIndex);
  }

  onImagePicked(event: Event) {
    // do nothing when file manager is opened but image is not picked
    if (!event) { return; }
    const file: File = (event.target as HTMLInputElement).files[0];
    const fileReader = new FileReader();
    fileReader.onload = () => {
      this.imagePreview = fileReader.result as string;
    };
    fileReader.readAsDataURL(file);
    this.form.patchValue({ blogPoster: file });
    this.form.get('blogPoster').updateValueAndValidity();
  }

  async onSubmit() {
    // extract all the values from the form and create a blog obj
    const title: string = this.form.value.title;
    const blogURL: string = this.form.value.blogURL;
    const blogPoints: string[] = this.form.value.blogPoints;
    const description: string = this.form.value.description;
    const socialMedia = [];
    for (const key in this.form.value.socialMedia) {
      socialMedia.push({ platform: key, url: this.form.value.socialMedia[key] });
    }
    const org = this.authService.getOrg();
    const blog = new BlogModel(
      title,
      blogURL,
      null,
      description,
      blogPoints,
      org,
      new Date().toISOString(),
      null,
      socialMedia);

    // show spinner while data is been stored in db
    const spinnerRef = this.matDialog.open(ModalComponent, { disableClose: true });
    const basePath = `posts/${this.authService.getUID()}/blogs`;
    try {
      // store the blog obj in db and get it's ref
      const docRef = await this.afFirestore.collection<BlogModel>(basePath).add({...blog});
      blog.id = docRef.id;
      // upload the blog poster and get it's download url
      blog.posterURL = await this.uploadFile(basePath + `/${docRef.id}/image`, this.form.get('blogPoster').value);
      // update the blog obj
      await docRef.update({...blog});
      spinnerRef.close();
      this.snackBar.open('Blog Submitted Successfully !', null, { duration: 4000 });
      this.router.navigate(['/', 'home']);
    } catch (err) {
      spinnerRef.close();
      this.matDialog.open(GenericModalComponent, { data: { header: 'Error', message: err.message || 'Unknown Error' } } );
    }

  }

  async uploadFile(path: string, file: any): Promise<string> {
    const taskSnapshot = await this.afStorage.upload(path, file).snapshotChanges().toPromise();
    return taskSnapshot.ref.getDownloadURL();
  }
}
