import { Head } from '@inertiajs/react';
import CategoryForm from '@/components/categories/category-form';
import Heading from '@/components/heading';
import { edit } from '@/routes/categories';
import type { Category } from '@/types';

type PageProps = {
    category: Category;
};

export default function CategoriesEdit({ category }: PageProps) {
    return (
        <>
            <Head title={`Edit ${category.name}`} />

            <div className="space-y-6 p-4">
                <Heading
                    title="Edit category"
                    description="Update category details used across budgets and transactions."
                />
                <CategoryForm category={category} />
            </div>
        </>
    );
}

CategoriesEdit.layout = ({ category }: PageProps) => ({
    breadcrumbs: [
        {
            title: 'Edit category',
            href: edit(category),
        },
    ],
});
