export function formatTransactionAmount(amount: string | number) {
    return new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency: 'USD',
    }).format(Number(amount));
}

export function formatTransactionDate(date: string) {
    return new Intl.DateTimeFormat(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    }).format(new Date(date));
}

export function transactionTypeLabel(type: string) {
    return type.charAt(0).toUpperCase() + type.slice(1);
}
