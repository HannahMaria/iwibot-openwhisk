var request = require('request');

function main(params) {
    var url = "https://www.iwi.hs-karlsruhe.de/Intranetaccess/REST/library/borrowedbooks";
    var language = "de-DE";
    var responseObject = {};

    return new Promise(function (resolve, reject) {
        request({
            url: url,
            headers: {
                'Authorization': 'Basic ' + params.context.iwibotCreds
            }
        }, function (error, response, body) {

            if (!error && response.statusCode === 200) {
                var borrowedBooks = JSON.parse(body);
                if (borrowedBooks.length === 0 || borrowedBooks.length === undefined || borrowedBooks === undefined) {
                    responseObject.payload = "Du hast Aktuell keine Bücher ausgeliehen! :)";
                } else {
                    responseObject.htmlText = "<ul >";
                    responseObject.payload = "Deine Ausgeliehenen Bücher:";
                    borrowedBooks.forEach(function (book) {
                        responseObject.htmlText = responseObject.htmlText + "<li><h3>" + book.bookTitle + "</h3>" +
                            "Ausleihstatus: " + book.currentStatus + " <br>" +
                            "Übrige Tage: " + book.daysLeft + "<br>" +
                            "Rückgabedatum: " + book.returnDate + "<br>" +
                            "Buch vorgemerkt: " + book.preregistrationStatus + "<br>" +
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
                        payload = "Um deine ausgehliehenen Bücher sehen zu können, musst du dich einloggen.";
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