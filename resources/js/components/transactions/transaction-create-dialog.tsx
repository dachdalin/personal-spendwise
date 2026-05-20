import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import type { TransactionBudget, TransactionCategory } from '@/types';
import TransactionForm from './transaction-form';

type TransactionCreateDialogProps = {
    categories: TransactionCategory[];
    budgets: TransactionBudget[];
};

export default function TransactionCreateDialog({
    categories,
    budgets,
}: TransactionCreateDialogProps) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button>
                    <Plus />
                    New transaction
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Create transaction</DialogTitle>
                    <DialogDescription>
                        Record income or expense against a budget.
                    </DialogDescription>
                </DialogHeader>
                <TransactionForm
                    categories={categories}
                    budgets={budgets}
                    variant="modal"
                />
            </DialogContent>
        </Dialog>
    );
}
