const request = require('request');
const assert = require('chai').assert;
let actionUrl = process.env.ACTION_PREFIX_URL + '/alexaskill';

let params = {
    session:{
    	sessionId: 'amzn1.echo-api.session.edde5df3-a4d2-4875-ada7-ca95dec02daf'
    }
}
        
describe('AlexaSkill Test Cases', () => {
    it('Skill Action Test (timetable)', (done) => {
        params.payload = 'stundenplan freitag';
        request.post({
            headers: {'content-type': 'text/plain'},
            url: actionUrl,
            body: JSON.stringify(params)
        }, function (err, response, body) {
            body = JSON.parse(body);
            assert.isOk(body.response);
            assert(body.version.indexOf('error') === -1);
            done();
        });
    })
    it('Skill Action Test (consultation hours)', (done) => {
        params.payload = 'sprechstunden professor zirpins';
        request.post({
            headers: {'content-type': 'text/plain'},
            url: actionUrl,
            body: JSON.stringify(params)
        }, function (err, response, body) {
            body = JSON.parse(body);
            assert.isOk(body.response);
            assert(body.version.indexOf('error') === -1);
            done();
        });
    })
    it('Skill Action Test (joke)', (done) => {
        params.payload = 'witz';
        request.post({
            headers: {'content-type': 'text/plain'},
            url: actionUrl,
            body: JSON.stringify(params)
        }, function (err, response, body) {
            body = JSON.parse(body);
            assert.isOk(body.response);
            done();
        });
    })
})
