var emailDomain="@exm.zeven-linden.nl";
var baseOrgUnit="zeven-linden.nl/Examen/Accounts";

var statementHeader;
var TemplateID =  '1JnzHU--Aj69mSYScDwbRQ-K9KQkcC05elx4D_gFtIQU';
var outputDocId = '1wTiCLfoqnckTGqu-Jo9EpgeqOEDL2ZZolOXAAY-s4Xw';

var outputDir='1Z5gLsuBq8NwPOF7tPhIbxEfqnIDvMBjq';


function onOpen() {
    var ui = SpreadsheetApp.getUi();
    ui.createMenu('Examen')
      //.addItem('Maak wachtwoorden','setPassword_')
      .addItem('Maak print document', 'createDocs_')
      .addItem('Update accounts uit Tabblad', 'updateAccounts')
      .addToUi();
};

function updateAccounts() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet();
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    
    if (data[i][0] != ''){
    
      var email=data[i][0]+emailDomain;
      console.log(email);
      var status=checkUserKey_(email);
    
      if (data[i][1] == "Open"){
        var suspend=false;
      } else {
        var suspend=true;
      }

      if (status == "INSERT"){
          var UserParam = {
           primaryEmail:email,
           name: {
               familyName:data[i][0],
               givenName:data[i][2],
           },
           password:data[i][3],
           changePasswordAtNextLogin: false,
           orgUnitPath:'/'+baseOrgUnit,
           suspended:suspend       
         };
         console.log(UserParam );
         insertUser_(UserParam,email);
      }

      if (status == "UPDATE"){
          var UserParam = {    
           primaryEmail:email,
           orgUnitPath:'/'+baseOrgUnit,
           password:data[i][3],
           suspended:suspend
          };
         updateUser_(UserParam,email); 
      }
    }

  }  
}

function setPassword_(){
    var sheet = SpreadsheetApp.getActiveSpreadsheet();
    var data = sheet.getDataRange().getValues();
    for (var i = 1; i < data.length; i++) {
      if (data[i][0] != ''){
        var cell = sheet.getRange("D"+(i+1));
        cell.setValue(generatePassword_());
      }
    }  

}

function createDocs_(){
    var datum = Utilities.formatDate(new Date(), "GMT+1", "dd-MM-yyyy");
    var jaar = Utilities.formatDate(new Date(), "GMT+1", "yyyy");
    var templateBody = DocumentApp.openById(TemplateID).getBody();
    var body = DocumentApp.openById(outputDocId).getBody();  
    body.clear();
    var sheet = SpreadsheetApp.getActiveSpreadsheet();
    var data = sheet.getDataRange().getValues();
    for (var i = 1; i < data.length; i++) {
     if (data[i][0] != ''){ 
        statementHeader = templateBody.getChild(1).copy();
        body.appendTable(statementHeader);
        body.replaceText('{{student}}', data[i][2]);     
        body.replaceText('{{account}}', data[i][0]);
        body.replaceText('{{password}}',data[i][3] );
        body.replaceText('{{lesgroep}}',data[1][4]);
        body.replaceText('{{wevideo}}',data[1][5]);
        body.replaceText('{{datum}}',datum );
        body.replaceText('{{jaar}}',jaar );
        body.appendPageBreak();
     }  
    }
}

function createNewDocs(){
    /** Test code */
    var datum = Utilities.formatDate(new Date(), "GMT+1", "dd-MM-yyyy");
    var jaar = Utilities.formatDate(new Date(), "GMT+1", "yyyy");
    var filename = Utilities.formatDate(new Date(), "GMT+1", "ddMMyyyyHHmm");
    var folder = DriveApp.getFolderById(outputDir);

    var templateBody = DocumentApp.openById(TemplateID).getBody();
    var body=DocumentApp.create('Examen_Account'+filename);
        body.moveTo(folder);

    var sheet = SpreadsheetApp.getActiveSpreadsheet();
    
    var data = sheet.getDataRange().getValues();
    for (var i = 1; i < data.length; i++) {
     if (data[i][0] != ''){ 
        statementHeader = templateBody.getChild(1).copy();
        body.appendTable(statementHeader);
        body.replaceText('{{student}}', data[i][2]);     
        body.replaceText('{{account}}', data[i][0]+emailDomain);
        body.replaceText('{{password}}',data[i][3] );
        body.replaceText('{{lesgroepcode}}',data[i][4] );
        body.replaceText('{{datum}}',datum );
        body.replaceText('{{jaar}}',jaar );
        body.appendPageBreak();
     }  
    }
}




function checkUserKey_(email){
  Logger.log('Check Key:'+email);
  var result="";
  try {
    var users=AdminDirectory.Users.list({customer:'my_customer',query:'email='+email}); 
      var email=users.users[0].primaryEmail;
      Logger.log('Found '+users.users[0].primaryEmail);
      var result="UPDATE";
  } catch(e) {
      var result="INSERT";
      Logger.log('Not Found '+email);
  }
  return result;
}



function insertUser_(UserParam,email){
    Logger.log('Insert '+email);
    try {
       var user = AdminDirectory.Users.insert(UserParam);  
       Logger.log('User %s created with ID %s.', user.primaryEmail, user.id);  
       //mailInsert=mailInsert+" Aangemaakt ("+user.primaryEmail+") <br/>";   
    } catch (e) {
      Logger.log('Error:'+e.message);
       //mailError=mailError+" Insert ("+e.message+")";
    } 
    return;
} 
 
function updateUser_(UserParam,email){
     Logger.log('Update '+email);
     try {
        var user = AdminDirectory.Users.update(UserParam,email);
        Logger.log('Update %s with ID %s.', user.primaryEmail, user.id);
        //mailUpdate=mailUpdate+"Update:("+user.primaryEmail+") <br/>";
    } catch (e) {
         console.log('Error:'+e.message);
         //mailError=mailError+" Update ("+e.message+")";
    }    
    
    return;
}  


function generatePassword_() {
  var text = "";
  var possible = "ABCDEFGHJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz123456789";
    for(var i=0;i<8;i++){
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    Logger.log(text);
   return text;
}



