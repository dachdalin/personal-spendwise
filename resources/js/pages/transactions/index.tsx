import { Head } from '@inertiajs/react';
import Heading from '@/components/heading';
import PaginationLinks from '@/components/pagination-links';
import TransactionCreateDialog from '@/components/transactions/transaction-create-dialog';
import TransactionTable from '@/components/transactions/transaction-table';
import { index } from '@/routes/transactions';
import type {
    PaginatedTransactions,
    TransactionBudget,
    TransactionCategory,
} from '@/types';

type PageProps = {
    transactions: PaginatedTransactions;
    categories: TransactionCategory[];
    budgets: TransactionBudget[];
};

export default function TransactionsIndex({
    transactions,
    categories,
    budgets,
}: PageProps) {
    return (
        <>
            <Head title="Transactions" />

            <div className="space-y-6 p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <Heading
                        title="Transactions"
                        description="Track income and expenses."
                    />
                    <TransactionCreateDialog
                        categories={categories}
                        budgets={budgets}
                    />
                </div>

                <TransactionTable transactions={transactions.data} />
                <PaginationLinks links={transactions.links} />
            </div>
        </>
    );
}

TransactionsIndex.layout = {
    breadcrumbs: [
        {
            title: 'Transactions',
            href: index(),
        },
    ],
};
