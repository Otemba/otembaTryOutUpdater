/**
 * http://usejsdoc.org/
 */

// https://codepen.io/fnocke/pen/wXaMeL?editors=0011
if (typeof JSON.elementExists !== "function") {
	JSON.elementExists = function(obj, path) {
	    return !!path.split(".").reduce((obj, prop) => {
	        return obj && obj[prop] ? obj[prop] : undefined;
	    }, obj);
	}
}

if (typeof JSON.clone !== "function") {
    JSON.clone = function(obj) {
        return JSON.parse(JSON.stringify(obj));
    };
}