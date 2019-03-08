const AssistantV1 = require('watson-developer-cloud/assistant/v1');

exports.sendMessage = function sendMessage(params) {
    console.log("------Conversation Started!------");

    return new Promise(function (resolve, reject) {
		const conversation = initAssistant(params);
		const options = getMessageOptions(params);
        conversation.message(options, function (err, response) {
            if (err) {
                console.error("Conversation Error: " + err);
                reject(err);
            }
            console.log("Conversation Response: " + JSON.stringify(response, null, 4));
            resolve(response);
        });
    });
};

/**
 * Initialize the Watson Assistant
 * @param params
 * @returns {AssistantV1}
 */
function initAssistant(params) {
    return new AssistantV1({
		iam_apikey: params.__bx_creds.conversation.apikey,
		url: params.__bx_creds.conversation.url,
		version: "2019-03-07"
	});
}

/**
 * Creates the option object for sending a message to the conversation service
 *
 * @param params the params with the payload and context
 * @returns {object}
 */
function getMessageOptions(params) {
    if(!isConversationInitialized(params)) {
    	return { workspace_id: params['workspace_id'] }
	} else {
		return {
			input: {
				text: params.payload.toString()
			},
			context: params.context,
			workspace_id: params['workspace_id']
		};
	}
}

/**
 *  Checks if a conversation has already been initialized.
 *
 *  If a conversation is ongoing, the client and the conversation service
 *  pass a context object, with each request and response, to keep the state
 *  of the conversation.
 *
 * @param params
 * @returns {boolean}
 */
function isConversationInitialized(params) {
	return ('context' in params);
}