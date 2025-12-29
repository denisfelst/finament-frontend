import { Component, computed, inject, signal } from '@angular/core';
import { CategoryService, UpdateCategoryDto } from '../../api';
import { ModalComponent } from '../../shared/modal/modal.component';
import { ICategory } from '../models/category.interface';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-categories',
  imports: [ModalComponent, ReactiveFormsModule],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss',
})
export class CategoriesComponent {
  private categoryService = inject(CategoryService);
  private formBuilder = inject(FormBuilder);

  categories = signal<ICategory[]>([]);
  currentModal = signal<string | null>(null);
  currentCategory = signal<ICategory | null>(null);

  loading = signal(false);
  error = signal<string | null>(null);
  saving = signal(false);
  saved = signal(false);

  form = computed(() => {
    return this.formBuilder.group({
      name: [this.currentCategory()?.name ?? ''],
      monthlyLimit: [
        this.currentCategory()?.monthlyLimit ?? 100,
        Validators.required,
      ],
      color: [this.currentCategory()?.color ?? '#FFFFFF', Validators.required],
    });
  });

  name = computed(() => this.form().get('name')?.value ?? '');
  monthlyLimit = computed(() => this.form().get('monthlyLimit')?.value ?? 100);
  color = computed(() => this.form().get('color')?.value ?? '#FFFFFF');

  orderedCategories = computed(() => {
    // ascending based on ID
    return [...this.categories()].sort((a, b) => a.id - b.id);
  });

  ngOnInit() {
    this.loadCategories();
  }

  private findCategory(id: number) {
    return this.categories().find((cat) => cat.id === id) ?? null;
  }

  private loadCategories() {
    // TODO: loadCategories should exist in our service. create custom service
    this.loading.set(true);
    this.error.set(null);

    this.categoryService.getApiCategories(1).subscribe({
      // TODO: hardcoded until auth
      next: (res: ICategory[]) => {
        console.log(res);
        this.categories.set(res);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Error loading categories');
        this.loading.set(false);
      },
    });
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
    this.saving.set(true);
    this.error.set(null);

    const payload: UpdateCategoryDto = {
      name: this.name(),
      monthlyLimit: this.monthlyLimit(),
      color: this.color(),
    };

    this.categoryService
      .putApiCategories(this.currentCategory()!.id, payload)
      .subscribe({
        // TODO: until auth
        next: () => {
          this.saving.set(false);
          this.saved.set(true);
          setTimeout(() => {
            this.saved.set(false);
          }, 3000);
        },
        error: (e) => {
          this.error.set('Failed saving category');
          console.error(e);
          this.saving.set(false);
        },
      });
  }
}
