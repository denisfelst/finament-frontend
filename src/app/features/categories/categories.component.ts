import { Component, computed, effect, inject, signal } from '@angular/core';
import { CreateCategoryDto, UpdateCategoryDto } from '../../core/swagger';
import { ICategory } from './models/category.interface';
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { CategoryStore } from '../../shared/store/category.store';
import { FullFullModalComponent } from '../../shared/modal/full-modal/full-modal.component';
import { ConfirmationFullModalComponent } from '../../shared/modal/confirmation-modal/confirmation-modal.component';
import { ButtonComponent } from '../../shared/elements/button/button.component';
import { ButtonSizeEnum } from '../../shared/models/button-size.enum';
import { ButtonTypeEnum } from '../../shared/models/button-type.enum';
import { ToastStateGroupComponent } from '../../shared/toast/toast-state-group/toast-state-group.component';
import { CurrencyPipe } from '../../shared/pipes/currency.pipe';

@Component({
  selector: 'app-categories',
  imports: [
    FullFullModalComponent,
    ReactiveFormsModule,
    ConfirmationFullModalComponent,
    ButtonComponent,
    ToastStateGroupComponent,
    CurrencyPipe,
  ],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss',
})
export class CategoriesComponent {
  private categoryStore = inject(CategoryStore);
  private formBuilder = inject(FormBuilder);

  currentModal = signal<string | null>(null);
  currentCategory = signal<ICategory | null>(null);

  categories = this.categoryStore.categories;
  loading = this.categoryStore.loading;
  error = this.categoryStore.error;
  message = this.categoryStore.message;
  confirmation = signal<boolean>(false);

  deleteWarning = computed(() =>
    this.currentCategory()
      ? this.currentCategory()!.expenseCount > 0 && this.confirmation()
      : false
  );

  deleteMainText = computed(() => {
    const name = this.currentCategory()?.name;
    const count = this.currentCategory()?.expenseCount;
    return this.deleteWarning()
      ? `Are you sure you want to delete category ${name}? This category contains ${count} expenses`
      : `Are you sure you want to delete category ${name}?`;
  });

  form = this.formBuilder.group({
    name: [
      null as string | null,
      [Validators.required, this.nameValidator.bind(this)],
    ],
    monthlyLimit: [
      null as number | null,
      [Validators.required, Validators.min(1)],
    ],
    color: [
      null as string | null,
      [Validators.required, this.hexColorValidator.bind(this)],
    ],
  });

  ButtonSize = ButtonSizeEnum;
  ButtonType = ButtonTypeEnum;

  constructor() {
    effect(() => {
      const category = this.currentCategory();
      this.form.patchValue({
        name: category?.name ?? null,
        monthlyLimit: category?.monthlyLimit ?? null,
        color: category?.color ?? null,
      });
    });
  }

  orderedCategories = computed(() => {
    // alphabetical order
    return [...this.categories()].sort((a, b) =>
      a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })
    );
  });

  private findCategory(id: number) {
    // id = 0 for new categories
    if (id === 0) {
      return {} as ICategory;
    }
    return this.categories().find((cat) => cat.id === id) ?? null;
  }

  private createCategory() {
    const payload: CreateCategoryDto = {
      name: this.form.value.name ?? null,
      monthlyLimit: this.form.value.monthlyLimit ?? 1,
      color: this.form.value.color ?? null,
    };
    this.categoryStore.create(payload);
  }

  private updateCategory() {
    const payload: UpdateCategoryDto = {
      name: this.form.value.name ?? null,
      monthlyLimit: this.form.value.monthlyLimit ?? 100,
      color: this.form.value.color ?? null,
    };
    this.categoryStore.update(this.currentCategory()!.id, payload);
  }

  private deleteCategory() {
    this.categoryStore.delete(this.currentCategory()!.id);
  }

  private hexColorValidator(control: FormControl): ValidationErrors | null {
    const value: string = control.value;
    if (!value) {
      return null;
    }
    const normalized = value.startsWith('#') ? value.slice(1) : value;
    const hexRegex: RegExp = /^[0-9A-Fa-f]{6}$/;
    return hexRegex.test(normalized) ? null : { invalidHexColor: true };
  }

  private nameValidator(control: FormControl): ValidationErrors | null {
    const value: string = control.value ?? '';

    if (!value.trim()) {
      return null;
    }

    return value.trim().length >= 3 ? null : { minLengthName: { min: 3 } };
  }

  ngOnInit() {
    this.categoryStore.load();
  }

  capitalizeName() {
    const control = this.form.controls.name;
    let value: string = control.value ?? '';

    if (!value.trim()) {
      control.setValue('');
      return;
    }

    const capitalized = value
      .trim()
      .split(/\s+/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');

    control.setValue(capitalized);
  }

  toHexFormat(): void {
    const control = this.form.controls.color;
    let value: string = control.value ?? '';

    if (!value.trim()) return;

    value = value.trim();

    if (!value.startsWith('#')) {
      value = `#${value}`;
    }

    // Update value first so validation re-runs
    control.setValue(value, { emitEvent: false });

    // Only capitalize if the value is valid
    if (!control.errors?.['invalidHexColor']) {
      control.setValue(value.toUpperCase());
    }
  }

  setModal(id: number | null) {
    if (id === null) {
      this.currentModal.set(null);
      this.currentCategory.set(null);
      return;
    }
    this.currentCategory.set(this.findCategory(id));
    this.currentModal.set(String(id));
  }

  onSubmit() {
    const isNewCategory = !!!this.currentCategory()?.id;

    if (isNewCategory) {
      this.createCategory();
    } else {
      this.updateCategory();
    }
  }

  handleDeletePress() {
    this.confirmation.set(true);
  }

  onDelete(confirmed: boolean) {
    if (!confirmed) {
      this.confirmation.set(false);
      return;
    }

    this.deleteCategory();
    this.confirmation.set(false);
  }
}
