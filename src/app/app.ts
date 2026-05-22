import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { NzLayoutModule } from 'ng-zorro-antd/layout';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, NzLayoutModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}
