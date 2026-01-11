import { Component, input, output } from '@angular/core';
import { ButtonTypeEnum } from '../../models/button-type.enum';
import { ButtonSizeEnum } from '../../models/button-size.enum';

@Component({
  selector: 'app-button',
  imports: [],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
})
export class ButtonComponent {
  // inputs
  disabled = input<boolean>(false);
  design = input<ButtonTypeEnum>(ButtonTypeEnum.Primary);
  size = input<ButtonSizeEnum>(ButtonSizeEnum.Medium); // mobile-first default
  type = input<'button' | 'submit' | 'reset'>('button');
  popoverTarget = input<string | null>(null);

  // outputs
  clicked = output<MouseEvent>();
  hovered = output<MouseEvent>();
  left = output<MouseEvent>();

  ButtonType = ButtonTypeEnum;
  ButtonSize = ButtonSizeEnum;

  onClick(event: MouseEvent) {
    if (this.disabled()) {
      event.preventDefault();
      return;
    }
    this.clicked.emit(event);
  }

  onMouseEnter(event: MouseEvent) {
    this.hovered.emit(event);
  }

  onMouseLeave(event: MouseEvent) {
    this.left.emit(event);
  }
}
