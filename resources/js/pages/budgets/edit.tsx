import { Head } from '@inertiajs/react';
import BudgetForm from '@/components/budgets/budget-form';
import Heading from '@/components/heading';
import { edit } from '@/routes/budgets';
import type { Budget, BudgetCategory } from '@/types';

type PageProps = {
    budget: Budget;
    categories: BudgetCategory[];
};

export default function BudgetsEdit({ budget, categories }: PageProps) {
    return (
        <>
            <Head title={`Edit ${budget.category.name} budget`} />

            <div className="space-y-6 p-4">
                <Heading
                    title="Edit budget"
                    description="Update budget amount, category, or date."
                />
                <BudgetForm budget={budget} categories={categories} />
            </div>
        </>
    );
}

BudgetsEdit.layout = ({ budget }: PageProps) => ({
    breadcrumbs: [
        {
            title: 'Edit budget',
            href: edit(budget),
        },
    ],
});
