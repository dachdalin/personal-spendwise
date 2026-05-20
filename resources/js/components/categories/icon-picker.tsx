import { Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { cn } from '@/lib/utils';
import CategoryIcon, { categoryIconOptions } from './category-icon';

type IconPickerProps = {
    name?: string;
    defaultValue?: string | null;
};

export default function IconPicker({
    name = 'icon',
    defaultValue,
}: IconPickerProps) {
    const [selectedIcon, setSelectedIcon] = useState(defaultValue ?? 'tags');
    const [search, setSearch] = useState('');

    const filteredIcons = useMemo(() => {
        const normalizedSearch = search.trim().toLowerCase();

        if (!normalizedSearch) {
            return categoryIconOptions;
        }

        return categoryIconOptions.filter((option) =>
            option.name.includes(normalizedSearch),
        );
    }, [search]);

    return (
        <div className="space-y-3">
            <input type="hidden" name={name} value={selectedIcon} />

            <div className="relative">
                <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                    type="search"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search icon"
                    className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring h-9 w-full rounded-md border px-9 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                />
            </div>

            <div className="grid max-h-56 grid-cols-4 gap-2 overflow-y-auto rounded-md border p-2 sm:grid-cols-6">
                {filteredIcons.map(({ name: iconName }) => (
                    <button
                        key={iconName}
                        type="button"
                        title={iconName}
                        onClick={() => setSelectedIcon(iconName)}
                        className={cn(
                            'flex h-12 items-center justify-center rounded-md border text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground',
                            selectedIcon === iconName &&
                                'border-primary bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground',
                        )}
                    >
                        <CategoryIcon name={iconName} className="size-5" />
                    </button>
                ))}
            </div>
        </div>
    );
}
