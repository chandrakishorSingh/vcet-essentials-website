import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HomeComponent} from './home/home.component';
import {AuthGuard} from './guards/auth.guard';
import {HomeGuard} from './guards/home.guard';
import {LoginComponent} from './auth/login/login.component';
import {PostComponent} from './post/post/post.component';


const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/home'  },
  { path: 'home', component: HomeComponent, canActivate: [HomeGuard], children: [
      { path: 'new/:postType', component: PostComponent }
    ]
  },
  { path: 'auth', component: LoginComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
