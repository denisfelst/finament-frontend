import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-full-modal',
  imports: [],
  templateUrl: './full-modal.component.html',
  styleUrl: './full-modal.component.scss',
})
export class FullFullModalComponent {
  name = input<string>('');
  open = input.required<boolean>();
  close = output<void>();

  onBackdropClick() {
    console.log('onBackdropClick :');
    this.close.emit();
  }
}
