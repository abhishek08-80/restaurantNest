import * as nodemailer from 'nodemailer'
export const mailTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'abhishekwins1@gmail.com',
        pass: 'clbq eloi ekjn ruug'
    },
});