import i18next from 'i18next';
import { createI18nStore } from 'svelte-i18next';
import Backend from 'i18next-http-backend';
import { i18nextPlugin } from 'translation-check'

// Load translations from json

i18next.use(Backend).use(i18nextPlugin).init({
	lng: 'en',
	backend: {
		loadPath: '/locales/{{lng}}.json'
	},
	interpolation: {
		escapeValue: false // not needed for svelte as it escapes by default
	}
});

const i18n = createI18nStore(i18next);
console.log(i18n);
export default i18n;
