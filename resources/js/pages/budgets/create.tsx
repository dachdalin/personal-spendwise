import { Head } from '@inertiajs/react';
import BudgetForm from '@/components/budgets/budget-form';
import Heading from '@/components/heading';
import { create } from '@/routes/budgets';
import type { BudgetCategory } from '@/types';

type PageProps = {
    categories: BudgetCategory[];
};

export default function BudgetsCreate({ categories }: PageProps) {
    return (
        <>
            <Head title="Create budget" />

            <div className="space-y-6 p-4">
                <Heading
                    title="Create budget"
                    description="Set a budget amount for a category and date."
                />
                <BudgetForm categories={categories} />
            </div>
        </>
    );
}

BudgetsCreate.layout = {
    breadcrumbs: [
        {
            title: 'Create budget',
            href: create(),
        },
    ],
};
