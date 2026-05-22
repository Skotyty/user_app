import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { finalize } from 'rxjs';

import { UserPayload } from '../../models/user.model';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-user-form',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzSpinModule,
  ],
  templateUrl: './user-form.html',
  styleUrl: './user-form.scss',
})
export class UserForm implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly usersApi = inject(UserService);
  private readonly message = inject(NzMessageService);

  loading = false;
  saving = false;
  userId: number | null = null;
  private saved: UserPayload | null = null;

  form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    username: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: [''],
    website: [''],
  });

  get isEdit(): boolean {
    return this.userId !== null;
  }

  get title(): string {
    return this.isEdit ? 'Редактирование' : 'Новый пользователь';
  }

  get canSave(): boolean {
    if (this.loading || this.saving || this.form.invalid) {
      return false;
    }
    if (!this.isEdit) {
      return true;
    }
    return this.formChanged();
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      return;
    }

    this.userId = Number(id);
    this.loading = true;

    this.usersApi
      .getById(this.userId)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (user) => {
          this.form.reset(user);
          this.saved = this.form.getRawValue();
        },
        error: () => {
          this.message.error('Пользователь не найден');
          this.router.navigate(['/users']);
        },
      });
  }

  submit(): void {
    if (!this.canSave) {
      this.form.markAllAsTouched();
      return;
    }

    const data = this.form.getRawValue();
    this.saving = true;

    const req = this.isEdit
      ? this.usersApi.update(this.userId!, data)
      : this.usersApi.create(data);

    req.pipe(finalize(() => (this.saving = false))).subscribe({
      next: (user) => {
        this.message.success(this.isEdit ? 'Сохранено' : 'Создано');
        this.router.navigate(['/users', user.id]);
      },
      error: () => this.message.error('Не удалось сохранить'),
    });
  }

  private formChanged(): boolean {
    if (!this.saved) {
      return false;
    }
    const v = this.form.getRawValue();
    return (
      v.name !== this.saved.name ||
      v.username !== this.saved.username ||
      v.email !== this.saved.email ||
      v.phone !== this.saved.phone ||
      v.website !== this.saved.website
    );
  }
}
