var request = require('request');

function main(params) {
    var url = "https://www.iwi.hs-karlsruhe.de/Intranetaccess/REST/library/borrowedbooks/deadlines";
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
        //before request, check the Userinput. all books or special one?
        var userInput = '';
        var booksToExtend = [];
        if (params.entities) {
            //all is defines as entity in conversation service. so if the user defines all in the sentence, the entities will be defined
            userInput = params.entities[0].value;
            //when the entities undefined -> there have to be some variable user input. Hope the user did it right
        } else if (params.input) {
            //told the user to split the seignatuers with an comma
            if (params.input.text.includes(',')) {
                booksToExtend = params.input.text.split(',');
            } else {
                //is there no comma, then theres only one Signature
                userInput = params.input.text;
            }
        }

        var postData = [userInput];
        //when there was an comma the array will be > 1 and booksToExtend = postData
        if (booksToExtend.length > 1) {
            postData = booksToExtend;
        }
        //build the request
        var options = {
            method: 'put',
            body: postData,
            json: true,
            url: url,
            auth: {user: bibLogin.name, password: bibLogin.password}
        };
        //do the request
        request(options, function (error, response, body) {
            if (!error && response.statusCode === 200) {
                //request returns all borrowdBooks
                var allBooks = body;
                var extendetBooks = [];
                if (allBooks.length === 0) {
                    responseObject.payload = "Das hat leider nicht geklappt. Hast du Bücher ausgeliehen?";
                } else {
                    //filter the extended Books
                    if (postData[0] === 'all') {
                        extendetBooks = allBooks;
                    } else {
                        allBooks.forEach(x => {
                            postData.forEach(y => {
                                if (x.signature === y) {
                                    extendetBooks.push(x);
                                }
                            })
                        })
                    }
                    responseObject.payload = "Hier deine ausgewählten Bücher (Wenn die Verlängerung nicht geklappt hat ist dein Buch vielleicht schon vorgemerkt):";

                    responseObject.htmlText = "<ul >";
                    extendetBooks.forEach(function (book) {
                        responseObject.htmlText = responseObject.htmlText + "<li><h3>" + book.bookTitle + "</h3>" +
                            "Rückgabedatum: " + book.returnDate + "<br>" +
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
    .catch(err => {
            console.log(err);
        });
    } else {
        responseObject.payload = 'Bitte loggen Sie sich ein.';
        resolve(responseObject);
    }
    });
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
    return decrypted;
}