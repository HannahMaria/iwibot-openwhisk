var request = require('request');

function main(params) {
    var url = "https://www.iwi.hs-karlsruhe.de/Intranetaccess/REST/library/borrowedbooks/deadlines";
    var language = "de-DE";
    var responseObject = {};

    return new Promise(function (resolve, reject) {
        var booksArray = params.entities;
        var booksToExtend = '';
        if (booksArray[0].value === 'alle') {
            booksToExtend = 'all'
        } else {
            for (i = 0; booksArray.length; i++) {
                booksToExtend += booksArray[i].value + ', ';
            }
        }
        request({
            url: url,
            headers: {
                'Authorization': 'Basic ' + params.context.iwibotCreds,
                'Accept': 'text/html -d ' + booksToExtend
            }
        }, function (error, response, body) {

            if (!error && response.statusCode === 200) {
                var extendetBooks = JSON.parse(body);
                if (extendetBooks.length === 0) {
                    responseObject.payload = "Es konnten leider keine Bücher verlängert werden. Hast du vielleicht die falsche Signatur mitgegeben? Oder sind sie bereits vorgemerkt?";
                } else {
                    if(booksToExtend.length > extendetBooks.length){
                        responseObject.payload = "Es konnten " + booksToExtend.length - extendetBooks.length  +" Bücher nicht verlängert werden. ";
                    }
                        responseObject.payload = "Folgende Bücher wurden erfolgreich verlängert:";

                    responseObject.htmlText = "<ul >";
                    extendetBooks.forEach(function (book) {
                        responseObject.htmlText = responseObject.htmlText + "<li><h3>" + book.bookTitle + "</h3>" +
                            "Neues Rückgabedatum: " + book.returnDate + "<br>" +
                            "Signatur: " + book.signature + "</li>";
                        responseObject.language = language;
                    });
                    responseObject.htmlText = responseObject.htmlText + "</ul>";
                }
                resolve(responseObject);
            } else {
                console.log('http status code:', (response || {}).statusCode);
                var payload = "Es ist ein unerwarteter Fehler aufgetreten.";
                switch (response.statusCode) {
                    case 500:
                        payload = "Der QIS-Server ist zurzeit offline.";
                        break;
                    case 401:
                        payload = "Um deine Bücher verlängern zu können, musst du dich einloggen.";
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