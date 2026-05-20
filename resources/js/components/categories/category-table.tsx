import { Form, Link } from '@inertiajs/react';
import CategoryController from '@/actions/App/Http/Controllers/CategoryController';
import { Button } from '@/components/ui/button';
import { show } from '@/routes/categories';
import type { Category } from '@/types';
import CategoryIcon from './category-icon';

type CategoryTableProps = {
    categories: Category[];
};

export default function CategoryTable({ categories }: CategoryTableProps) {
    return (
        <div className="overflow-hidden rounded-lg border">
            <div className="grid grid-cols-[1fr_auto] border-b bg-muted/40 px-4 py-3 text-sm font-medium md:grid-cols-[1fr_12rem_8rem]">
                <span>Name</span>
                <span className="hidden md:block">Slug</span>
                <span className="text-right">Actions</span>
            </div>

            {categories.length > 0 ? (
                categories.map((category) => (
                    <CategoryRow key={category.id} category={category} />
                ))
            ) : (
                <div className="px-4 py-10 text-center text-sm text-muted-foreground">
                    No categories yet.
                </div>
            )}
        </div>
    );
}

function CategoryRow({ category }: { category: Category }) {
    return (
        <div className="grid grid-cols-[1fr_auto] items-center gap-3 border-b px-4 py-3 last:border-b-0 md:grid-cols-[1fr_12rem_8rem]">
            <div className="flex min-w-0 items-center gap-3">
                <span
                    className="flex size-9 shrink-0 items-center justify-center rounded-md border"
                    style={{ backgroundColor: category.color ?? '#f3f4f6' }}
                >
                    <CategoryIcon name={category.icon} className="size-4" />
                </span>
                <div className="min-w-0">
                    <Link
                        href={show(category)}
                        className="truncate font-medium hover:underline"
                    >
                        {category.name}
                    </Link>
                    <p className="truncate text-sm text-muted-foreground md:hidden">
                        {category.slug}
                    </p>
                </div>
            </div>
            <span className="hidden truncate text-sm text-muted-foreground md:block">
                {category.slug}
            </span>
            <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm" asChild>
                    <Link href={CategoryController.edit(category)}>Edit</Link>
                </Button>
                <Form
                    action={CategoryController.destroy(category)}
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
