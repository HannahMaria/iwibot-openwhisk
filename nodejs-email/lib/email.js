const request = require('request-promise');

async function main(params) {
	
	console.log("---------Email Action started!--------");
	console.log("Params: " + JSON.stringify(params));
	var credentials = {};
	if (params.library_credentials == undefined){
		credentials = params.context.iwibotCreds
	} else {
		credentials = params.context.iwibotCreds
		// credentials = getCredentials(params);
	}
	try {
		//Fetch Mailbox IDs
		let mailboxIds = await getMailBoxIDs(credentials);
		//Select Mailbox ID that matches given entity
		const mailboxId = getSpecificMailboxID(mailboxIds, params.entities[0].value);
		//Get Emails from Mailbox
		let emails = await getEmails(mailboxId, credentials);
		//Only return not read emails
		emails = getFilteredEmails(emails);
		//renders output and returns responseObject
		// return renderOutput(emails);
		return renderOutput(emails);
	}catch (error) {
		return handleHttpError(error);
	}
}

/**
 * Returns the mailbox ids
 * @param params object
 * @returns {Promise<*>}
 */
function getMailBoxIDs(credentials) {
	const url = "https://www.iwi.hs-karlsruhe.de/Intranetaccess/REST/exchange/mailfolders";
	console.log("getMailBoxID Method started");
	return request({
		url: url,
		headers: {
			'Authorization': 'Basic ' + credentials
			//params.library_credentials
		}
	});
}

/**
 * Returns Emails from a specific mailbox
 * @param mailBoxId string
 * @param params object
 * @returns {Promise<*>}
 */
async function getEmails(mailBoxId, credentials) {
	const url = "https://www.iwi.hs-karlsruhe.de/Intranetaccess/REST/exchange/emailoverview/" + mailBoxId
		+ "?maxbodylength=100";
	return request({
		url: url,
		headers: {
			'Authorization': 'Basic ' + credentials
			//params.library_credentials
		}
	});
}

function getEmail(mailBoxId, params, mailID){
	const url = "https://www.iwi.hs-karlsruhe.de/Intranetaccess/REST/exchange/email/" + mailBoxId 
		+ "/" + mailID
	return request({
		url: url,
		headers: {
			'Authorization': 'Basic ' + params.context.iwibotCreds
				//params.library_credentials
		}
	});	
}

/**
 * Returns mailbox id that matches the given entity
 * @param mailboxIDs string
 * @param specificMailboxName string
 * @returns {string} the mailbox id
 */
function getSpecificMailboxID(mailboxIDs, specificMailboxName) {
	let elementID = "";
	mailboxIDs = JSON.parse(mailboxIDs);
	mailboxIDs.forEach(function (element) {
		if (element.name.toLowerCase() === specificMailboxName.toLowerCase()) {
			elementID = element.id;
		}
	});
	return elementID;
}

/**
 * Returns only the emails that have not been read
 * @param emails string
 * @returns {Array}
 */
function getFilteredEmails(emails) {
	let filteredEmails = [];
	emails = JSON.parse(emails);
	emails.forEach(function(email) {
		if(!email.read) {
			filteredEmails.push(email);
		}
	});
	return filteredEmails;
}

/**
 * Renders html for the emails
 * @param emails
 * @returns {object} the responseObject
 */
function renderOutput(emails) {
	let htmlText = '<ul>';
	emails.forEach(function (email) {
			const sender = email.sender.address;
			const sendDate = email.dateSent;
			const subject = email.subject;
			const body = email.bodyPlainText;
			//Email#
			htmlText += '<li>' + "*** Subject: " + subject;
			htmlText += '<ul>';
			htmlText += '<li>' + '>>>>>>' + " Sender: " + sender + '</li>';
			htmlText += '<li>' + '>>>>>>' + " Sent Date: " + sendDate + '</li>';
			htmlText += '<li>' + ">>>>>> Body: " + '<br>' +body + '...'+'<br>'+'</li>';
			htmlText += '</ul>';
			htmlText += '<ul/>';
			htmlText += '</li>';
	});
	htmlText += '</ul>';
	let responseObject = {};
	responseObject.payload = "Hier sind deine ungelesenen Nachrichten:";
	responseObject.htmlText = htmlText;
	return responseObject;
}

/**
 * Handles errors from request
 * @param error
 * @returns {object} responseObject
 */
function handleHttpError(error) {
	let responseObject = {};
	let payload = "Es ist ein unerwarteter Fehler aufgetreten.";
	switch (error.statusCode) {
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
	responseObject.payload = payload;
	return responseObject;
}

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

function getCredentials(params){
	const credentials = JSON.parse(params.library_credentials);
    var bibLogin = {};
    request({
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
    });
    return  Buffer.from(bibLogin.name + ':' + bibLogin.password).toString('base64');
}

exports.main = main;
