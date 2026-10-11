// Deployed Google Apps Script web app (already set up and linked in script.js).
// doPost: saves each registration as a row, emails the STUDENT a confirmation,
//         and emails the OWNER with a one-tap WhatsApp welcome link.
// doGet : returns {count, recent:[{name(first), course, at}]} for the live counter.
const SHEET_ID = '1PBu8hxvKP7kJuT62hugAuaa0cpigsAvGPXNgbupFjnE';
const HEADERS = ['Timestamp', 'Name', 'WhatsApp', 'Email', 'Course', 'Level', 'Preferred time', 'Page', 'Send WhatsApp welcome'];
const OWNER_NAME = 'Lakshmi Prasad Gondinigari';
const OWNER_WA = '918179028339';
const SITE = 'https://lakshmiprasadgondinigari123.github.io/portfolio/';

function sheet_() { return SpreadsheetApp.openById(SHEET_ID).getSheets()[0]; }

function esc_(s) {
  return String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
}

function waNumber_(raw) {
  let d = String(raw || '').replace(/\D/g, '');
  if (d.length === 10) d = '91' + d;          // assume India for 10-digit numbers
  return d;
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const sh = sheet_();
    if (sh.getLastRow() === 0) sh.appendRow(HEADERS);
    sh.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS])
      .setFontWeight('bold').setBackground('#7c5cff').setFontColor('#ffffff');
    sh.setFrozenRows(1);

    const p = e.parameter;
    const first = String(p.name || '').trim().split(/\s+/)[0] || 'there';
    const num = waNumber_(p.phone);
    const welcome = 'Hi ' + first + '! Thanks for registering for our free ' + p.course + ' course. We will be sharing the batch details shortly. Please stay tuned! - ' + OWNER_NAME;
    const waLink = num ? 'https://wa.me/' + num + '?text=' + encodeURIComponent(welcome) : '';

    sh.appendRow([new Date(), p.name, "'" + p.phone, p.email, p.course, p.level, p.time, p.page, waLink]);

    // 1) Confirmation email to the student
    if (/^\S+@\S+\.\S+$/.test(String(p.email || ''))) {
      try {
        MailApp.sendEmail({
          to: p.email,
          name: OWNER_NAME,
          subject: "You're registered! Free " + p.course + ' class',
          body: 'Hi ' + first + ',\n\nYou have successfully registered for the free ' + p.course + ' class.\n' +
            'Level: ' + p.level + '\nPreferred time: ' + p.time + '\n\n' +
            "I'll message you on WhatsApp (" + p.phone + ') with the batch time and class link. ' +
            'You can also message me: https://wa.me/' + OWNER_WA + '\n\nSee you in class!\n' + OWNER_NAME + '\n' + SITE,
          htmlBody:
            '<div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;border:1px solid #e5e7f0;border-radius:16px;overflow:hidden">' +
            '<div style="background:linear-gradient(120deg,#7c5cff,#22d3ee);padding:28px;color:#fff">' +
            '<div style="font-size:13px;opacity:.9">Registration confirmed ✔</div>' +
            '<h1 style="margin:6px 0 0;font-size:24px">You\'re in, ' + esc_(first) + '! 🎉</h1></div>' +
            '<div style="padding:24px;color:#14172b;line-height:1.6">' +
            '<p>You have <b>successfully registered</b> for the free <b>' + esc_(p.course) + '</b> class.</p>' +
            '<table style="width:100%;border-collapse:collapse;font-size:14px">' +
            '<tr><td style="padding:8px 0;color:#5b6280">Course</td><td><b>' + esc_(p.course) + '</b></td></tr>' +
            '<tr><td style="padding:8px 0;color:#5b6280">Your level</td><td>' + esc_(p.level) + '</td></tr>' +
            '<tr><td style="padding:8px 0;color:#5b6280">Preferred time</td><td>' + esc_(p.time) + '</td></tr>' +
            '<tr><td style="padding:8px 0;color:#5b6280">WhatsApp</td><td>' + esc_(p.phone) + '</td></tr></table>' +
            '<p><b>What happens next?</b><br>We will be sharing the batch details shortly on WhatsApp and email. Please stay tuned!</p>' +
            '<p><a href="https://wa.me/' + OWNER_WA + '" style="display:inline-block;background:#25d366;color:#04130c;text-decoration:none;font-weight:bold;padding:12px 22px;border-radius:10px">Chat with me on WhatsApp</a></p>' +
            '<p style="color:#5b6280;font-size:13px">— ' + OWNER_NAME + '<br>Python &amp; GenAI Developer · <a href="' + SITE + '">' + SITE + '</a></p>' +
            '</div></div>'
        });
      } catch (err) {}
    }

    // 2) Notification to the owner with a one-tap WhatsApp welcome link
    try {
      MailApp.sendEmail(Session.getEffectiveUser().getEmail(), 'New free-class registration: ' + p.name,
        p.name + '\n' + p.phone + '\n' + p.email + '\n' + p.course + ' | ' + p.level + ' | ' + p.time +
        '\n\nSend WhatsApp welcome (one tap):\n' + waLink);
    } catch (err) {}

    return ContentService.createTextOutput('ok');
  } finally { lock.releaseLock(); }
}

function doGet(e) {
  const sh = sheet_(), last = sh.getLastRow(), n = Math.max(last - 1, 0), recent = [];
  if (n > 0) {
    const from = Math.max(2, last - 4);
    sh.getRange(from, 1, last - from + 1, 5).getValues().reverse().forEach(r => recent.push({
      name: String(r[1]).trim().split(/\s+/)[0], course: r[4], at: new Date(r[0]).toISOString() }));
  }
  return ContentService.createTextOutput(JSON.stringify({ count: n, recent: recent })).setMimeType(ContentService.MimeType.JSON);
}
