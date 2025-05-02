# Google Sheets Integration Guide

This guide walks you through setting up Google Sheets integration for the Egg Tracker application.

## 1. Create a Google Sheet

1. Go to [Google Sheets](https://sheets.google.com) and create a new spreadsheet
2. Rename the first sheet to "Eggs"
3. Add the following headers in the first row:
   - A1: Date
   - B1: Weight
   - C1: Color
   - D1: Speckled

## 2. Create a Google Cloud Project

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable the Google Sheets API for your project:
   - Go to "APIs & Services" > "Library"
   - Search for "Google Sheets API"
   - Enable the API

## 3. Create a Service Account

1. In your Google Cloud project, go to "IAM & Admin" > "Service Accounts"
2. Click "Create Service Account"
3. Give it a name like "egg-tracker-service"
4. Click "Create and Continue"
5. For the role, select "Project" > "Editor"
6. Click "Continue" and then "Done"

## 4. Generate Service Account Key

1. Click on your newly created service account
2. Go to the "Keys" tab
3. Click "Add Key" > "Create new key"
4. Choose JSON format
5. Click "Create"
6. The key file will be downloaded to your computer

## 5. Share Your Google Sheet with the Service Account

1. Open the JSON key file you downloaded
2. Find the "client_email" value (it will look like something@project-id.iam.gserviceaccount.com)
3. Go back to your Google Sheet
4. Click the "Share" button in the top right
5. Add the client_email as a collaborator with Editor permissions
6. Uncheck "Notify people" and click "Share"

## 6. Configure Your Application

1. Create a `.env.local` file in the root of your project (if it doesn't exist already)
2. Add the following environment variables:

```
# Google Sheets API credentials
GOOGLE_SHEETS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEETS_CLIENT_EMAIL="your-service-account-email@project-id.iam.gserviceaccount.com"
GOOGLE_SHEETS_SPREADSHEET_ID="your-spreadsheet-id"

# Set to "true" to use Google Sheets instead of local file
USE_GOOGLE_SHEETS="true"
```

Notes:
- The `GOOGLE_SHEETS_PRIVATE_KEY` should include the entire private key from the JSON file, including the `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----` parts
- The `GOOGLE_SHEETS_SPREADSHEET_ID` can be found in your Google Sheet's URL: `https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit`
- Make sure to replace all newlines in your private key with `\n`

## 7. Restart Your Application

1. If your application is running, stop it
2. Start it again with `npm run dev` (or your preferred start command)
3. Your app should now be using Google Sheets to store egg data

## Troubleshooting

- **Authorization Errors**: Make sure your service account has been added to the Google Sheet with the correct permissions
- **API Errors**: Check if the Google Sheets API is enabled in your Google Cloud project
- **Invalid Credentials**: Double-check the private key and client email in your `.env.local` file
- **Spreadsheet Not Found**: Verify the spreadsheet ID is correct

## Switching Between Local Storage and Google Sheets

To switch between local storage and Google Sheets:

1. Open your `.env.local` file
2. Set `USE_GOOGLE_SHEETS="true"` to use Google Sheets
3. Set `USE_GOOGLE_SHEETS="false"` to use local storage
4. Restart your application for the changes to take effect