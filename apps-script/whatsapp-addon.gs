// OPTIONAL add-on: automatic WhatsApp confirmation to the student's number via the
// official WhatsApp Business Cloud API. NOT deployed yet. See ../WHATSAPP_SETUP.md.
//
// How to enable (after you have the 3 values from Meta):
//   1. Paste this function into your Apps Script project (Code.gs), below doGet.
//   2. Project Settings > Script properties, add:
//        WA_TOKEN      = permanent access token
//        WA_PHONE_ID   = Phone number ID of your WhatsApp Business number
//        WA_TEMPLATE   = approved template name, e.g. class_registration
//   3. In doPost, right after the sheet row is appended, add:   sendWhatsApp_(p, num);
//   4. Run any function once in the editor and click "Allow" (new permission: external requests),
//      then Deploy > Manage deployments > Edit > New version > Deploy.
//
// The template should have 2 body variables:  Hi {{1}}, you are registered for the free {{2}} class...

function sendWhatsApp_(p, num) {
  const props = PropertiesService.getScriptProperties();
  const token = props.getProperty('WA_TOKEN');
  const phoneId = props.getProperty('WA_PHONE_ID');
  const template = props.getProperty('WA_TEMPLATE');
  if (!token || !phoneId || !template || !num) return;          // not configured: do nothing
  const first = String(p.name || '').trim().split(/\s+/)[0] || 'there';
  try {
    UrlFetchApp.fetch('https://graph.facebook.com/v21.0/' + phoneId + '/messages', {
      method: 'post',
      contentType: 'application/json',
      headers: { Authorization: 'Bearer ' + token },
      muteHttpExceptions: true,
      payload: JSON.stringify({
        messaging_product: 'whatsapp',
        to: num,                                                  // digits with country code
        type: 'template',
        template: {
          name: template,
          language: { code: 'en' },
          components: [{ type: 'body', parameters: [
            { type: 'text', text: first },
            { type: 'text', text: String(p.course || 'class') }
          ] }]
        }
      })
    });
  } catch (err) { /* never break registration if WhatsApp fails */ }
}
