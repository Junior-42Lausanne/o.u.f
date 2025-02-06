import {
	PRIVATE_SMTP_FROM,
	PRIVATE_SMTP_HOST,
	PRIVATE_SMTP_PASS,
	PRIVATE_SMTP_PORT,
	PRIVATE_SMTP_USER
} from '$env/static/private';
import type mjml2html from 'mjml';
import { createTransport } from 'nodemailer';
import { convert } from 'html-to-text';

const transporter = createTransport({
	host: PRIVATE_SMTP_HOST,
	port: parseInt(PRIVATE_SMTP_PORT),
	auth: {
		user: PRIVATE_SMTP_USER,
		pass: PRIVATE_SMTP_PASS
	}
});

export async function sendMail(compiled: ReturnType<typeof mjml2html>, to: string) {
	const text = convert(compiled.html);
	const info = await transporter.sendMail({
		from: PRIVATE_SMTP_FROM,
		to,
		html: compiled.html,
		text
	});
}
