import nodemailer from 'nodemailer';
import { getStore } from "@netlify/blobs";
import { v4 as uuidv4 } from 'uuid';

export default async (req, context) => {
  
  if (req.method !== 'POST') {
    return new Response(
        JSON.stringify({message: "Method Not Allowed"}), { status: 405 , headers: { 'Content-Type': 'application/json' } }
    )
  }

  try {
    const bodyString = await req.text(); // Use .text() to read the request body as a string
    const { email, message, honeypot } = JSON.parse(bodyString);

    if (honeypot) {
        return new Response(
            JSON.stringify({message: "Nice try, bot"}), { status: 400 , headers: { 'Content-Type': 'application/json' } }
        )
    }

    const siteID = process.env.NETLIFY_SITE_ID;
    const token = process.env.NETLIFY_ACCESS_TOKEN;
    if (!siteID || !token) {
        return new Response(
            JSON.stringify({message: "Missing Netlify Blobs configuration"}), { status: 500 , headers: { 'Content-Type': 'application/json' } }
        )
    }

    let createdDate = new Date();
    let formattedDate = `${createdDate.getMonth() + 1}/${createdDate.getDate()}/${createdDate.getFullYear()}`;

    const randomId = uuidv4();

    //store email in blobs
    const store = getStore('contactInfo', { siteID, token });
    await store.set(`contactInfo-${randomId}`, JSON.stringify({ email, message, createdAt: formattedDate }));

    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // Use TLS
        auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
        },
    });

    await transporter.sendMail({
      from: `<${email}>`,
      to: "unfazedkikz@gmail.com", // Replace with your email
      subject: "New message from Unfazed-kikz.com",
      text: message,
      html: `
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    });

        return new Response(
            JSON.stringify({message: "Email sent successfully"}), { status: 200 , headers: { 'Content-Type': 'application/json' } }
        )
  } catch (error) {
    console.error('Error sending email:', error);
    return new Response(
        JSON.stringify({message: "Error sending email"}), { status: 500 , headers: { 'Content-Type': 'application/json' } }
    )
  }
};

