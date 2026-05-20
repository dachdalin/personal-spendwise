import { Head } from '@inertiajs/react';
import Heading from '@/components/heading';
import TransactionForm from '@/components/transactions/transaction-form';
import { create } from '@/routes/transactions';
import type { TransactionBudget, TransactionCategory } from '@/types';

type PageProps = {
    categories: TransactionCategory[];
    budgets: TransactionBudget[];
};

export default function TransactionsCreate({ categories, budgets }: PageProps) {
    return (
        <>
            <Head title="Create transaction" />

            <div className="space-y-6 p-4">
                <Heading
                    title="Create transaction"
                    description="Record income or expense against a budget."
                />
                <TransactionForm categories={categories} budgets={budgets} />
            </div>
        </>
    );
}

TransactionsCreate.layout = {
    breadcrumbs: [
        {
            title: 'Create transaction',
            href: create(),
        },
    ],
};
