import { effect, inject, Injectable, signal } from '@angular/core';
import { CategoryService } from '../api';
import { CreateCategoryDto, UpdateCategoryDto } from '../api';
import { ICategory } from '../feature/models/category.interface';

@Injectable({ providedIn: 'root' })
export class CategoryStore {
  // state
  categories = signal<ICategory[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  message = signal<string | null>(null);

  private api = inject(CategoryService);

  private readonly userId = 1; // TODO: remove when auth exists

  constructor() {
    effect(() => {
      if (this.message()) {
        setTimeout(() => this.message.set(null), 3000);
      }
      if (this.error()) {
        setTimeout(() => this.error.set(null), 5000);
      }
    });
  }

  // ---- queries ----

  load() {
    this.loading.set(true);
    this.error.set(null);

    this.api.getApiCategories(this.userId).subscribe({
      next: (res) => {
        this.categories.set(res);
        this.loading.set(false);
      },
      error: (e) => {
        this.error.set('Error loading categories');
        console.error('Error: ', e);
        this.loading.set(false);
      },
    });
  }

  // ---- mutations ----

  create(dto: CreateCategoryDto) {
    this.loading.set(true);

    return this.api
      .postApiCategories({
        ...dto,
        userId: this.userId,
      })
      .subscribe({
        next: () => {
          this.message.set('Category created successfully');
          this.load();
        },
        error: (e) => {
          this.error.set('Failed to create category');
          console.error('Error: ', e);
          this.loading.set(false);
        },
      });
  }

  update(id: number, dto: UpdateCategoryDto) {
    this.loading.set(true);
    return this.api.putApiCategories(id, dto).subscribe({
      next: () => {
        this.message.set('Category updated successfully');
        this.load();
      },
      error: (e) => {
        this.error.set('Failed to update category');
        console.error('Error: ', e);
        this.loading.set(false);
      },
    });
  }

  delete(id: number) {
    this.loading.set(true);
    return this.api.deleteApiCategories(id).subscribe({
      next: () => {
        this.message.set('Category deleted successfully');
        this.load();
      },
      error: (e) => {
        this.error.set('Failed to delete category');
        console.error('Error: ', e);
        this.loading.set(false);
      },
    });
  }
}
