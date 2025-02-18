import { writable } from 'svelte/store';

export type ToastObj = {
	message: string;
	type: 'success' | 'error' | 'info' | 'warning';
	timeout: number; // Time before the toast is removed in ms
	dismissable: boolean;
	auto_dismiss: boolean; // If the toast should be removed after the timeout
	initial_timeout: number; // The initial timeout
};

function timeout(toast: ToastObj) {
	if (toast.timeout >= 0) {
		setTimeout(() => timeout(toast), 1000);
		toast.timeout -= 1000;
	}
	if (toast.auto_dismiss && toast.timeout < 0) removeToast(toast);
}

export const toasts = writable<ToastObj[]>([]);

export const addToast = (toast: Partial<ToastObj>) => {
	console.log('Adding toast', toast);
	const full = $state({
		message: toast.message || 'No message',
		type: toast.type || 'info',
		timeout: toast.timeout || 5000,
		dismissable: toast.dismissable || true,
		auto_dismiss: toast.auto_dismiss || true,
		initial_timeout: toast.timeout || 5000
	});
	toasts.update((current) => [...current, full]);
	timeout(full);
};

export const removeToast = (toast: ToastObj) => {
	toasts.update((current) => current.filter((t) => t !== toast));
};

export const toastToColor = (type: 'success' | 'error' | 'info' | 'warning') => {
	switch (type) {
		case 'success':
			return 'green';
		case 'error':
			return 'red';
		case 'info':
			return 'blue';
		case 'warning':
			return 'yellow';
	}
};
