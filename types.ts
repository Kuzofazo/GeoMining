import { LucideIcon } from 'lucide-react';

export interface NavItem {
  label: string;
  href: string;
}

export interface Metric {
  value: string;
  label: string;
  subLabel?: string;
  icon: LucideIcon;
}

export interface ValueCard {
  title: string;
  description: string;
  icon: LucideIcon;
}

export interface Operation {
  name: string;
  location: string;
  type: string;
  capacity: string;
  image: string;
}

export interface StrategyItem {
  title: string;
  description: string;
  icon: LucideIcon;
}

export interface GalleryImage {
  id: string;
  url: string;
  category:
    | 'Operations'
    | 'Community'
    | 'Exploration'
    | 'Environment'
    | 'Program'
    | string;
  title: string;
  description: string;
}
