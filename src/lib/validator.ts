import { z } from 'zod';
import type { Tables } from './supabase';
import { languages } from './translation';

export const project_object = z.object({
	id: z.string(),
	created_at: z.string(),
	languages: z.array(z.enum(languages)),
	name: z.string().min(3, 'Name must be minimum 3 characters'),
	owner_id: z.string().uuid(),
	restricted_premix_mode: z.boolean(),
	updated_at: z.string(),
	// url prefix : only url safe characters and min 3 characters
	url_prefix: z
		.string()
		.min(3, 'URL prefix must be minimum 3 characters')
		.regex(/^[a-zA-Z0-9_-]+$/, 'Only url safe characters are allowed')
});
