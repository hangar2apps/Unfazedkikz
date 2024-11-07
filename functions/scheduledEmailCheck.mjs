import schedule from '@netlify/functions';
import nodemailer from 'nodemailer';
import { getStore } from "@netlify/blobs";
import { v4 as uuidv4 } from 'uuid';
import Octokit from "@octokit/rest";
import simpleParser from "mailparser";

const processEmails = async () => {
    
    const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

    // Set up email client
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    try {
    // Fetch latest email
    const messages = await transporter.search({ criteria: ["UNSEEN"] });
    if (messages.length === 0) {
        return { statusCode: 200, body: "No new emails" };
    }

    const latestEmail = messages[0];
    const parsedEmail = await simpleParser(await transporter.fetchOne(latestEmail));

    // Process attachments
    for (const attachment of parsedEmail.attachments) {
        const content = attachment.content.toString('base64');
        const filename = attachment.filename;

        // Upload to GitHub
        await octokit.repos.createOrUpdateFileContents({
        owner: "your-github-username",
        repo: "your-repo-name",
        path: `temp-images/${filename}`,
        message: "Add new shoe image via email",
        content: content,
        branch: "main"
        });

        // Store metadata in Netlify Blobs
        // (You'll need to implement this part based on your Netlify Blobs setup)
    }

    return { statusCode: 200, body: "Email processed successfully" };
    } catch (error) {
    console.error("Error processing email:", error);
    return { statusCode: 500, body: "Error processing email" };
    }
};


export default async (req, context) => {
  console.log('getting into scheduled email check');
  const { next_run } = await req.json();
  console.log("Checking for new emails", next_run);
//   await processEmails();
};

