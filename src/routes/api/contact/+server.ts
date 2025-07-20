import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';
import { env } from '$env/dynamic/private';

const snsClient = new SNSClient({
  region: 'ap-southeast-2', // Sydney region
  credentials: {
    accessKeyId: env.SNS_ACCESS_KEY_ID || '',
    secretAccessKey: env.SNS_SECRET_ACCESS_KEY || '',
  },
});

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { name, email, subject, message } = await request.json();

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return json({ error: 'All fields are required' }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return json({ error: 'Invalid email format' }, { status: 400 });
    }

    // Format the email message
    const emailMessage = `
New Contact Form Submission

Name: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}

This message was sent from the AiluroWander contact form.
`;

    // Send email using SNS
    const command = new PublishCommand({
      TopicArn: env.SNS_TOPIC_ARN,
      Subject: `New Contact Form Submission: ${subject}`,
      Message: emailMessage,
      MessageAttributes: {
        email: {
          DataType: 'String',
          StringValue: 'contact@ailurotech.com.au',
        },
      },
    });

    await snsClient.send(command);

    return json({ success: true });
  } catch (error) {
    console.error('Error sending contact form:', error);
    return json({ error: 'Failed to send message' }, { status: 500 });
  }
};
