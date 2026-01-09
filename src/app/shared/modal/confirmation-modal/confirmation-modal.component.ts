import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-confirmation-modal',
  imports: [],
  templateUrl: './confirmation-modal.component.html',
  styleUrl: './confirmation-modal.component.scss',
})
export class ConfirmationFullModalComponent {
  open = input.required<boolean>();
  cancelText = input<string>('Cancel');
  yesText = input<string>('Yes');
  mainText = input<string>('Are you sure?');

  submission = output<boolean>();

  onCancel() {
    this.submission.emit(false);
  }

  onYes() {
    this.submission.emit(true);
  }
}
