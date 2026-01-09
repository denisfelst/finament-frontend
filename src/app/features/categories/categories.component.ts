import { Component, computed, inject, signal } from '@angular/core';
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
import { ErrorComponent } from '../../shared/toast/error/error.component';
import { LoadingComponent } from '../../shared/toast/loading/loading.component';
import { FullFullModalComponent } from '../../shared/modal/full-modal/full-modal.component';
import { ConfirmationFullModalComponent } from '../../shared/modal/confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'app-categories',
  imports: [
    FullFullModalComponent,
    ReactiveFormsModule,
    ErrorComponent,
    LoadingComponent,
    ConfirmationFullModalComponent,
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

  form = computed(() => {
    return this.formBuilder.group({
      name: [
        this.currentCategory()?.name ?? null,
        [Validators.required, this.nameValidator.bind(this)],
      ],
      monthlyLimit: [
        this.currentCategory()?.monthlyLimit ?? null,
        [Validators.required, Validators.min(1)],
      ],
      color: [
        this.currentCategory()?.color ?? null,
        [Validators.required, this.hexColorValidator.bind(this)],
      ],
    });
  });

  name = computed(() => this.form().get('name')?.value ?? 'name');
  monthlyLimit = computed(() => this.form().get('monthlyLimit')?.value ?? 100);
  color = computed(() => this.form().get('color')?.value ?? '#FFFFFF');

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
      name: this.name(),
      monthlyLimit: this.monthlyLimit(),
      color: this.color(),
    };

    this.categoryStore.create(payload);
  }

  private updateCategory() {
    const payload: UpdateCategoryDto = {
      name: this.name(),
      monthlyLimit: this.monthlyLimit(),
      color: this.color(),
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
    const control = this.form().controls.name;
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
    const control = this.form().controls.color;
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
