export type Category = {
    id: number;
    name: string;
    slug: string;
    icon: string | null;
    color: string | null;
    created_at: string;
    updated_at: string;
};

export type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

export type PaginatedCategories = {
    data: Category[];
    links: PaginationLink[];
};
