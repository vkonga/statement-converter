# How to Get SMTP Credentials (Gmail Example)

To send emails using your Gmail account, you need to generate an **App Password**. You cannot use your regular login password.

## Step 1: Enable 2-Factor Authentication (2FA)
(If you haven't already)
1.  Go to your [Google Account Settings](https://myaccount.google.com/).
2.  Click on **Security** in the left sidebar.
3.  Under "How you sign in to Google", turn on **2-Step Verification**.

## Step 2: Generate App Password
1.  Go back to the **Security** page.
2.  Under "How you sign in to Google", verify 2-Step Verification is ON.
3.  Search for **"App passwords"** in the top search bar of the Google Account page (or look for it under 2-Step Verification options).
    *   *Note: Sometimes Google hides this option deep in menus. Searching "App passwords" is the fastest way.*
4.  Click **App passwords**. You may need to sign in again.
5.  **App name**: Enter "StatementConverter" (or any name).
6.  Click **Create**.
7.  Copy the **16-character password** shown (it will look like `xxxx xxxx xxxx xxxx`).

## Step 3: Configure Your Application
Add these lines to your `.env` file:

```env
# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
# Paste the 16-char code below (no spaces needed, but spaces are fine)
SMTP_PASS=xxxx xxxx xxxx xxxx
SMTP_FROM_EMAIL=your-email@gmail.com
```

## Troubleshooting
-   **Error:** "Username and Password not accepted" -> Make sure you are using the **App Password**, not your main Google password.
-   **Production:** For a real production app, consider using a dedicated email service like **SendGrid**, **Resend**, or **AWS SES** for better deliverability.
