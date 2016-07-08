/**
* expressSubdomain2path: is an express middleware that adds subdomains (optionlly the full domain) to the path (replacing . with /), 
* so the regular express Router can be used to controll flow.
* How to use:
* call expressSubdomain2path(config) with an optional config object with the following options
* - fullDomain : (default : false), whether the full domain should be used or only subdomains,
* - ignoreDomains : (default : []), an array of domains that are ignored and not turned into paths, (this will leave only subdomains to be converted).
* - reverse : (default : true), whether the path should be reversed in the path or in the same order
*/
var _ = require("lodash");

var settings = {
	fullDomain : false,
	ignoreDomains : ["localhost","localhost.localhost.local"]
	reverse : true
}
var escapeRegexpString = function(str){
	//escapes regex literals in a string.
	return String(str).replace(/([.*+?=^!:${}()|[\]\/\\])/g, '\\$1');
};

var setup = function(config){
	if(!config) return;
	settings  = _.merge(settings,config);
	settings.ignoreDomains = settings.ignoreDomains.map(function(item){
		item = escapeStringRegexp(item);
		item = new RegExp(item+"$");
		return item;
	});
};

var converter = function(req,res,next){
	var subs;
	//if ignore domains is empty, and we only do it for subs continue regular flow;
	if(!settings.ignoreDomains.length && !settings.fullDomain) {
		next();
		return;
	}
	//remove the port if present.
	subs = req.headers.host.replace(/:.*$/,"");
	if(!settings.fullDomain){
		//removing the ignored domain;
		settings.ignoreDomains.every(function(domain){
			//using every this way it will only replace the first domain found and be false after the first replace.
			return subs === (subs = subs.replace(domain,""));
		});
	}

	//removing the trailing `.`
	subs = subs.replace(/\.$/,"");

	//turn it to a path str.
	subs = subs.split(".");
	if(settings.reverse){
		subs = subs.reverse()
	}
	subs = subs.join("/");

	//assigning to req.url (replacing first `/` from the old url)
	req.url = "/" + subs + req.url.replace(/^\//,"");
	next();
}

module.exports = function(config){
	setup(config);
	return {
		converter : converter
	};
}
