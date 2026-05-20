import { Form, Link } from '@inertiajs/react';
import { useState } from 'react';
import BudgetController from '@/actions/App/Http/Controllers/BudgetController';
import CategoryIcon from '@/components/categories/category-icon';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { index } from '@/routes/budgets';
import type { Budget, BudgetCategory } from '@/types';

type BudgetFormProps = {
    budget?: Budget;
    categories: BudgetCategory[];
    variant?: 'page' | 'modal';
};

export default function BudgetForm({
    budget,
    categories,
    variant = 'page',
}: BudgetFormProps) {
    const [categoryId, setCategoryId] = useState(
        budget?.category_id ? String(budget.category_id) : '',
    );
    const action = budget
        ? BudgetController.update(budget)
        : BudgetController.store();

    return (
        <Form
            action={action}
            options={{ preserveScroll: true }}
            className="max-w-2xl space-y-6"
        >
            {({ processing, errors }) => (
                <>
                    <div className="grid gap-2">
                        <Label htmlFor="category_id">Category</Label>
                        <select
                            id="category_id"
                            name="category_id"
                            value={categoryId}
                            onChange={(event) =>
                                setCategoryId(event.target.value)
                            }
                            required
                            className="border-input bg-background ring-offset-background focus-visible:ring-ring h-9 rounded-md border px-3 text-sm shadow-xs outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                        >
                            <option value="" disabled>
                                Choose category
                            </option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                        <InputError message={errors.category_id} />
                    </div>

                    <SelectedCategoryPreview
                        categories={categories}
                        categoryId={categoryId}
                    />

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="amount">Amount</Label>
                            <Input
                                id="amount"
                                name="amount"
                                type="number"
                                min="0.01"
                                step="0.01"
                                defaultValue={budget?.amount}
                                placeholder="1000.00"
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
                                defaultValue={budget?.date?.slice(0, 10)}
                                required
                            />
                            <InputError message={errors.date} />
                        </div>
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

function SelectedCategoryPreview({
    categories,
    categoryId,
}: {
    categories: BudgetCategory[];
    categoryId: string;
}) {
    const category = categories.find((item) => String(item.id) === categoryId);

    if (!category) {
        return null;
    }

    return (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span
                className="flex size-7 items-center justify-center rounded-md border"
                style={{ backgroundColor: category.color ?? '#f3f4f6' }}
            >
                <CategoryIcon name={category.icon} className="size-4" />
            </span>
            {category.name}
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
