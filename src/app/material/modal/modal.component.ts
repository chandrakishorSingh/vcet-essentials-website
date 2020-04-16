import {Component, OnDestroy, OnInit, TemplateRef} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {MatDialogRef} from '@angular/material/dialog';
import {Subscription} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit, OnDestroy {

  authSubscription: Subscription;

  constructor(private authService: AuthService,
              private router: Router,
              private dialogRef: MatDialogRef<ModalComponent>) {}

  ngOnInit(): void {
    this.authSubscription = this.authService.isAuthObservable.subscribe(isAuth => {
      this.dialogRef.close();
    });
  }

  ngOnDestroy(): void {
    this.authSubscription.unsubscribe();
  }

}
