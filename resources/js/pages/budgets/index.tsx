import { Head } from '@inertiajs/react';
import BudgetCreateDialog from '@/components/budgets/budget-create-dialog';
import BudgetTable from '@/components/budgets/budget-table';
import Heading from '@/components/heading';
import PaginationLinks from '@/components/pagination-links';
import { index } from '@/routes/budgets';
import type { BudgetCategory, PaginatedBudgets } from '@/types';

type PageProps = {
    budgets: PaginatedBudgets;
    categories: BudgetCategory[];
};

export default function BudgetsIndex({ budgets, categories }: PageProps) {
    return (
        <>
            <Head title="Budgets" />

            <div className="space-y-6 p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <Heading
                        title="Budgets"
                        description="Manage spending plans by category."
                    />
                    <BudgetCreateDialog categories={categories} />
                </div>

                <BudgetTable budgets={budgets.data} />
                <PaginationLinks links={budgets.links} />
            </div>
        </>
    );
}

BudgetsIndex.layout = {
    breadcrumbs: [
        {
            title: 'Budgets',
            href: index(),
        },
    ],
};
