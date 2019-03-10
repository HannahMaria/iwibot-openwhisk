var request = require('request');

function main(params) {
    var url = "https://www.iwi.hs-karlsruhe.de/Intranetaccess/REST/library/borrowedbooks/deadlines";
    var language = "de-DE";
    var responseObject = {};

    return new Promise(function (resolve, reject) {
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
                    bibLogin = JSON.parse(decrypt(credentials, rsp.payload.crypto_key));
                    var booksToExtend = '';
                    if (params.entities[0]) {
                        booksToExtend = params.entities[0].value;
                    } else if (params.input) {
                        booksToExtend = params.input.text;
                    }
                    var postData = [booksToExtend];
                    var url = url;
                    var options = {
                        method: 'put',
                        body: postData,
                        json: true,
                        url: url,
                        auth: {user: bibLogin.name, password: bibLogin.password}
                    };
                    request(options, function (error, response, body) {
                        if (!error && response.statusCode === 200) {
                            var extendetBooks = body;
                            if (extendetBooks.length === 0) {
                                responseObject.payload = "Es konnten leider keine Bücher verlängert werden. Hast du vielleicht die falsche Signatur mitgegeben? Oder sind sie bereits vorgemerkt?";
                            } else {
                                if (booksToExtend.length > extendetBooks.length) {
                                    responseObject.payload = "Es konnten " + booksToExtend.length - extendetBooks.length + " Bücher nicht verlängert werden. ";
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
                            responseObject.payload = body;

                            resolve(responseObject);
                        }
                    });
                })
                .catch(err => console.log(err));
        }
    );
}

exports.main = main;

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

    console.log("Decrypted " + msg.encrypted + " to " + decrypted + " using key " + keystring);
    return decrypted;
}