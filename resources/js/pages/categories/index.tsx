import { Head } from '@inertiajs/react';
import CategoryCreateDialog from '@/components/categories/category-create-dialog';
import CategoryTable from '@/components/categories/category-table';
import Heading from '@/components/heading';
import PaginationLinks from '@/components/pagination-links';
import { index } from '@/routes/categories';
import type { PaginatedCategories } from '@/types';

type PageProps = {
    categories: PaginatedCategories;
};

export default function CategoriesIndex({ categories }: PageProps) {
    return (
        <>
            <Head title="Categories" />

            <div className="space-y-6 p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <Heading
                        title="Categories"
                        description="Manage transaction and budget categories."
                    />
                    <CategoryCreateDialog />
                </div>

                <CategoryTable categories={categories.data} />
                <PaginationLinks links={categories.links} />
            </div>
        </>
    );
}

CategoriesIndex.layout = {
    breadcrumbs: [
        {
            title: 'Categories',
            href: index(),
        },
    ],
};
