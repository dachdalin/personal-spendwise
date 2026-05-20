import {
    Baby,
    BadgeDollarSign,
    Banknote,
    BookOpen,
    BriefcaseBusiness,
    Building,
    Bus,
    Car,
    ChartPie,
    Coffee,
    CreditCard,
    Droplets,
    Dumbbell,
    Fuel,
    Gamepad2,
    Gift,
    GraduationCap,
    HeartPulse,
    Home,
    House,
    Landmark,
    Plane,
    PiggyBank,
    Receipt,
    Shield,
    Shirt,
    ShoppingBag,
    ShoppingCart,
    Smartphone,
    Stethoscope,
    Tags,
    Utensils,
    Wallet,
    Wifi,
    Zap,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

type CategoryIconProps = {
    name?: string | null;
    className?: string;
};

export default function CategoryIcon({ name, className }: CategoryIconProps) {
    const Icon = categoryIconMap[name ?? 'tags'] ?? Tags;

    return <Icon className={className} />;
}

export const categoryIconOptions = [
    { name: 'tags', icon: Tags },
    { name: 'wallet', icon: Wallet },
    { name: 'banknote', icon: Banknote },
    { name: 'badge-dollar-sign', icon: BadgeDollarSign },
    { name: 'credit-card', icon: CreditCard },
    { name: 'landmark', icon: Landmark },
    { name: 'piggy-bank', icon: PiggyBank },
    { name: 'receipt', icon: Receipt },
    { name: 'shopping-cart', icon: ShoppingCart },
    { name: 'shopping-bag', icon: ShoppingBag },
    { name: 'utensils', icon: Utensils },
    { name: 'coffee', icon: Coffee },
    { name: 'car', icon: Car },
    { name: 'fuel', icon: Fuel },
    { name: 'bus', icon: Bus },
    { name: 'plane', icon: Plane },
    { name: 'home', icon: Home },
    { name: 'house', icon: House },
    { name: 'building', icon: Building },
    { name: 'briefcase-business', icon: BriefcaseBusiness },
    { name: 'graduation-cap', icon: GraduationCap },
    { name: 'heart-pulse', icon: HeartPulse },
    { name: 'stethoscope', icon: Stethoscope },
    { name: 'gift', icon: Gift },
    { name: 'gamepad-2', icon: Gamepad2 },
    { name: 'shirt', icon: Shirt },
    { name: 'dumbbell', icon: Dumbbell },
    { name: 'baby', icon: Baby },
    { name: 'book-open', icon: BookOpen },
    { name: 'smartphone', icon: Smartphone },
    { name: 'wifi', icon: Wifi },
    { name: 'zap', icon: Zap },
    { name: 'droplets', icon: Droplets },
    { name: 'shield', icon: Shield },
    { name: 'chart-pie', icon: ChartPie },
] as const satisfies ReadonlyArray<{
    name: string;
    icon: LucideIcon;
}>;

const categoryIconMap = Object.fromEntries(
    categoryIconOptions.map((option) => [option.name, option.icon]),
) as Record<string, LucideIcon>;
