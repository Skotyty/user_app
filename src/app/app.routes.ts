import { Routes } from '@angular/router';

import { UserDetail } from './pages/user-detail/user-detail';
import { UserForm } from './pages/user-form/user-form';
import { UserList } from './pages/user-list/user-list';

export const routes: Routes = [
  { path: '', redirectTo: 'users', pathMatch: 'full' },
  { path: 'users', component: UserList },
  { path: 'users/new', component: UserForm },
  { path: 'users/:id/edit', component: UserForm },
  { path: 'users/:id', component: UserDetail },
];
