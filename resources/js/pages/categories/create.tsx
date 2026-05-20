import { Head } from '@inertiajs/react';
import CategoryForm from '@/components/categories/category-form';
import Heading from '@/components/heading';
import { create } from '@/routes/categories';

export default function CategoriesCreate() {
    return (
        <>
            <Head title="Create category" />

            <div className="space-y-6 p-4">
                <Heading
                    title="Create category"
                    description="Add a category for budgets and transactions."
                />
                <CategoryForm />
            </div>
        </>
    );
}

CategoriesCreate.layout = {
    breadcrumbs: [
        {
            title: 'Create category',
            href: create(),
        },
    ],
};
