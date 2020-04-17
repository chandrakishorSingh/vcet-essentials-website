import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '../services/auth.service';
import {Subscription} from 'rxjs';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {ModalComponent} from '../material/modal/modal.component';
import {Router} from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {

  isLoggedIn = false;
  authSubscription: Subscription;
  dialogRef: MatDialogRef<ModalComponent>;

  constructor(private authService: AuthService,
              private matDialog: MatDialog,
              private router: Router) {}

  ngOnInit(): void {
    this.isLoggedIn = this.authService.getIsAuthenticated();
    this.authSubscription = this.authService.isAuthObservable.subscribe((isAuth) => {
      this.isLoggedIn = isAuth;
    });
  }

  async onLogout() {
    // show the spinner and go to auth page after logout
    const dialogRef = this.matDialog.open(ModalComponent, { disableClose: true });
    dialogRef.afterClosed().subscribe(() => {
      this.router.navigate(['/', 'auth']);
    });
    await this.authService.logout();
  }

  ngOnDestroy(): void {
    this.authSubscription.unsubscribe();
  }
}
