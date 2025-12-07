import { Component, signal } from '@angular/core';
import { CategoryService } from '../../api';

@Component({
  selector: 'app-categories',
  imports: [],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss',
})
export class CategoriesComponent {
  categories = signal<any[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  constructor(private categoryService: CategoryService) {}

  ngOnInit() {
    this.loadCategories();
  }

  private loadCategories() {
    this.loading.set(true);
    this.error.set(null);

    this.categoryService.getApiCategories(1).subscribe({
      next: (res) => {
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
}
