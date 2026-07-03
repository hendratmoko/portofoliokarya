Google Apps Script (Code.gs)

// Paste this into a new Google Apps Script project and deploy as Web App.

const SPREADSHEET_ID = '1A9zJC2ROfRCNz6FRONTM00xr3Ez-3V74H1S_-dcwtG8';
const SHEET_NAME = 'LMSANDEN';
const ACCESS_CODES_SHEET = 'AccessCodes';
const QUIZ_SHEET = 'QuizResults';

function doGet(e) {
  const action = (e.parameter.action || '');
  if (action === 'getAll') {
    return ContentService.createTextOutput(JSON.stringify(getAllRows())).setMimeType(ContentService.MimeType.JSON);
  }
  if (action === 'verifyCode') {
    const code = (e.parameter.code || '').trim();
    const valid = verifyAccessCode(code);
    return ContentService.createTextOutput(JSON.stringify({ valid })).setMimeType(ContentService.MimeType.JSON);
  }
  return ContentService.createTextOutput(JSON.stringify({ error: 'no action' })).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  if (data.action === 'submitKarya') {
    return handleSubmitKarya(data);
  }
  return ContentService.createTextOutput(JSON.stringify({ error: 'unsupported action' })).setMimeType(ContentService.MimeType.JSON);
}

function verifyAccessCode(code) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName(ACCESS_CODES_SHEET);
  if (!sheet) return false;
  const vals = sheet.getRange(1,1,sheet.getLastRow(),1).getValues().flat().map(String);
  return vals.indexOf(String(code)) !== -1;
}

function handleSubmitKarya(data) {
  if (!verifyAccessCode(data.accessCode || '')) {
    return ContentService.createTextOutput(JSON.stringify({ success:false, error:'Kode akses tidak valid' })).setMimeType(ContentService.MimeType.JSON);
  }

  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    const headers = ['Timestamp','Title','Description','Category','Link','Visible','Year','Subject','Author','WhatsApp','Certified','CertificateURL','Stars','SubmittedBy','AccessCode'];
    sheet.getRange(1,1,1,headers.length).setValues([headers]);
  }

  const timestamp = (new Date()).toISOString();
  const row = [
    timestamp,
    data.title || '',
    data.description || '',
    data.category || '',
    data.link || '',
    data.visible || 'YA',
    data.year || '',
    data.subject || '',
    data.author || '',
    data.whatsapp || '',
    'TIDAK',
    '',
    0,
    data.submittedBy || '',
    data.accessCode || ''
  ];

  sheet.appendRow(row);
  const rowId = sheet.getLastRow();

  let certificateUrl = null;
  if (data.createCertificate === 'yes') {
    const stars = calcStarsForAuthor(data.author);
    sheet.getRange(rowId, 13).setValue(stars);
    if (stars >= 10) {
      certificateUrl = createCertificatePdf({
        title: data.title,
        author: data.author,
        date: new Date(),
        description: data.description
      });
      sheet.getRange(rowId, 11).setValue('YA');
      sheet.getRange(rowId, 12).setValue(certificateUrl);
      if (data.whatsapp) {
        try {
          sendWhatsAppTemplateWithMedia(data.whatsapp, certificateUrl, 'Sertifikat Karya Anda');
        } catch (e) {
          Logger.log('WA send error: ' + e);
        }
      }
    }
  }

  return ContentService.createTextOutput(JSON.stringify({ success:true, rowId, certificateUrl: certificateUrl || null })).setMimeType(ContentService.MimeType.JSON);
}

function getAllRows() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) return [];
  const values = sheet.getDataRange().getValues();
  const headers = values.shift();
  return values.map(r => {
    const obj = {};
    headers.forEach((h,i) => obj[h] = r[i]);
    return obj;
  }).reverse();
}

function calcStarsForAuthor(authorName) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName(QUIZ_SHEET);
  if (!sheet) return 0;
  const rows = sheet.getDataRange().getValues();
  const headers = rows.shift();
  const authorIdx = headers.indexOf('Author');
  const correctIdx = headers.indexOf('CorrectCount');
  if (authorIdx < 0 || correctIdx < 0) return 0;
  let totalCorrect = 0;
  rows.forEach(r => {
    if ((r[authorIdx] || '') == authorName) {
      totalCorrect += Number(r[correctIdx] || 0);
    }
  });
  const stars = Math.max(0, Math.min(10, Math.floor(totalCorrect)));
  return stars;
}

function createCertificatePdf(data) {
  const TEMPLATE_ID = PropertiesService.getScriptProperties().getProperty('CERT_TEMPLATE_ID');
  if (!TEMPLATE_ID) throw new Error('CERT_TEMPLATE_ID tidak diset (script properties)');
  const tempDoc = DriveApp.getFileById(TEMPLATE_ID).makeCopy('Certificate - ' + data.author + ' - ' + new Date().toISOString());
  const docId = tempDoc.getId();
  const doc = DocumentApp.openById(docId);
  const body = doc.getBody();
  body.replaceText('\{\{TITLE\}\}', data.title || '');
  body.replaceText('\{\{AUTHOR\}\}', data.author || '');
  body.replaceText('\{\{DATE\}\}', Utilities.formatDate(new Date(data.date), Session.getScriptTimeZone(), 'dd MMMM yyyy'));
  body.replaceText('\{\{DESCRIPTION\}\}', data.description || '');
  doc.saveAndClose();

  const pdfFile = DriveApp.getFileById(docId).getAs(MimeType.PDF);
  const newFile = DriveApp.createFile(pdfFile).setName('Sertifikat - ' + data.author + ' - ' + (new Date()).toISOString());
  DriveApp.getFileById(docId).setTrashed(true);
  try {
    newFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  } catch (e) {}
  return newFile.getUrl();
}

function sendWhatsAppTemplateWithMedia(recipientNumber, mediaUrl, messageText) {
  const token = PropertiesService.getScriptProperties().getProperty('WHATSAPP_TOKEN');
  const phoneId = PropertiesService.getScriptProperties().getProperty('WHATSAPP_PHONE_ID');
  if (!token || !phoneId) {
    throw new Error('WHATSAPP_TOKEN atau WHATSAPP_PHONE_ID belum diset di script properties');
  }
  const sendUrl = 'https://graph.facebook.com/v16.0/' + phoneId + '/messages?access_token=' + token;
  const payload2 = {
    messaging_product: 'whatsapp',
    to: recipientNumber,
    type: 'text',
    text: { body: messageText + '\nSertifikat: ' + mediaUrl }
  };
  const options = {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(payload2),
    muteHttpExceptions: true
  };
  const resp = UrlFetchApp.fetch(sendUrl, options);
  return resp.getContentText();
}
