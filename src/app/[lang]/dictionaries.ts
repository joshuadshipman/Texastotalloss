import { en } from '@/dictionaries/en';
import { es } from '@/dictionaries/es';

const dictionaries = {
    en,
    es,
};

export const getDictionary = async (locale: 'en' | 'es') => dictionaries[locale];
