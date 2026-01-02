export interface IExpense {
  id: number;
  categoryId: number;
  amount: number;
  date: string;
  tag: string | null;
}
