import { writable } from 'svelte/store';

type ToastData = {
	message: string;
	type: 'success' | 'error' | 'info' | 'warning';
	/** Time before the toast is removed in ms
	 * default: 5000
	 */
	timeout: number;
	/** If the toast can be dismissed by the user
	 * default: true
	 */
	dismissable: boolean;
	/** Initial time before the toast is removed in ms
	 * default: 5000
	 */
	initial_timeout: number;
};

export const toasts = writable<ToastData[]>([]);

export const addToast = (toast: Partial<ToastData>) => {
	console.log('Adding toast', toast);
	const full = $state({
		message: toast.message || '',
		type: toast.type || 'info',
		timeout: toast.timeout || 5000,
		dismissable: toast.dismissable || true,
		initial_timeout: toast.timeout || 5000
	});
	toasts.update((current) => [...current, full]);
	if (full.initial_timeout) setTimeout(() => {
		removeToast(full);
	}, full.timeout);
};

export const removeToast = (toast: ToastData) => {
	toasts.update((current) => current.filter((t) => t !== toast));
};

export const typeColor = {
	success: 'green',
	error: 'red',
	info: 'blue',
	warning: 'yellow'
} as const;
