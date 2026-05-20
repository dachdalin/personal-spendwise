import { Form, Head, Link } from '@inertiajs/react';
import { Pencil, Trash2 } from 'lucide-react';
import TransactionController from '@/actions/App/Http/Controllers/TransactionController';
import CategoryIcon from '@/components/categories/category-icon';
import Heading from '@/components/heading';
import {
    formatTransactionAmount,
    formatTransactionDate,
    transactionTypeLabel,
} from '@/components/transactions/transaction-format';
import { Button } from '@/components/ui/button';
import { edit, index, show } from '@/routes/transactions';
import type { Transaction } from '@/types';

type PageProps = {
    transaction: Transaction;
};

export default function TransactionsShow({ transaction }: PageProps) {
    return (
        <>
            <Head title={transaction.title} />

            <div className="space-y-6 p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <Heading
                        title={transaction.title}
                        description="Transaction details."
                    />
                    <div className="flex gap-2">
                        <Button variant="outline" asChild>
                            <Link href={edit(transaction)}>
                                <Pencil />
                                Edit
                            </Link>
                        </Button>
                        <Form action={TransactionController.destroy(transaction)}>
                            <Button variant="destructive">
                                <Trash2 />
                                Delete
                            </Button>
                        </Form>
                    </div>
                </div>

                <dl className="grid max-w-2xl gap-4 rounded-lg border p-4 sm:grid-cols-2">
                    <div>
                        <dt className="text-sm text-muted-foreground">Type</dt>
                        <dd className="font-medium">
                            {transactionTypeLabel(transaction.type)}
                        </dd>
                    </div>
                    <div>
                        <dt className="text-sm text-muted-foreground">
                            Amount
                        </dt>
                        <dd className="font-medium">
                            {formatTransactionAmount(transaction.amount)}
                        </dd>
                    </div>
                    <div>
                        <dt className="text-sm text-muted-foreground">
                            Category
                        </dt>
                        <dd className="flex items-center gap-2 font-medium">
                            <span
                                className="flex size-7 items-center justify-center rounded-md border"
                                style={{
                                    backgroundColor:
                                        transaction.category.color ?? '#f3f4f6',
                                }}
                            >
                                <CategoryIcon
                                    name={transaction.category.icon}
                                    className="size-4"
                                />
                            </span>
                            {transaction.category.name}
                        </dd>
                    </div>
                    <div>
                        <dt className="text-sm text-muted-foreground">Date</dt>
                        <dd className="font-medium">
                            {formatTransactionDate(transaction.date)}
                        </dd>
                    </div>
                    <div className="sm:col-span-2">
                        <dt className="text-sm text-muted-foreground">
                            Description
                        </dt>
                        <dd className="font-medium">
                            {transaction.description ?? 'None'}
                        </dd>
                    </div>
                </dl>
            </div>
        </>
    );
}

TransactionsShow.layout = ({ transaction }: PageProps) => ({
    breadcrumbs: [
        {
            title: 'Transactions',
            href: index(),
        },
        {
            title: transaction.title,
            href: show(transaction),
        },
    ],
});
