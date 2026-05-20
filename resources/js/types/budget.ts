import type { Category, PaginationLink } from './category';

export type BudgetCategory = Pick<
    Category,
    'id' | 'name' | 'icon' | 'color'
>;

export type Budget = {
    id: number;
    category_id: number;
    category: Category;
    amount: string;
    date: string;
    created_at: string;
    updated_at: string;
};

export type PaginatedBudgets = {
    data: Budget[];
    links: PaginationLink[];
};
