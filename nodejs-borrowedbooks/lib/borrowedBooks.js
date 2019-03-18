var request = require('request');

function main(params) {
    var url = "https://www.iwi.hs-karlsruhe.de/Intranetaccess/REST/library/borrowedbooks";
    var language = "de-DE";
    var responseObject = {};

    return new Promise(function (resolve, reject) {
        //fist login, decrypt library_credentials to bib login
        if (params.library_credentials !== undefined) {
            const credentials = JSON.parse(params.library_credentials);
            var bibLogin = {};
            request_promise({
                // you get this key string from the key service
                uri: "https://us-south.functions.cloud.ibm.com/api/v1/web/IWIbot_dev/IWIBot/Keys.json?sid=" + credentials.sid,
                headers: {
                    'User-Agent': 'Request-Promise'
                },
                json: true // Automatically parses the JSON string in the response
            })
                .then(rsp => {
                    //decrypt successfull, parse credentials and do request to REST-Api
                    bibLogin = JSON.parse(decrypt(credentials, rsp.payload.crypto_key));
                    request({
                        url: url,
                        headers: {
                            'Authorization': 'Basic ' + Buffer.from(bibLogin.name + ':' + bibLogin.password).toString('base64'),
                        }
                    }, function (error, response, body) {

                        if (!error && response.statusCode === 200) {
                            //request returns all borrowd Books
                            var borrowedBooks = JSON.parse(body);
                            if (borrowedBooks.length === 0 || borrowedBooks.length === undefined || borrowedBooks === undefined) {
                                //is the array empty there are no borrowed Books
                                responseObject.payload = "Du hast Aktuell keine Bücher ausgeliehen! :)";
                            } else {
                                //build the answer for the user
                                responseObject.htmlText = "<ul >";
                                responseObject.payload = "Deine Ausgeliehenen Bücher:";

                                //will be shown as a List
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
                            //catch errors
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
                })
                .catch(err => {
                    //when the library_credential is undefined, the user is not logged in
                    console.log(err);
                });
        } else {
            responseObject.payload = 'Bitte loggen Sie sich ein.';
            resolve(responseObject);
        }
    });
}

exports.main = main;
//Code fpr decryption
const algorithm = 'aes-256-cbc';
const crypto = require('crypto');
const request_promise = require('request-promise');

function decrypt(msg, keystring) {
    // get iv and ciphertext from msg
    const iv = Buffer.from(msg.iv, 'hex');
    const encrypted = Buffer.from(msg.encrypted, 'hex');
    // use keystring to create a buffer
    const key = Buffer.from(keystring, 'hex');

    msg.decrypted = {};

    // do decrypt
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
}