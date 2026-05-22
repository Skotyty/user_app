import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map, of, tap, throwError } from 'rxjs';

import { User, UserPayload } from '../models/user.model';

const API_URL = 'https://jsonplaceholder.typicode.com/users';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly http = inject(HttpClient);

  getAll(): Observable<User[]> {
    return this.http.get<User[]>(API_URL).pipe(map((list) => this.applyLocalChanges(list)));
  }

  getById(id: number): Observable<User> {
    if (this.isDeleted(id)) {
      return throwError(() => new Error('not found'));
    }

    const created = this.readCreated().find((u) => u.id === id);
    if (created) {
      return of(this.readOverride(created));
    }

    return this.http.get<User>(`${API_URL}/${id}`).pipe(map((user) => this.readOverride(user)));
  }

  create(data: UserPayload): Observable<User> {
    const user: User = { id: this.newLocalId(), ...data };

    return this.http.post(API_URL, data).pipe(
      map(() => user),
      tap(() => this.writeCreated([...this.readCreated(), user])),
    );
  }

  update(id: number, data: UserPayload): Observable<User> {
    const user: User = { id, ...data };
    const save = () => this.writeOverride(user);

    if (id < 0) {
      return of(user).pipe(tap(() => {
        save();
        this.patchCreated(user);
      }));
    }

    return this.http.put(`${API_URL}/${id}`, user).pipe(
      map(() => user),
      tap(save),
    );
  }

  remove(id: number): Observable<void> {
    const save = () => {
      if (id < 0) {
        this.writeCreated(this.readCreated().filter((u) => u.id !== id));
      } else {
        this.writeDeleted([...this.readDeleted(), id]);
      }
      this.dropOverride(id);
    };

    if (id < 0) {
      return of(undefined).pipe(tap(save));
    }

    return this.http.delete<void>(`${API_URL}/${id}`).pipe(tap(save));
  }

  private applyLocalChanges(list: User[]): User[] {
    const deleted = new Set(this.readDeleted());
    const fromApi = list.filter((u) => !deleted.has(u.id)).map((u) => this.readOverride(u));
    const created = this.readCreated()
      .filter((u) => !deleted.has(u.id))
      .map((u) => this.readOverride(u));

    return [...fromApi, ...created];
  }

  private readOverride(user: User): User {
    return this.readOverrides()[user.id] ?? user;
  }

  private patchCreated(user: User): void {
    this.writeCreated(this.readCreated().map((u) => (u.id === user.id ? user : u)));
  }

  private newLocalId(): number {
    const ids = this.readCreated().map((u) => u.id);
    const min = ids.length ? Math.min(...ids) : 0;
    return min < 0 ? min - 1 : -1;
  }

  private isDeleted(id: number): boolean {
    return this.readDeleted().includes(id);
  }

  private readDeleted(): number[] {
    return this.load<number[]>('users-app-deleted-ids', []);
  }

  private writeDeleted(ids: number[]): void {
    this.save('users-app-deleted-ids', ids);
  }

  private readOverrides(): Record<number, User> {
    return this.load<Record<number, User>>('users-app-overrides', {});
  }

  private writeOverride(user: User): void {
    const all = this.readOverrides();
    all[user.id] = user;
    this.save('users-app-overrides', all);
  }

  private dropOverride(id: number): void {
    const all = this.readOverrides();
    delete all[id];
    this.save('users-app-overrides', all);
  }

  private readCreated(): User[] {
    return this.load<User[]>('users-app-created', []);
  }

  private writeCreated(users: User[]): void {
    this.save('users-app-created', users);
  }

  private load<T>(key: string, fallback: T): T {
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : fallback;
    } catch {
      return fallback;
    }
  }

  private save(key: string, value: unknown): void {
    localStorage.setItem(key, JSON.stringify(value));
  }
}
