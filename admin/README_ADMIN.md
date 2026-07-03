ADMIN BACKEND INTEGRATION

Files added in this branch:
- admin/admin.html
- admin/admin.js
- scripts/Code.gs (Google Apps Script server code; paste into script.google.com)

What you must do next:
1) Google Sheets
   - Open your spreadsheet (ID prefilled in Code.gs). Create sheet named "AccessCodes" and put allowed access codes in column A (one per row).
   - Ensure sheet "LMSANDEN" exists or let the script create it.
   - (Optional) Create sheet "QuizResults" with columns including Author and CorrectCount if you want automatic star calculation.

2) Google Apps Script
   - Create a new project at https://script.google.com
   - Paste the content of scripts/Code.gs into the editor.
   - In Project Settings > Script Properties, set CERT_TEMPLATE_ID (Google Docs template ID), and optionally WHATSAPP_TOKEN and WHATSAPP_PHONE_ID for WA Cloud API.
   - Deploy > New deployment > Web app
       - Execute as: Me
       - Who has access: Anyone (or Anyone with link)
   - Copy Web app URL and replace WEBAPP_URL_PLACEHOLDER in admin/admin.js with it.

3) Admin page
   - Put admin/ folder on your hosting or into the repo (already added to this branch).
   - Open admin/admin.html, test login (use one of AccessCodes), submit a karya. Check LMSANDEN sheet for new row.

4) Front-end gallery
   - Update your front-end script to fetch data from the WebApp: WEBAPP_URL?action=getAll and render only rows where Visible == 'YA'.

Notes and security:
- Keep AccessCodes sheet private; anyone with edit access to sheet can add codes.
- Sending WhatsApp via Cloud API needs a valid Business/Cloud token and phone id.
- Certificate template must be a Google Docs file with placeholders: {{TITLE}}, {{AUTHOR}}, {{DATE}}, {{DESCRIPTION}}.
