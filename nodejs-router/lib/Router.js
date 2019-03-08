let dispatcher = require('./dispatcher');
let conversation = require('./conversation');
//Python-Base Classifier
//let conversation = require('./classifier-based-conversation/conversation');


async function main(params) {

	console.log("------Router started!------");
	console.log('Router Action Params: ' + JSON.stringify(params));

	let responseObject = {};
	let conversationResponse;

	try {
		//Send Message to Conversation Service (Watson Assistant)
		conversationResponse = await conversation.sendMessage(params);
		//Merge response from the conversation service and the initial parameters
		conversationResponse = Object.assign(conversationResponse, params);
		if (shouldInvokeAction(conversationResponse)) {
			responseObject = await dispatcher.invokeFunction(conversationResponse);
			responseObject.context = conversationResponse.context;
		} else {
			responseObject.payload = conversationResponse.output.text[0];
			responseObject.context = conversationResponse.context;
		}
	} catch (error) {
		return httpResponse(conversationResponse, true, error);
	}
	return httpResponse(responseObject, false, '');

}

/**
 * Checks whether a function should be invoked.
 *
 * @param {Object} conversationResponse
 * @returns {boolean}
 */
function shouldInvokeAction(conversationResponse) {
	return "actionToInvoke" in conversationResponse.output;
}

/**
 * Returns a HTTP-Response
 *
 * @param {object} responseObject	- the body object of the response
 * @param {boolean} hasError 		- whether the response is an error
 * @param {object} error  	 		- the error message
 * @returns {{headers: {"Access-Control-Allow-Origin": string, "Content-Type": string}, body: string, code: number}}
 */
function httpResponse(responseObject, hasError, error) {
	if (hasError) {
		//TODO: Implement proper error handling
		const responseError = handleError(responseObject, error);
		return {
			headers: {'Access-Control-Allow-Origin': '*', 'Content-Type': 'text/plain'},
			body: JSON.stringify(responseError),
			code: 200
		};
	} else {
		return {
			headers: {'Access-Control-Allow-Origin': '*', 'Content-Type': 'text/plain'},
			body: JSON.stringify(responseObject),
			code: 200
		};
	}
}

/**
 *  Handles Errors
 *
 * @param response
 * @param err
 * @returns {{payload: string, context: *}}
 */
function handleError(response ,err) {
	//TODO: Implement proper error handling
	return  {
		payload: JSON.stringify(err),
		context: response.context
	}
}

exports.main = main;
