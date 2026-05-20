import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import type { PaginationLink } from '@/types';

type PaginationLinksProps = {
    links: PaginationLink[];
};

export default function PaginationLinks({ links }: PaginationLinksProps) {
    if (links.length <= 3) {
        return null;
    }

    return (
        <div className="flex flex-wrap gap-2">
            {links.map((link) => (
                <Button
                    key={`${link.label}-${link.url}`}
                    variant={link.active ? 'default' : 'outline'}
                    size="sm"
                    disabled={!link.url}
                    asChild={!!link.url}
                >
                    {link.url ? (
                        <Link href={link.url}>{paginationLabel(link.label)}</Link>
                    ) : (
                        <span>{paginationLabel(link.label)}</span>
                    )}
                </Button>
            ))}
        </div>
    );
}

function paginationLabel(label: string) {
    return label.replace('&laquo;', '').replace('&raquo;', '').trim();
}
