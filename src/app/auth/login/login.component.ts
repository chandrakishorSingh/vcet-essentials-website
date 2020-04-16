import {Component, OnDestroy, OnInit, TemplateRef} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {ModalComponent} from '../../material/modal/modal.component';
import {ComponentType} from '@angular/cdk/portal/portal';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {MatSnackBar} from '@angular/material/snack-bar';
import {GenericModalComponent} from '../../material/generic-modal/generic-modal.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  isLoggedIn = false;
  dialogRef: MatDialogRef<ModalComponent>;
  authSubscription: Subscription;

  constructor(private authService: AuthService,
              private matDialog: MatDialog,
              private router: Router,
              private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.authSubscription = this.authService.isAuthObservable.subscribe((isAuth) => {
      this.isLoggedIn = isAuth;
    });
  }

  async onLogin(email: string, password: string) {
    // show the spinner while server is authenticating then go to home page after successful login
    this.dialogRef = this.matDialog.open(ModalComponent);
    this.dialogRef.afterClosed().subscribe(() => {
      if (this.isLoggedIn) {
        this.router.navigate(['/', 'home']);
        this.snackBar.open('Login Successful!!', null, { duration: 3000 });
      }
    });
    await this.authService.login(email, password)
      .catch((err) => {
        this.dialogRef.close();
        this.matDialog.open(GenericModalComponent, { data: { header: 'Error', message: err.message || 'Unknown Error' } });
    });
  }

  ngOnDestroy(): void {
    this.authSubscription.unsubscribe();
  }

}
