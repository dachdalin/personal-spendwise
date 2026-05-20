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
import type { BudgetCategory } from '@/types';
import BudgetForm from './budget-form';

type BudgetCreateDialogProps = {
    categories: BudgetCategory[];
};

export default function BudgetCreateDialog({
    categories,
}: BudgetCreateDialogProps) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button>
                    <Plus />
                    New budget
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Create budget</DialogTitle>
                    <DialogDescription>
                        Set a budget amount for a category and date.
                    </DialogDescription>
                </DialogHeader>
                <BudgetForm categories={categories} variant="modal" />
            </DialogContent>
        </Dialog>
    );
}
