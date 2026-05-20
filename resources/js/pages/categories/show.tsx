import { Form, Head, Link } from '@inertiajs/react';
import { Pencil, Trash2 } from 'lucide-react';
import CategoryController from '@/actions/App/Http/Controllers/CategoryController';
import CategoryIcon from '@/components/categories/category-icon';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { edit, index, show } from '@/routes/categories';
import type { Category } from '@/types';

type PageProps = {
    category: Category;
};

export default function CategoriesShow({ category }: PageProps) {
    return (
        <>
            <Head title={category.name} />

            <div className="space-y-6 p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <Heading
                        title={category.name}
                        description="Category details."
                    />
                    <div className="flex gap-2">
                        <Button variant="outline" asChild>
                            <Link href={edit(category)}>
                                <Pencil />
                                Edit
                            </Link>
                        </Button>
                        <Form action={CategoryController.destroy(category)}>
                            <Button variant="destructive">
                                <Trash2 />
                                Delete
                            </Button>
                        </Form>
                    </div>
                </div>

                <dl className="grid max-w-2xl gap-4 rounded-lg border p-4 sm:grid-cols-2">
                    <div>
                        <dt className="text-sm text-muted-foreground">Slug</dt>
                        <dd className="font-medium">{category.slug}</dd>
                    </div>
                    <div>
                        <dt className="text-sm text-muted-foreground">Icon</dt>
                        <dd className="flex items-center gap-2 font-medium">
                            <CategoryIcon
                                name={category.icon}
                                className="size-4"
                            />
                            {category.icon ?? 'Default'}
                        </dd>
                    </div>
                    <div>
                        <dt className="text-sm text-muted-foreground">Color</dt>
                        <dd className="flex items-center gap-2 font-medium">
                            <span
                                className="size-5 rounded border"
                                style={{
                                    backgroundColor:
                                        category.color ?? '#f3f4f6',
                                }}
                            />
                            {category.color ?? 'Default'}
                        </dd>
                    </div>
                </dl>
            </div>
        </>
    );
}

CategoriesShow.layout = ({ category }: PageProps) => ({
    breadcrumbs: [
        {
            title: 'Categories',
            href: index(),
        },
        {
            title: category.name,
            href: show(category),
        },
    ],
});
