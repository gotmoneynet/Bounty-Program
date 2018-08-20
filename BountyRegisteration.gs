var ssID = "INSERT GOOGLE SPREADSHEET HASH KEY HERE";

/**
  * @desc Classifies form data (registeration information) into different sheets
  * @param pbject e - an object that holds all the form data (registeration information)
  * @return null - no return value
*/
function myFunction(e) {
  try{
    //array that holds the form data (registeration information)
    var ans = e.values; //[타임스탬프(0), 이메일 주소(1), 이더리움 지갑 주소(2), 바운티 종류(3), 트위터 프로필 주소(4), 비트코인톡 프로필 주소(5), 블로그 주소(6), 페이스북 프로필 주소(7), 인스타그램 사용자ID(8), 유튜브 채널 주소(9)]									]
    Logger.log(ans);
    //opens the sheet where the form data would be classfied to
    var ss = SpreadsheetApp.openById(ssID).getSheetByName(ans[3]);
    
    //switch statement used to calssify form data into different sheets (stores it in data variable)
    var data;
    switch(ans[3]){
      case "트위터 (Twitter)":
        data = [ans[0], ans[1], ans[2], ans[3], ans[4]];
        break;
      
      case "Signature":
        data = [ans[0], ans[1], ans[2], ans[3], ans[5]];
        break;
      
      case "블로그 (Blog)":
        data = [ans[0], ans[1], ans[2], ans[3], ans[6]];
        break;
      
      case "페이스북 (Facebook)":
        data = [ans[0], ans[1], ans[2], ans[3], ans[7]];
        break;
      
      case "영상 제작 (Video Creation)":
        data = [ans[0], ans[1], ans[2], ans[3], ans[8]];
        break;
                                        
    }
    
    //appends the data variable into the spreadsheet
    ss.appendRow(data);
  
  }catch(e){
    //catch errors by sending email to effective user  
    GmailApp.sendEmail(Session.getEffectiveUser().getEmail(), "Google form handler Error", JSON.stringify(e, null, 4));
  }
}
