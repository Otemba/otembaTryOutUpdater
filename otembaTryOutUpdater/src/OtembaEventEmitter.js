/**
 * http://usejsdoc.org/
 * uses jquery.ajax
 */
var config;
var timer; 

/**
 * parameter json should be something like ..
 {
	url : 'https://otemba.io/voucherService',
	pollTime : 1000,
	contentType : 'application/json',
	type : 'POST',
	... one or more functions that get triggered by this
 }
 * @param json
 * @returns
 */
function OtembaEventEmitter(json) {
	config = json;
}

/**
 * sends the payload
 */
OtembaEventEmitter.prototype.send = function(jsonPayload) {
	jsonPayload = JSON.clone(jsonPayload);
	loop(jsonPayload);
	if ( config.start !== undefined) {
		config.start();
	}
}

/**
 * internal help to get the update element
 * @param json
 * @returns
 */
function getUpdateElement(json) {
	return json.flow.filter(element => element.type === "update");
};

/**
 * internal if not deploy and has no update element then it is an inspect-only request
 * @param json
 * @returns
 */
function isInspectRequest(json) {
	if ( json.flow === undefined ) { return false; }
	if ( json.flow === "liftoff" ) { return false; }
	return getUpdateElement(json).length === 0;
}

/**
 * internal actual processing
 * @param jsonPayload
 * @returns
 */
function loop(jsonPayload) {
//	alert(JSON.stringify(jsonPayload))
	var request = {};
	request.contentType = config.contentType;
	request.type = config.type;
    request.data = JSON.stringify(jsonPayload);
	request.error = function(error) { config.error(error); };
	request.success = function(data, status) {
		
		if ( config.fullResponse !== undefined ) {
			config.fullResponse(data, status);
		}
		
		if ( data.errorReport.length > 0 && config.fail !== undefined ) {
			config.fail(data.errorReport);
			return;
		}
		
		// no errors: continue
		
		// in case no update then issue a single shot
		if ( isInspectRequest(request.data) ) {
			if ( config.successOnDone !== undefined ) {
				config.successOnDone();
			}
			return;
		}
		
		if ( JSON.elementExists(data, "miningStatus.contractAddress") ) {
			var result = { "transactionId": data.mining.tx, "contractAddress":data.miningStatus.contractAddress };
			if ( config.successOnMined !== undefined ) {
				config.successOnMined(result);
			}
			if ( config.successOnDone !== undefined ) {
				config.successOnDone(data);
			}
			return;
		}
		
		if ( JSON.elementExists(data, "mining.tx") ) {
			if ( config.successOnTransaction !== undefined) {
				config.successOnTransaction(data.mining.tx);
			}
			timer = setTimeout(function() { loop(data); }, config.pollTime);
			return;
		}
		
		if ( data.quote !== undefined ) {
			if ( config.successOnQuote !== undefined ) {
				config.successOnQuote(data.quote);
			}
			timer = setTimeout(function() { loop(data); }, config.pollTime);
			return;
		}

	};
	$.ajax(config.url, request);
};