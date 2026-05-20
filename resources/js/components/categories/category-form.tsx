import { Form, Link } from '@inertiajs/react';
import CategoryController from '@/actions/App/Http/Controllers/CategoryController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { index } from '@/routes/categories';
import type { Category } from '@/types';
import IconPicker from './icon-picker';

type CategoryFormProps = {
    category?: Category;
    variant?: 'page' | 'modal';
};

export default function CategoryForm({
    category,
    variant = 'page',
}: CategoryFormProps) {
    const action = category
        ? CategoryController.update(category)
        : CategoryController.store();

    return (
        <Form
            action={action}
            options={{ preserveScroll: true }}
            className="max-w-2xl space-y-6"
        >
            {({ processing, errors }) => (
                <>
                    <div className="grid gap-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            name="name"
                            defaultValue={category?.name}
                            placeholder="Food"
                            required
                        />
                        <InputError message={errors.name} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="slug">Slug</Label>
                        <Input
                            id="slug"
                            name="slug"
                            defaultValue={category?.slug}
                            placeholder="food"
                        />
                        <InputError message={errors.slug} />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="icon">Icon</Label>
                            <IconPicker defaultValue={category?.icon} />
                            <InputError message={errors.icon} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="color">Color</Label>
                            <Input
                                id="color"
                                name="color"
                                type="color"
                                defaultValue={category?.color ?? '#0f766e'}
                                className="h-10 w-24 p-1"
                            />
                            <InputError message={errors.color} />
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button disabled={processing}>Save</Button>
                        <CancelButton variant={variant} />
                    </div>
                </>
            )}
        </Form>
    );
}

function CancelButton({ variant }: { variant: 'page' | 'modal' }) {
    if (variant === 'modal') {
        return (
            <DialogClose asChild>
                <Button type="button" variant="outline">
                    Cancel
                </Button>
            </DialogClose>
        );
    }

    return (
        <Button variant="outline" asChild>
            <Link href={index()}>Cancel</Link>
        </Button>
    );
}
