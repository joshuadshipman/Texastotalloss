# ☁️ Google Cloud & API Setup Guide

This guide will walk you through creating the "Brain" that connects your website to Google's data. We need this for **two** critical things:
1.  **Reading Rankings**: So the AI knows when to optimize your content (Search Console API).
2.  **Posting Updates**: So the AI can post to your Google Map (Business Information API).

---

## 🛑 Step 1: Create a Project (The Container)

1.  Go to the [Google Cloud Console](https://console.cloud.google.com/).
2.  Click the dropdown in the top-left (next to "Google Cloud") that probably reads "My First Project" or "Select a project".
3.  Click **"New Project"** (Top right of the modal).
4.  **Project Name**: `TexasTotalLoss-Automation`
5.  **Organization**: No organization.
6.  Click **Create**.
7.  **Wait** a moment, then click **Select Project** when the notification appears.

---

## 🔌 Step 2: Enable the APIs (The Features)

We need to turn on the specific services we want to use.

1.  In the Search bar at the top, type **"Google Search Console API"**.
2.  Click on "Google Search Console API" (Marketplace).
3.  Click **ENABLE**.
    *   *Wait for it to finish loading.*
4.  Go back to the Search bar. Type **"Google Business Profile Performance API"**.
    *   (Note: Google sometimes renames these. Look for "Google My Business API" or "Business Information API" if that doesn't appear).
    *   Actually, search for **"Google Business Information API"** and **"Google Business Profile Performance API"**.
5.  Click **ENABLE** for both if found.

---

## 🔑 Step 3: Create the Service Account (The Robot Key)

This is the "User" that our code will log in as.

1.  In the top-left menu (Hamburger icon), go to **IAM & Admin** > **Service Accounts**.
2.  Click **+ CREATE SERVICE ACCOUNT** (Top center).
3.  **Details**:
    *   **Name**: `seo-bot`
    *   **ID**: `seo-bot@texas-total-loss-automation.iam.gserviceaccount.com` (Auto-filled)
    *   Click **Create and Continue**.
4.  **Grant Access**:
    *   Role: Select **Basic** > **Owner** (For simplicity now) or **Editor**.
    *   Click **Continue** -> **Done**.
5.  **Get the Key**:
    *   You should see the list of service accounts now. Click on the email address of the one you just created (`seo-bot@...`).
    *   Go to the **KEYS** tab (Top bar).
    *   Click **ADD KEY** > **Create new key**.
    *   Type: **JSON** (Default).
    *   Click **CREATE**.
    *   **IMPORTANT**: A file will download to your computer. **Keep this safe!** Do not lose it.

---

## 🔗 Step 4: Connect the "Robot" to Your Data

Just creating the robot isn't enough. You have to "invite" it to your properties.

### Part A: Google Search Console (GSC)
1.  Open your downloaded JSON file (open with Notepad or VS Code). Copy the `client_email` address (e.g., `seo-bot@texas-total-loss-automation...`).
2.  Go to [Google Search Console](https://search.google.com/search-console).
3.  Select your property (`https://texastotalloss.com`).
    > **Don't see it?**
    > 1. Click the dropdown (currently showing "pmaction.com").
    > 2. Click **+ Add property** at the bottom.
    > 3. Choose **URL prefix** (on the right).
    > 4. Enter `https://texastotalloss.com` and click **Continue**.
    > 5. If it asks for verification, try the **HTML Tag** method (copy the tag and send it to me/put it in code) or **DNS** method if you have domain access.
4.  Go to **Settings** (Bottom left).
5.  Click **Users and permissions**.
6.  Click **ADD USER**.
7.  **Email**: Paste the `client_email` you copied.
8.  **Permission**: **Owner** (Required for some API features) or **Full**.
9.  Click **ADD**.

### Part B: Google Business Profile (GBP)
1.  Go to [Google Business Profile Manager](https://business.google.com/).
2.  Select your business.
3.  Click on the three dots menu (or "Business Profile settings") > **Managers** (or "People and Access").
4.  Click **+ Add**.
5.  **Email**: Paste the `client_email` again.
6.  **Role**: **Manager**.
7.  Click **Invite**. (The API accepts the invite automatically usually, or we verify via code).

---

## 📝 Step 5: Add Credentials to Vercel

Finally, tell our Vercel app who the robot is.

1.  Open the JSON file you downloaded again.
2.  You need two values:
    *   `client_email`
    *   `private_key` (It looks like `-----BEGIN PRIVATE KEY-----\nMIIEv...`)
3.  Go to your project in **Vercel**.
4.  **Settings** > **Environment Variables**.
5.  Add these new variables:
    *   `GOOGLE_CLIENT_EMAIL`: Paste the email.
    *   `GOOGLE_PRIVATE_KEY`: Paste the *entire* private key string (including the BEGIN/END parts).

---

## ✅ Done!
Once this is done, reply with **"Google APIs Configured"** and I will enable the full feedback loop logic!
