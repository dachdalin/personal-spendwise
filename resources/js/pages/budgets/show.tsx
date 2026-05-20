import { Form, Head, Link } from '@inertiajs/react';
import { Pencil, Trash2 } from 'lucide-react';
import BudgetController from '@/actions/App/Http/Controllers/BudgetController';
import {
    formatBudgetAmount,
    formatBudgetDate,
} from '@/components/budgets/budget-format';
import CategoryIcon from '@/components/categories/category-icon';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { edit, index, show } from '@/routes/budgets';
import type { Budget } from '@/types';

type PageProps = {
    budget: Budget;
};

export default function BudgetsShow({ budget }: PageProps) {
    return (
        <>
            <Head title={`${budget.category.name} budget`} />

            <div className="space-y-6 p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <Heading
                        title={`${budget.category.name} budget`}
                        description="Budget details."
                    />
                    <div className="flex gap-2">
                        <Button variant="outline" asChild>
                            <Link href={edit(budget)}>
                                <Pencil />
                                Edit
                            </Link>
                        </Button>
                        <Form action={BudgetController.destroy(budget)}>
                            <Button variant="destructive">
                                <Trash2 />
                                Delete
                            </Button>
                        </Form>
                    </div>
                </div>

                <dl className="grid max-w-2xl gap-4 rounded-lg border p-4 sm:grid-cols-2">
                    <div>
                        <dt className="text-sm text-muted-foreground">
                            Category
                        </dt>
                        <dd className="flex items-center gap-2 font-medium">
                            <span
                                className="flex size-7 items-center justify-center rounded-md border"
                                style={{
                                    backgroundColor:
                                        budget.category.color ?? '#f3f4f6',
                                }}
                            >
                                <CategoryIcon
                                    name={budget.category.icon}
                                    className="size-4"
                                />
                            </span>
                            {budget.category.name}
                        </dd>
                    </div>
                    <div>
                        <dt className="text-sm text-muted-foreground">
                            Amount
                        </dt>
                        <dd className="font-medium">
                            {formatBudgetAmount(budget.amount)}
                        </dd>
                    </div>
                    <div>
                        <dt className="text-sm text-muted-foreground">Date</dt>
                        <dd className="font-medium">
                            {formatBudgetDate(budget.date)}
                        </dd>
                    </div>
                </dl>
            </div>
        </>
    );
}

BudgetsShow.layout = ({ budget }: PageProps) => ({
    breadcrumbs: [
        {
            title: 'Budgets',
            href: index(),
        },
        {
            title: budget.category.name,
            href: show(budget),
        },
    ],
});
