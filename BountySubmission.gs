var ssID = "INSERT GOOGLE SPREADSHEET HASH KEY HERE";
var ss = SpreadsheetApp.openById(ssID).getSheetByName("Form Responses");
var postLimit = 3;

/**
  * @desc Manages weekly bounty submissions
  * @param pbject e - an object that holds all the form data (bounty submissions)
  * @return null - no return value
*/
function logSubmission(e) {
  try{
    //array that holds the form data (bounty submissions)
    var ans = e.values; //[타임스탬프(0), 이메일 주소(1),	Date(2), Campaign Category(3), Profile URL(4), No of Posts(5), Current No of Shares(6), Number of Likes(7), Content of Posts(8)]
    
    var ssData = ss.getDataRange().getValues();
    var msg = "";
    
    //COUNT NUMBER OF POST FOR SPECIFIED CATEGORY
    var numPost = 0;
    var row = ss.getRange("A:A");    
    for (var i = 1; i < ssData.length; i++){
      //if same email and same category and NOT strikedthrough COUNT, else ignore (includes the current form submission)
      if (ssData[i][1] == ans[1] && ssData[i][3] == ans[3] && ss.getRange(row.getRow()+i, 1).getFontLine() != "line-through"){
        numPost += ssData[i][5];
      }
    } 
    
    var left = postLimit - (numPost - ans[5]);
    //if OVER weekly limit, then...
    if(numPost > postLimit){
      var r = ss.getRange("A:A");
        
      //iterates through data and finds current submission data
      for (var i = 1; i < ssData.length; i++){
        var tempdate = (ssData[i][2].getFullYear() + ". " + (ssData[i][2].getMonth()+1) + ". " + ssData[i][2].getDate());
        
        //reformat timestamps
        var hrs = ssData[i][0].getHours();
        var mins = ssData[i][0].getMinutes();
        var ampm = hrs >= 12 ? "오후" : "오전";
        hrs = hrs % 12;
        hrs = hrs ? hrs : 12;
        mins = mins < 10 ? '0'+mins : mins;  
        var strTime = ampm + " " + hrs + ":" + mins;
        var timestamp = ssData[i][0].getFullYear() + ". " + (ssData[i][0].getMonth()+1) + ". " + ssData[i][0].getDate() + " " + strTime //2018. 8. 14 오전 11:57:17
        
        //if the data is the current submission, then strikethrough
        if(timestamp == ans[0].slice(0,-3) && ssData[i][1] == ans[1] && tempdate == ans[2] && ssData[i][3] == ans[3]){
          ss.getRange(r.getRow()+i, 1, 1, ss.getLastColumn()).setFontLine("line-through");
          break;
        }
      }
      
      //if PARTIALLY OVER the limit...
      if(left > 0){
        //MAIL USER HOW MANY SUBMISSIONS LEFT
        msg = "Dear " + ans[1] + ", \n\nYou have " + left + " submission left for this week. \nPlease select the post you wish to submit and resubmit the form. \nYour previous submission has been disregarded. \n\nThank you! \n\n(This is an automated email)";
        GmailApp.sendEmail(ans[1], "[MONEYNET.IO] Bounty Submission (Automated)", msg);
        
      }else{
        //if COMPLETELY OVER the limit...
        //MAIL USER SUBMISSION LIMIT REACHED
        msg = "Dear " + ans[1] + ", \n\nYou have reached your weekly submission limit. \nThank you for your hardwork and please participate again next week. \nYour previous submission is not recorded. \n\nThank you! \n\n(This is an automated email)";
        GmailApp.sendEmail(ans[1], "[MONEYNET.IO] Bounty Submission (Automated)", msg);
      }
    }else{
      //if NOT OVER the limit...
      //MAIL USER'S SUBMISSION HAS BEEN RECORDED (RECIEPT)
      msg = "Dear " + ans[1] + ", \n\nYour submission has been successfully recorded. \nThank you for your hardwork! \nYou have " + left + "submissions left for this week. \n\nThank you! \n\n(This is an automated email)";
      GmailApp.sendEmail(ans[1], "[MONEYNET.IO] Bounty Submission (Automated)", msg);
    }
    
  }catch(e){
    //catch errors by sending email to effective user  
    GmailApp.sendEmail(Session.getEffectiveUser().getEmail(), "Google form handler Error", JSON.stringify(e, null, 4));
  }
}
