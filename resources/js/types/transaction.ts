import type { User } from './auth';
import type { Budget, BudgetCategory } from './budget';
import type { Category, PaginationLink } from './category';

export type TransactionType = 'expense' | 'income';

export type Transaction = {
    id: number;
    title: string;
    category_id: number;
    budget_id: number;
    user_id: number;
    category: Category;
    budget: Budget;
    user: User;
    amount: string;
    description: string | null;
    type: TransactionType;
    date: string;
    created_at: string;
    updated_at: string;
};

export type TransactionBudget = Pick<
    Budget,
    'id' | 'category_id' | 'amount' | 'date' | 'category'
>;

export type TransactionCategory = BudgetCategory;

export type PaginatedTransactions = {
    data: Transaction[];
    links: PaginationLink[];
};
