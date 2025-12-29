import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-modal',
  imports: [],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss',
})
export class ModalComponent {
  name = input<string>('');
  open = input.required<boolean>();
  close = output<void>();

  onBackdropClick() {
    this.close.emit();
  }
}
