import { Form, Link } from '@inertiajs/react';
import BudgetController from '@/actions/App/Http/Controllers/BudgetController';
import CategoryIcon from '@/components/categories/category-icon';
import { Button } from '@/components/ui/button';
import { show } from '@/routes/budgets';
import type { Budget } from '@/types';
import { formatBudgetAmount, formatBudgetDate } from './budget-format';

type BudgetTableProps = {
    budgets: Budget[];
};

export default function BudgetTable({ budgets }: BudgetTableProps) {
    return (
        <div className="overflow-hidden rounded-lg border">
            <div className="grid grid-cols-[1fr_auto] border-b bg-muted/40 px-4 py-3 text-sm font-medium md:grid-cols-[1fr_10rem_10rem_8rem]">
                <span>Category</span>
                <span className="hidden md:block">Amount</span>
                <span className="hidden md:block">Date</span>
                <span className="text-right">Actions</span>
            </div>

            {budgets.length > 0 ? (
                budgets.map((budget) => (
                    <BudgetRow key={budget.id} budget={budget} />
                ))
            ) : (
                <div className="px-4 py-10 text-center text-sm text-muted-foreground">
                    No budgets yet.
                </div>
            )}
        </div>
    );
}

function BudgetRow({ budget }: { budget: Budget }) {
    return (
        <div className="grid grid-cols-[1fr_auto] items-center gap-3 border-b px-4 py-3 last:border-b-0 md:grid-cols-[1fr_10rem_10rem_8rem]">
            <div className="flex min-w-0 items-center gap-3">
                <span
                    className="flex size-9 shrink-0 items-center justify-center rounded-md border"
                    style={{
                        backgroundColor: budget.category.color ?? '#f3f4f6',
                    }}
                >
                    <CategoryIcon
                        name={budget.category.icon}
                        className="size-4"
                    />
                </span>
                <div className="min-w-0">
                    <Link
                        href={show(budget)}
                        className="truncate font-medium hover:underline"
                    >
                        {budget.category.name}
                    </Link>
                    <p className="truncate text-sm text-muted-foreground md:hidden">
                        {formatBudgetAmount(budget.amount)} ·{' '}
                        {formatBudgetDate(budget.date)}
                    </p>
                </div>
            </div>
            <span className="hidden text-sm text-muted-foreground md:block">
                {formatBudgetAmount(budget.amount)}
            </span>
            <span className="hidden text-sm text-muted-foreground md:block">
                {formatBudgetDate(budget.date)}
            </span>
            <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm" asChild>
                    <Link href={BudgetController.edit(budget)}>Edit</Link>
                </Button>
                <Form
                    action={BudgetController.destroy(budget)}
                    options={{ preserveScroll: true }}
                >
                    <Button variant="destructive" size="sm">
                        Delete
                    </Button>
                </Form>
            </div>
        </div>
    );
}
