import { Injectable } from '@angular/core';
import {Subject} from 'rxjs';
import {OrgModel} from '../models/org.model';
import {AngularFireAuth} from '@angular/fire/auth';
import {AngularFirestore} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  isAuthObservable: Subject<boolean> = new Subject<boolean>();
  isAuthenticated = false;
  uid: string;
  org: OrgModel;

  constructor(private afAuth: AngularFireAuth,
              private afFirestore: AngularFirestore) {}

  async login(email: string, password: string) {
    const userCredential = await this.afAuth.signInWithEmailAndPassword(email, password);
    this.uid = userCredential.user.uid;
    this.org = await this.getOrgFromWeb();
    this.isAuthenticated = true;
    this.isAuthObservable.next(this.isAuthenticated);
    // console.log(this.org);
  }

  async logout() {
    await this.afAuth.signOut();
    // waiting for some time as signOut() of firebase is too fast while it takes some time to open spinner modal
    await this.wait(500);
    this.isAuthenticated = false;
    this.isAuthObservable.next(this.isAuthenticated);
    this.uid = null;
    this.org = null;
  }

  getIsAuthenticated(): boolean {
    return this.isAuthenticated;
  }

  getOrgFromWeb(): Promise<OrgModel> {
    return this.afFirestore.doc<OrgModel>(`orgs-1/${this.uid}`).get().toPromise().then(a => a.data() as OrgModel);
  }

  getOrg(): OrgModel {
    return {...this.org};
  }

  getUID() {
    return this.uid;
  }

  wait(time) {
    return new Promise((resolve) => {
      setTimeout(resolve, time);
    });
  }
}
