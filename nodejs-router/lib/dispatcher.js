let openwhisk = require('openwhisk');
/**
 * Invoke IBM Cloud Function
 * @param {object} params - the parameters that should get passed to the function
 * @returns {Promise<openwhisk.Dict>}
 */
function invokeFunction(params) {
    let ow = openwhisk();

	return ow.actions.invoke(
	    {
            name: params.output.actionToInvoke,
            blocking: true,
            result: true,
            params: params
	    });
}

exports.invokeFunction = invokeFunction;
