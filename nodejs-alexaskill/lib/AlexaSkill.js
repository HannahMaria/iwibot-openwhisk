const openwhisk = require('openwhisk');

// removes unnecessary html tags
function parseHTML(html){
    let speech = '';
    // get text between <li> tags
    let elems = html.match(/<li>(.*?)<\/li>/g);
    elems.forEach(function(elem){
        // remove all html tags
        speech += '<p>' + elem.replace(/<(?:.|\n)*?>/gm, '') + '</p>';
    });
    return speech;
}

// handling error messages
function errorResponse(reason){
    return {
        version: 'error',
        response: {
            shouldEndSession: true,
            outputSpeech: {
                type: 'PlainText',
                text: reason || 'An unexpected error occurred. Please try again later.'
            }
        }
    }
}

// prepare and resolve response
function sendResponse(response, resolve){
    let body = JSON.parse(response.body);
    console.log("Response from Router: " + JSON.stringify(body));

    let responseObject = {
        version: '1.0',
        response: {
            shouldEndSession: true,
            outputSpeech: {
                type: 'PlainText',
                text: body.payload 
            }
        }
    };

    // set context if conversation is not complete (slot filling)
    if(!body.context.system.branch_exited){
        responseObject.sessionAttributes = body.context.system;
        responseObject.response.shouldEndSession = false;
        resolve(responseObject);
    }

    // handle html response
    if(body.htmlText){
        responseObject.response.outputSpeech.type = 'SSML';
        responseObject.response.outputSpeech.ssml = '<speak>' + (body.payload + parseHTML(body.htmlText)).replace('&', ' und ') + '</speak>';
        resolve(responseObject);
    }

    resolve(responseObject);
}

function main(args) {
    console.log('Begin action');
    console.log(args);

    return new Promise(function(resolve, reject) {
        let session = args.session;
        let request = args.request;
        const applicationId = args.alexa_application_id;

        // For testing this action!!
        if("__ow_body" in args) {
            const body = JSON.parse(args.__ow_body)
            session = body.session;
            session.application = {'applicationId': applicationId};
            request = {intent:{slots:{EveryThingSlot:{value: body.payload}}}};
        }

        // verify that request is from alexa skill
        if(!session){
            return reject(errorResponse('request not from alexa.'));
        }else{
            if(session.application.applicationId !== applicationId){
                return reject(errorResponse('wrong alexa skill id.'));
            }
        }

        let input = request.intent ? request.intent.slots.EveryThingSlot.value : 'hallo';
        let params = {
            payload: input,
            context: {
                conversation_id: session.sessionId.replace('amzn1.echo-api.session.',''),
                system: {
                    dialog_stack:[{dialog_node: 'root'}]
                }
            },
            semester: 5,
            courseOfStudies: 'INFB',
            entities: []
        };

        // set context for not completed conversations
        if(session.attributes){
            params.context.system = session.attributes;
        }

        let ow = openwhisk();
        let blocking = true, result = true;
        let name =  "IWIBot/Router";

        return ow.actions.invoke({name, blocking, result, params})
            .then(actionResponse => sendResponse(actionResponse, resolve))
            .catch(err => {
                console.error('Caught error: ');
                console.log(err);
                reject(errorResponse(err));
            });
    });
}
exports.main = main;