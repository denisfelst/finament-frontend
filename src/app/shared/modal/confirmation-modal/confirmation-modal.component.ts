import { Component, input, output } from '@angular/core';
import { ButtonType } from '../../models/button-type.enum';
import { ButtonSize } from '../../models/button-size.enum';
import { ButtonComponent } from '../../elements/button/button.component';

@Component({
  selector: 'app-confirmation-modal',
  imports: [ButtonComponent],
  templateUrl: './confirmation-modal.component.html',
  styleUrl: './confirmation-modal.component.scss',
})
export class ConfirmationFullModalComponent {
  open = input.required<boolean>();
  cancelText = input<string>('Cancel');
  yesText = input<string>('Yes');
  mainText = input<string>('Are you sure?');

  submission = output<boolean>();

  ButtonSize = ButtonSize;
  ButtonType = ButtonType;

  onCancel() {
    this.submission.emit(false);
  }

  onYes() {
    this.submission.emit(true);
  }
}
