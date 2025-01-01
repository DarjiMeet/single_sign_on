import {MailtrapClient} from "mailtrap"
import dotenv from "dotenv"

dotenv.config()

const TOKEN = process.env.MAILTRAP_TOKEN;
const ENDPOINT = process.env.MAILTRAP_ENDPOINT

export const mailtrapClient = new MailtrapClient({
    endpoint:ENDPOINT,
    token: TOKEN,
    tls: {
      servername: "send.api.mailtrap.io", // Explicitly set the server name for TLS
    },
});

export const sender = {
  email: "hello@demomailtrap.com",
  name: "Meet",
};
