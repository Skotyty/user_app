import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzTableModule } from 'ng-zorro-antd/table';
import { finalize } from 'rxjs';

import { userInitials } from '../../shared/user.utils';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';

const PAGE_SIZE = 5;

@Component({
  selector: 'app-user-list',
  imports: [
    RouterLink,
    FormsModule,
    NzTableModule,
    NzButtonModule,
    NzInputModule,
    NzPaginationModule,
    NzPopconfirmModule,
    NzSpinModule,
    NzEmptyModule,
  ],
  templateUrl: './user-list.html',
  styleUrl: './user-list.scss',
})
export class UserList implements OnInit {
  private readonly usersApi = inject(UserService);
  private readonly message = inject(NzMessageService);

  initials = userInitials;

  users: User[] = [];
  filtered: User[] = [];
  loading = false;
  search = '';
  pageIndex = 1;
  pageSize = PAGE_SIZE;

  ngOnInit(): void {
    this.load();
  }

  get pageItems(): User[] {
    const start = (this.pageIndex - 1) * this.pageSize;
    return this.filtered.slice(start, start + this.pageSize);
  }

  onSearch(): void {
    const q = this.search.trim().toLowerCase();
    if (!q) {
      this.filtered = [...this.users];
    } else {
      this.filtered = this.users.filter(
        (u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q),
      );
    }
    this.pageIndex = 1;
  }

  onPageChange(page: number): void {
    this.pageIndex = page;
  }

  remove(id: number): void {
    this.usersApi.remove(id).subscribe({
      next: () => {
        this.users = this.users.filter((u) => u.id !== id);
        this.onSearch();
        const maxPage = Math.max(1, Math.ceil(this.filtered.length / this.pageSize));
        if (this.pageIndex > maxPage) {
          this.pageIndex = maxPage;
        }
        this.message.success('Пользователь удалён');
      },
      error: () => this.message.error('Не удалось удалить'),
    });
  }

  private load(): void {
    this.loading = true;
    this.usersApi
      .getAll()
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (list) => {
          this.users = list;
          this.filtered = [...list];
        },
        error: () => this.message.error('Не удалось загрузить список'),
      });
  }
}
