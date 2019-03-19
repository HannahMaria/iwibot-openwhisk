var request = require('request');

function main(params) {
    var url = "https://www.iwi.hs-karlsruhe.de/Intranetaccess/REST/library/v2/names";
    var language = "de-DE";
    var responseObject = {};

    return new Promise(function (resolve, reject) {
        request({
            url: url,
        }, function (error, response, body) {

            if (!error && response.statusCode === 200) {
                var bibNames = JSON.parse(body);
                responseObject.htmlText = "<ul >";
                responseObject.payload = "In Karlsruhe gibt es 16 Bibliotkehen:";

                //will be shown as a List
                bibNames.forEach(function (bib) {
                    responseObject.htmlText = responseObject.htmlText + "<li><h3>" + bib.id + "</h3>" +
                        "Name: " + bib.name +  "</li>";
                    responseObject.language = language;
                });
                responseObject.htmlText = responseObject.htmlText + "</ul>";
                responseObject.language = language;

                resolve(responseObject);
            } else {
                //catch errors
                console.log('http status code:', (response || {}).statusCode);
                var payload = "Es ist ein unerwarteter Fehler aufgetreten.";
                switch (response.statusCode) {
                    case 500:
                        payload = "Der QIS-Server ist zurzeit offline.";
                        break;
                }
                console.log('error:', error);
                console.log('body:', body);
                responseObject.payload = payload;
                resolve(responseObject);
            }
        });
    })
        .catch(err => {
            console.log(err);
        });
}

exports.main = main;
