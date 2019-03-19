var request = require('request');

function main(params) {
    var url = "https://www.iwi.hs-karlsruhe.de/Intranetaccess/REST/library/v2/info/";
    var language = "de-DE";
    var responseObject = {};

    return new Promise(function (resolve, reject) {
        const bibname = params.entities[0].value;
        request({
            url: url + bibname,
        }, function (error, response, body) {

            if (!error && response.statusCode === 200) {
                var bibInfo = JSON.parse(body).seatestimate;
                if (bibInfo.length === 0 || bibInfo.length === undefined || bibInfo === undefined) {
                    responseObject.payload = "Deine Bibliothek konnte leider nicht gefunden werden! :(";
                } else {
                    responseObject.payload = "In der Bibliothek sind aktuell " + bibInfo[0].occupiedSeats + " Plätze besetzt und noch " + bibInfo[0].freeSeats + " Plätze frei.";
                }
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
