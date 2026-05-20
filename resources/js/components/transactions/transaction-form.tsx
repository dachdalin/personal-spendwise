import { Form, Link } from '@inertiajs/react';
import { useState } from 'react';
import TransactionController from '@/actions/App/Http/Controllers/TransactionController';
import { formatBudgetAmount, formatBudgetDate } from '@/components/budgets/budget-format';
import CategoryIcon from '@/components/categories/category-icon';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { index } from '@/routes/transactions';
import type {
    Transaction,
    TransactionBudget,
    TransactionCategory,
} from '@/types';

type TransactionFormProps = {
    transaction?: Transaction;
    categories: TransactionCategory[];
    budgets: TransactionBudget[];
    variant?: 'page' | 'modal';
};

export default function TransactionForm({
    transaction,
    categories,
    budgets,
    variant = 'page',
}: TransactionFormProps) {
    const [categoryId, setCategoryId] = useState(
        transaction?.category_id ? String(transaction.category_id) : '',
    );
    const [budgetId, setBudgetId] = useState(
        transaction?.budget_id ? String(transaction.budget_id) : '',
    );
    const action = transaction
        ? TransactionController.update(transaction)
        : TransactionController.store();

    return (
        <Form
            action={action}
            options={{ preserveScroll: true }}
            className="max-w-2xl space-y-6"
        >
            {({ processing, errors }) => (
                <>
                    <div className="grid gap-2">
                        <Label htmlFor="title">Title</Label>
                        <Input
                            id="title"
                            name="title"
                            defaultValue={transaction?.title}
                            placeholder="Grocery shopping"
                            required
                        />
                        <InputError message={errors.title} />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <SelectField
                            id="type"
                            name="type"
                            label="Type"
                            defaultValue={transaction?.type ?? 'expense'}
                            error={errors.type}
                        >
                            <option value="expense">Expense</option>
                            <option value="income">Income</option>
                        </SelectField>

                        <SelectField
                            id="category_id"
                            name="category_id"
                            label="Category"
                            value={categoryId}
                            onChange={(value) => setCategoryId(value)}
                            error={errors.category_id}
                        >
                            <option value="" disabled>
                                Choose category
                            </option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </SelectField>
                    </div>

                    <SelectField
                        id="budget_id"
                        name="budget_id"
                        label="Budget"
                        value={budgetId}
                        onChange={(value) => setBudgetId(value)}
                        error={errors.budget_id}
                    >
                        <option value="" disabled>
                            Choose budget
                        </option>
                        {budgets.map((budget) => (
                            <option key={budget.id} value={budget.id}>
                                {budget.category.name} ·{' '}
                                {formatBudgetAmount(budget.amount)} ·{' '}
                                {formatBudgetDate(budget.date)}
                            </option>
                        ))}
                    </SelectField>

                    <SelectedBudgetPreview budgets={budgets} budgetId={budgetId} />

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="amount">Amount</Label>
                            <Input
                                id="amount"
                                name="amount"
                                type="number"
                                min="0.01"
                                step="0.01"
                                defaultValue={transaction?.amount}
                                placeholder="25.00"
                                required
                            />
                            <InputError message={errors.amount} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="date">Date</Label>
                            <Input
                                id="date"
                                name="date"
                                type="date"
                                defaultValue={transaction?.date?.slice(0, 10)}
                                required
                            />
                            <InputError message={errors.date} />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="description">Description</Label>
                        <textarea
                            id="description"
                            name="description"
                            defaultValue={transaction?.description ?? ''}
                            rows={3}
                            className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring rounded-md border px-3 py-2 text-sm shadow-xs outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                        />
                        <InputError message={errors.description} />
                    </div>

                    <div className="flex items-center gap-3">
                        <Button disabled={processing}>Save</Button>
                        <CancelButton variant={variant} />
                    </div>
                </>
            )}
        </Form>
    );
}

function SelectField({
    id,
    name,
    label,
    children,
    error,
    value,
    defaultValue,
    onChange,
}: {
    id: string;
    name: string;
    label: string;
    children: React.ReactNode;
    error?: string;
    value?: string;
    defaultValue?: string;
    onChange?: (value: string) => void;
}) {
    return (
        <div className="grid gap-2">
            <Label htmlFor={id}>{label}</Label>
            <select
                id={id}
                name={name}
                value={value}
                defaultValue={defaultValue}
                onChange={(event) => onChange?.(event.target.value)}
                required
                className="border-input bg-background ring-offset-background focus-visible:ring-ring h-9 rounded-md border px-3 text-sm shadow-xs outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
            >
                {children}
            </select>
            <InputError message={error} />
        </div>
    );
}

function SelectedBudgetPreview({
    budgets,
    budgetId,
}: {
    budgets: TransactionBudget[];
    budgetId: string;
}) {
    const budget = budgets.find((item) => String(item.id) === budgetId);

    if (!budget) {
        return null;
    }

    return (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span
                className="flex size-7 items-center justify-center rounded-md border"
                style={{ backgroundColor: budget.category.color ?? '#f3f4f6' }}
            >
                <CategoryIcon name={budget.category.icon} className="size-4" />
            </span>
            {budget.category.name} · {formatBudgetAmount(budget.amount)}
        </div>
    );
}

function CancelButton({ variant }: { variant: 'page' | 'modal' }) {
    if (variant === 'modal') {
        return (
            <DialogClose asChild>
                <Button type="button" variant="outline">
                    Cancel
                </Button>
            </DialogClose>
        );
    }

    return (
        <Button variant="outline" asChild>
            <Link href={index()}>Cancel</Link>
        </Button>
    );
}
