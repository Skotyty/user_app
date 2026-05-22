import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { finalize } from 'rxjs';

import { userInitials } from '../../shared/user.utils';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-user-detail',
  imports: [RouterLink, NzButtonModule, NzPopconfirmModule, NzSpinModule],
  templateUrl: './user-detail.html',
  styleUrl: './user-detail.scss',
})
export class UserDetail implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly usersApi = inject(UserService);
  private readonly message = inject(NzMessageService);

  initials = userInitials;

  user: User | null = null;
  loading = false;

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loading = true;

    this.usersApi
      .getById(id)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (user) => (this.user = user),
        error: () => {
          this.message.error('Пользователь не найден');
          this.router.navigate(['/users']);
        },
      });
  }

  remove(): void {
    if (!this.user) return;

    this.usersApi.remove(this.user.id).subscribe({
      next: () => {
        this.message.success('Пользователь удалён');
        this.router.navigate(['/users']);
      },
      error: () => this.message.error('Не удалось удалить'),
    });
  }

  websiteUrl(url: string): string {
    return url.startsWith('http') ? url : `https://${url}`;
  }
}
