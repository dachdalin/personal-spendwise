import { Form, Link } from '@inertiajs/react';
import TransactionController from '@/actions/App/Http/Controllers/TransactionController';
import CategoryIcon from '@/components/categories/category-icon';
import { Button } from '@/components/ui/button';
import { show } from '@/routes/transactions';
import type { Transaction } from '@/types';
import {
    formatTransactionAmount,
    formatTransactionDate,
    transactionTypeLabel,
} from './transaction-format';

type TransactionTableProps = {
    transactions: Transaction[];
};

export default function TransactionTable({
    transactions,
}: TransactionTableProps) {
    return (
        <div className="overflow-hidden rounded-lg border">
            <div className="grid grid-cols-[1fr_auto] border-b bg-muted/40 px-4 py-3 text-sm font-medium md:grid-cols-[1fr_9rem_8rem_10rem_8rem]">
                <span>Transaction</span>
                <span className="hidden md:block">Type</span>
                <span className="hidden md:block">Amount</span>
                <span className="hidden md:block">Date</span>
                <span className="text-right">Actions</span>
            </div>

            {transactions.length > 0 ? (
                transactions.map((transaction) => (
                    <TransactionRow
                        key={transaction.id}
                        transaction={transaction}
                    />
                ))
            ) : (
                <div className="px-4 py-10 text-center text-sm text-muted-foreground">
                    No transactions yet.
                </div>
            )}
        </div>
    );
}

function TransactionRow({ transaction }: { transaction: Transaction }) {
    return (
        <div className="grid grid-cols-[1fr_auto] items-center gap-3 border-b px-4 py-3 last:border-b-0 md:grid-cols-[1fr_9rem_8rem_10rem_8rem]">
            <div className="flex min-w-0 items-center gap-3">
                <span
                    className="flex size-9 shrink-0 items-center justify-center rounded-md border"
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
                <div className="min-w-0">
                    <Link
                        href={show(transaction)}
                        className="truncate font-medium hover:underline"
                    >
                        {transaction.title}
                    </Link>
                    <p className="truncate text-sm text-muted-foreground md:hidden">
                        {transaction.category.name} ·{' '}
                        {formatTransactionAmount(transaction.amount)}
                    </p>
                </div>
            </div>
            <span className="hidden text-sm text-muted-foreground md:block">
                {transactionTypeLabel(transaction.type)}
            </span>
            <span className="hidden text-sm text-muted-foreground md:block">
                {formatTransactionAmount(transaction.amount)}
            </span>
            <span className="hidden text-sm text-muted-foreground md:block">
                {formatTransactionDate(transaction.date)}
            </span>
            <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm" asChild>
                    <Link href={TransactionController.edit(transaction)}>
                        Edit
                    </Link>
                </Button>
                <Form
                    action={TransactionController.destroy(transaction)}
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
