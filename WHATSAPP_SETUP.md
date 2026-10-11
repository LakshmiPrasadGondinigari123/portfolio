# Automatic WhatsApp confirmation (WhatsApp Business Cloud API)

Everything else (sheet, email, live counter) already works. This adds a WhatsApp message
that is sent to the student's number automatically.

## What you need (one time, about 30 minutes plus template approval)
1. A Facebook account and a **Meta Business** account: https://business.facebook.com
2. A **Meta developer app**: https://developers.facebook.com > My Apps > Create App > Business > add the **WhatsApp** product.
3. A phone number to send from. It must NOT be registered in the normal WhatsApp app
   (use a spare SIM, or delete WhatsApp on that number first). Meta's free test number only
   messages up to 5 numbers you verify, so it is only for testing.
4. A **message template** (WhatsApp Manager > Message templates), category *Utility*, language English:

   > Hi {{1}}, thanks for registering for our free {{2}} course! We will be sharing the batch details
   > shortly. Please stay tuned. - Lakshmi Prasad

5. A **permanent access token**: Business Settings > System users > add a system user >
   generate token with `whatsapp_business_messaging` permission.

## Values to collect
| Value | Where |
|---|---|
| Phone number ID | WhatsApp > API Setup |
| Access token | System user token (step 5) |
| Template name | Name you gave the template (step 4) |

## Turn it on
Follow the header of `apps-script/whatsapp-addon.gs`. It is safe: if any value is missing or
WhatsApp fails, registration, sheet row and email still work.

## Cost note
Meta charges per template message (a few rupees in India). Check current pricing in WhatsApp Manager.
