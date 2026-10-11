# Free-class registration: one-time setup (about 5 minutes)

The website cannot write to a file by itself (GitHub Pages is static), so each
registration is sent to a free Google Sheet. The Sheet downloads as Excel any time.

## 1. Create the Sheet + connector
1. Go to https://sheets.new and name it **Free Class Registrations**.
2. Menu **Extensions > Apps Script**. Delete the sample code and paste all of
   `apps-script/Code.gs`. Click **Save**.
3. Click **Deploy > New deployment**. Gear icon > **Web app**.
   - Execute as: **Me**
   - Who has access: **Anyone**
4. Click **Deploy**, approve the permissions (Advanced > Go to project), and copy the
   **Web app URL** (ends in `/exec`).

## 2. Connect the website
Open `script.js`, go to the bottom block and set:

```js
const WHATSAPP  = '918179028339';  // your WhatsApp number: country code + number, digits only
const SHEET_URL = 'PASTE_THE_/exec_URL_HERE';
```

## 3. Publish
```
git add -A
git commit -m "Add free class registration"
git push
```
GitHub Pages updates in about a minute.

## Getting the Excel file
Open the Sheet > **File > Download > Microsoft Excel (.xlsx)**.
You also get an email for every new registration.

## Notes
- If you change the Apps Script code later, use **Deploy > Manage deployments > Edit > New version**.
- Until `SHEET_URL` is set, the form still works: it sends the registration to your WhatsApp.
