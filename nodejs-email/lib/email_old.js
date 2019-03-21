var request = require('request');

function main(params) {
    if("__ow_body" in params) { // Für das Testen erforderlich..
        Object.assign(params, JSON.parse(params.__ow_body));
    }

    // So bekommst du in den logs mit, welche parameter diese Aktion zur Verfügung hat.
    console.log("------Template Action started!------");
    console.log("TemplateAction Params:" + JSON.stringify(params, null, 4));


    var responseObject = {};
    return getMailBoxID(params).then(function(response){
    	console.log("Response:" + response);
    	return new Promise(function (resolve, reject) {
    		  var url = "https://www.iwi.hs-karlsruhe.de/Intranetaccess/REST/exchange/emails/" + response
    	      request({
    	              url: url,
    	              headers: {
    	                  'Authorization': 'Basic ' + params.context.iwibotCreds
    	              }
    	          }, function (error, response, body) {

    	              if (!error && response.statusCode === 200) {
    	                  var bodyObject = JSON.parse(body);
    	                  var count = 0;
    	                  var sender;
    	                  var sendDate;
    	                  var subject;
    	                  var body;
    	                  var htmlText = '<ul>'
    	                  bodyObject.forEach(function (element) {
    	                      if (count < 5) {
    	                    	  sender = element.sender.address;
    	                          sendDate = element.dateSent;
    	                          subject = element.subject;
    	                          body = element.body;
    	                          //Email#
    	                          htmlText += '<li>'  + "Subject:" + subject
    	                          htmlText += '<ul>'
    	                          htmlText += '<li>' + "Sender:" + sender + '</li>'
    	                          htmlText += '<li>' + "Sent Date:" + sendDate + '</li>'
    	                          htmlText += '<li>' + "Body:" + body + '</li>'
    	                          htmlText += '</ul>'
    	                          htmlText += '</li>'
    	                          count = count +1;
    	                      }
    	                      
    	                  });
    	                  htmlText += '</ul>'
    	                  responseObject.payload = "Hier ist deine Email:";
    	                  responseObject.htmlText = htmlText;

    	                  resolve(responseObject);
    	              } else {
    	                  console.log('http status code:', (response || {}).statusCode);
    	                  var payload = "Es ist ein unerwarteter Fehler aufgetreten.";
    	                  switch (response.statusCode) {
    	                      case 502:
    	                          payload = "Der Mail-Server meldet einen Fehler.";
    	                          break;
    	                      case 401:
    	                          payload = "Um deine Email zu erhalten, musst du dich einloggen.";
    	                          break;
    	                      case 400:
    	                          payload = "Mail-Ordners ID ist ungültig.";
    	                          break;
    	                      case 403:
    	                          payload = "Der Aufrufer ist weder Student noch eingetragener Mitarbeiter.";
    	                          break;
    	                  }
    	                  console.log('error:', error);
    	                  console.log('body:', body);
    	                  responseObject.payload = payload;

    	                  resolve(responseObject);
    	              }
    	          });
    	    });
    })
    
}

function getMailBoxID(params){
  var url = "https://www.iwi.hs-karlsruhe.de/Intranetaccess/REST/exchange/mailfolders";
  var mailboxID
  return new Promise(function (resolve, reject) {
    request({
            url: url,
            headers: {
                'Authorization': 'Basic ' + params.context.iwibotCreds
            }
        }, function (error, response, body) {

            if (!error && response.statusCode === 200) {
                var bodyObject = JSON.parse(body);
                bodyObject.forEach(function (element) {
                    if (element.name === params.entities[0].value.toLowerCase()) {
                        resolve(element.id);
                    }
                });

            } else {
                console.log('http status code:', (response || {}).statusCode);
                var payload = "Es ist ein unerwarteter Fehler aufgetreten.";
                switch (response.statusCode) {
                    case 401:
                        payload = "Um deine Email zu erhalten, musst du dich einloggen.";
                        break;
                }
                console.log('error:', error);
                console.log('body:', body);
                responseObject.payload = payload;

                resolve(responseObject);
            }
        });
  });
}
exports.main = main;
