//Token of Telegram Bot
var token = "INSERT TELEGRAM BOT TOKEN HERE";
var url = "https://api.telegram.org/bot" + token;

//URL of webApp (obtained after publishing apps script as a webapp)
var webAppUrl = "https://script.google.com/macros/s/AKfycby35UBb553sQ/exec";
var ssID = "INSERT GOOGLE SPREADSHEET HASH KEY HERE";

//add telegram ID (not username) of admin into the array
var adminIDList = [];


//basic getMe function (needed for all webApps)
function getMe() {
  var response = UrlFetchApp.fetch(url + "/getMe");  
  Logger.log(response.getContentText());
}

//basic getUpdates function (needed for all webApps)
function getUpdates() {
  var response = UrlFetchApp.fetch(url + "/getUpdates");  
  Logger.log(response.getContentText());
}

//basic doGet function (can ignore)
function doGet(e) {
  return HtmlService.createHtmlOutput("Hello " + JSON.stringify(e));
}

/**
  * @desc sets up the webhook so that script can be activated when message recieved by bot
  * @param none
  * @return null - no return value
*/
function setWebhook() {
  var response = UrlFetchApp.fetch(url + "/setWebhook?url=" + webAppUrl);  
  Logger.log(response.getContentText());
}

/**
  * @desc deletes the webhook if it is set up
  * @param none
  * @return null - no return value
*/
function deleteWebhook() {
  var response = UrlFetchApp.fetch(url + "/setWebhook?url=");
  Logger.log(response.getContentText());
}

/**
  * @desc sends a text back to a user/group
  * @param string id - the groupID/userID you wish to send a message to
  *        string text - the message you wish to send to a user/group
  * @return null - no return value
*/
function sendText(id, text) {
  var response = UrlFetchApp.fetch(encodeURI(url + "/sendMessage?chat_id=" + id + "&text=" + text));  
  Logger.log(response.getContentText());
}

/**
  * @desc If webhook is set up and a a message is recieved, the doPost method is executed. (actions you wish to execute when a message is recieved)
  * @param object e - represents a single message recieved (holds userID, chatID, name, etc.)
  * @return null - no return value
*/
function doPost(e) {
  try {
    var contents = JSON.parse(e.postData.contents);  
    var text = contents.message.text;
    var id = contents.message.from.id;
    var chatid = contents.message.chat.id;
    var firstname = contents.message.from.first_name;
    var lastname = contents.message.from.last_name; 
    var name = "";
    var dateTime = new Date();
    var ss = SpreadsheetApp.openById(ssID);
    var sep = "=========================================================";
    
    //getting the full name if possible
    if(typeof(lastname) == 'undefined')
      name = firstname;
    else name = firstname + " " + lastname;
    
    //log iff from MoneyNet Bounty Support Group
    if(chatid == -187){
      if(typeof(text) != 'undefined'){
        ss.getSheetByName("Chat Log").appendRow([dateTime, id, name, text]);
        
        //respond to msg if not an admin
        if (adminIDList.indexOf(id) == -1){
          if (text.match(/\?+/)){
            ss.getSheetByName("Inquiry Log").appendRow([dateTime, id, name, text]);
            sendText(chatid, "안녕하세요 " + name + "님, 질문이 기록되었습니다. \n빠른 시간내에 답변 드리겠습니다. \n감사합니다. \n\n질문: \n" + text + " \n\n\n" + sep + "\nHi " + name + ", your question has been recorded. \nThe admin will get back to your question within 24 hours. \n\nQuestion: \n" + text + " \n\n(This is an automated reply)\n"); 
          } else if (text.match(/ pm /i) || text.match(/ dm /i)){
            //logs msgs that have pm or dm in it.
            ss.getSheetByName("Inquiry Log").appendRow([dateTime, id, name, text]);
          }
        }else{
          //logs msgs that are from admin
          ss.getSheetByName("Admin Log").appendRow([dateTime, id, name, text]);
        }
      }
    }else{
      //if not from Moneynet Bounty Support Group
      sendText(chatid, "안녕하세요 " + name + "님, 질문이나 도움이 필요하시면 MoneyNet Bounty Support Group을 가입 해주세요. \n\nMoneyNet Bounty Support Group: \nhttps://t.me/mncio_support \n\n\n" + sep + "\nHi " + name + ", please join the MoneyNet Bounty Support Group for any inquiries. \n\nMoneyNet Bounty Support Group: \nhttps://t.me/mncio_support \n\n(This is an automated reply)\n");
    }
    
  }catch(e) {
    //catch errors by sending email to effective user
    GmailApp.sendEmail(Session.getEffectiveUser().getEmail(), "Telegram Bot Error", JSON.stringify(e, null, 4));
  }
}

/*
<<JSON OBJECT e>> 
{
    "parameter": {},
    "contextPath": "",
    "contentLength": 236,
    "queryString": "",
    "parameters": {},
    "postData": {
        "type": "application/json",
        "length": 236,
        "contents": "{\"update_id\":1726,\n\"message\":{\"message_id\":25,\"from\":{\"id\":5796,\"is_bot\":false,\"first_name\":\"s\",\"language_code\":\"ko-KR\"},\"chat\":{\"id\":-3070,\"first_name\":\"s\",\"type\":\"private\"},\"date\":15320,\"text\":\"hello final test\"}}",
        "name": "postData"
    }
}
*/
