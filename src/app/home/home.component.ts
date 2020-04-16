import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '../services/auth.service';
import {OrgModel} from '../models/org.model';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import {BottomSheetComponent} from '../material/bottom-sheet/bottom-sheet.component';
import {Subscription} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {POST_TYPE} from '../types/types';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  org: OrgModel;

  constructor(private authService: AuthService,
              private bottomSheet: MatBottomSheet,
              private router: Router,
              private activatedRoute: ActivatedRoute) {}

  async ngOnInit() {
    this.org = this.authService.getOrg();
  }

  onNewPost() {
    this.bottomSheet.open(BottomSheetComponent).afterDismissed().subscribe((data: { postType: POST_TYPE }) => {
      if (data) {
        this.router.navigate(['new', data.postType], { relativeTo: this.activatedRoute });
      }
    });
  }

  ngOnDestroy() {}

}
