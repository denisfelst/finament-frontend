import { Component, signal } from '@angular/core';
import { CategoryService } from '../../api';
import { ModalComponent } from '../../shared/modal/modal.component';

interface ICategory {
  id: number;
  name: string;
  monthlyLimit?: number;
  color?: string | null;
}

@Component({
  selector: 'app-categories',
  imports: [ModalComponent],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss',
})
export class CategoriesComponent {
  categories = signal<ICategory[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  currentModal = signal<string | null>(null);

  constructor(private categoryService: CategoryService) {}

  ngOnInit() {
    this.loadCategories();
  }

  private loadCategories() {
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

  setModal(name: string | null) {
    if (name === null) {
      this.currentModal.set(null);
      return;
    }
    this.currentModal.set(name);
  }
}
