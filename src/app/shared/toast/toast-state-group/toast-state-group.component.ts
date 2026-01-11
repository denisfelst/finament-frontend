import { Component, input } from '@angular/core';
import { MessageComponent } from '../message/message.component';
import { ErrorComponent } from '../error/error.component';
import { LoadingComponent } from '../loading/loading.component';

@Component({
  selector: 'app-toast-state-group',
  imports: [MessageComponent, ErrorComponent, LoadingComponent],
  templateUrl: './toast-state-group.component.html',
  styleUrl: './toast-state-group.component.scss',
})
export class ToastStateGroupComponent {
  error = input<string | null>(null);
  loading = input<boolean>(false);
  message = input<string | null>(null);
}
