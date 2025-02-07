import { SvelteMap } from 'svelte/reactivity';
import type { Tables } from './supabase';

export function generateTranslationsMap(translations: Tables<'translations'>[]) {
	const map = new SvelteMap<string, Tables<'translations'>>();
	translations.forEach((t) => {
		if (map.has(t.key) && t.project_id == null) return;
		map.set(t.key, t);
	});

	return map;
}

export const languages = ['en', 'fr'] as const;

// In order for i18next cli to find those keys they need to be cited somewhere since in the template it's a dynamic string.
// t('global.lang.fr')
// t('global.lang.en')
