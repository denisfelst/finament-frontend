import { Component, computed, inject, signal } from '@angular/core';
import {
  CategoryService,
  CreateCategoryDto,
  UpdateCategoryDto,
} from '../../api';
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
  saved = signal(false);
  savedMessage = signal('');

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
    // alphabetical order
    return [...this.categories()].sort((a, b) =>
      a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })
    );
  });

  ngOnInit() {
    this.loadCategories();
  }

  private findCategory(id: number) {
    // id = 0 for new categories
    if (id === 0) {
      return {} as ICategory;
    }
    return this.categories().find((cat) => cat.id === id) ?? null;
  }

  private loadCategories() {
    // TODO: loadCategories should exist in our service. create custom service
    this.loading.set(true);
    this.error.set(null);

    // TODO: hardcoded until auth
    this.categoryService.getApiCategories(1).subscribe({
      next: (res: ICategory[]) => {
        console.log(res);
        this.categories.set(res);
        this.loading.set(false);
      },
      error: (e) => {
        this.error.set('Failed to load categories: ' + e);
        this.loading.set(false);
      },
    });
  }

  private updateCategory() {
    const payload: UpdateCategoryDto = {
      name: this.name(),
      monthlyLimit: this.monthlyLimit(),
      color: this.color(),
    };

    this.categoryService
      .putApiCategories(this.currentCategory()!.id, payload)
      .subscribe({
        next: () => {
          this.saved.set(true);
          this.savedMessage.set('Category updated successfully');
          this.loadCategories();
          setTimeout(() => {
            this.saved.set(false);
          }, 3000);
        },
        error: (e) => {
          this.error.set('Failed to save category ' + e);
          console.error(e);
        },
      });
  }

  private createCategory() {
    const payload: CreateCategoryDto = {
      userId: 1, // TODO: hardcoded until auth
      name: this.name(),
      monthlyLimit: this.monthlyLimit(),
      color: this.color(),
    };

    this.categoryService.postApiCategories(payload).subscribe({
      next: () => {
        this.saved.set(true);
        this.savedMessage.set('Category created successfully');
        this.loadCategories();
        setTimeout(() => {
          this.saved.set(false);
        }, 3000);
      },
      error: (e) => {
        this.error.set('Failed to save category');
        console.error(e);
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
    this.error.set(null);
    this.loading.set(true);

    const isNewCategory = !!!this.currentCategory()?.id;

    if (isNewCategory) {
      this.createCategory();
    } else {
      this.updateCategory();
    }
  }

  onDelete() {
    this.error.set(null);

    this.categoryService
      .deleteApiCategories(this.currentCategory()!.id)
      .subscribe({
        next: () => {
          this.saved.set(true);
          this.savedMessage.set('Category deleted successfully');

          this.loadCategories();
          this.setModal(null);
          setTimeout(() => {
            this.saved.set(false);
          }, 3000);
        },
        error: (e) => {
          this.error.set('Failed to delete category');
          console.error(e);
        },
      });
  }
}
