// Paste this whole file into Extensions > Apps Script of your Google Sheet.
// Every registration from the website becomes a new row, and you get an email.

const HEADERS = ['Timestamp', 'Name', 'WhatsApp', 'Email', 'Course', 'Level', 'Preferred time', 'Page'];

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const sh = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    if (sh.getLastRow() === 0) {
      sh.appendRow(HEADERS);
      sh.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold').setBackground('#7c5cff').setFontColor('#ffffff');
      sh.setFrozenRows(1);
    }
    const p = e.parameter;
    // keep the number as text so Excel does not turn +91... into a formula/number
    sh.appendRow([new Date(), p.name, "'" + p.phone, p.email, p.course, p.level, p.time, p.page]);

    const me = Session.getEffectiveUser().getEmail();
    MailApp.sendEmail(me, 'New free-class registration: ' + p.name,
      p.name + '\n' + p.phone + '\n' + p.email + '\n' + p.course + ' · ' + p.level + ' · ' + p.time);
    return ContentService.createTextOutput('ok');
  } finally {
    lock.releaseLock();
  }
}
