import { effect, inject, Injectable, signal } from '@angular/core';
import { CategoryService } from '../../core/swagger';
import { CreateCategoryDto, UpdateCategoryDto } from '../../core/swagger';
import { ICategory } from '../../features/categories/models/category.interface';

@Injectable({ providedIn: 'root' })
export class CategoryStore {
  private api = inject(CategoryService);

  // state
  categories = signal<ICategory[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  message = signal<string | null>(null);

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

    this.api.getApiCategories().subscribe({
      next: (res) => {
        this.categories.set(res);
        console.log('res :', res);
        this.loading.set(false);
      },
      error: (e) => {
        this.error.set('Error loading categories: ' + e.body.message);
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
      })
      .subscribe({
        next: () => {
          this.message.set('Category created successfully');
          this.load();
        },
        error: (e) => {
          this.error.set('Failed to create category: ' + e.body.message);
          console.error('Error: ', e);
          this.loading.set(false);
        },
      });
  }

  update(id: number, dto: UpdateCategoryDto) {
    if (!id) {
      this.error.set('No selected category!');
    }

    this.loading.set(true);
    return this.api.putApiCategories(id, dto).subscribe({
      next: () => {
        this.message.set('Category updated successfully');
        this.load();
        this.loading.set(false);
      },
      error: (e) => {
        this.error.set('Failed to update category: ' + e.body.message);
        console.error('Error: ', e);
        this.loading.set(false);
      },
    });
  }

  delete(id: number) {
    if (!id) {
      this.error.set('No selected category!');
    }

    this.loading.set(true);
    return this.api.deleteApiCategories(id).subscribe({
      next: () => {
        this.message.set('Category deleted successfully');
        this.load();
        this.loading.set(false);
      },
      error: (e) => {
        this.error.set('Failed to delete category: ' + e.body.message);
        console.error('Error: ', e.message);
        this.loading.set(false);
      },
    });
  }
}
