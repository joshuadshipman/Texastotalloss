
import 'server-only';

const dictionaries = {
    en: () => import('./en').then((module) => module.en),
    es: () => import('./es').then((module) => module.es),
};

export const getDictionary = async (locale: 'en' | 'es') => {
    return dictionaries[locale]?.() ?? dictionaries.en();
};
