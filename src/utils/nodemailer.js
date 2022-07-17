import { createTransport } from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const TEST_GMAIL = process.env.TESTGMAIL;
const PASS_GMAIL = process.env.PASSGMAIL;
export const ADMIN_GMAIL = process.env.ADMINGMAIL;

export const transporter = createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: TEST_GMAIL,
        pass: PASS_GMAIL 
    }
});