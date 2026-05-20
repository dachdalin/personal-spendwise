import { Head } from '@inertiajs/react';
import Heading from '@/components/heading';
import TransactionForm from '@/components/transactions/transaction-form';
import { edit } from '@/routes/transactions';
import type {
    Transaction,
    TransactionBudget,
    TransactionCategory,
} from '@/types';

type PageProps = {
    transaction: Transaction;
    categories: TransactionCategory[];
    budgets: TransactionBudget[];
};

export default function TransactionsEdit({
    transaction,
    categories,
    budgets,
}: PageProps) {
    return (
        <>
            <Head title={`Edit ${transaction.title}`} />

            <div className="space-y-6 p-4">
                <Heading
                    title="Edit transaction"
                    description="Update transaction details."
                />
                <TransactionForm
                    transaction={transaction}
                    categories={categories}
                    budgets={budgets}
                />
            </div>
        </>
    );
}

TransactionsEdit.layout = ({ transaction }: PageProps) => ({
    breadcrumbs: [
        {
            title: 'Edit transaction',
            href: edit(transaction),
        },
    ],
});
