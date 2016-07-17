var _ = require("lodash");

var settings = {
	fullDomain : false,
	ignoreDomains : [],
	reverse : true
}
var escapeRegexpString = function(str){
	//escapes regex literals in a string.
	return String(str).replace(/([.*+?=^!:${}()|[\]\/\\])/g, '\\$1');
};

var setup = function(config){
	settings  = _.merge(settings,config);
	if(settings.ignoreDomains){
		//sort by length, so more detailed subdomains will have priority 
		settings.ignoreDomains.sort(function(a,b){
			return b.length - a.length;
		});
	}
	settings.ignoreDomains = settings.ignoreDomains.map(function(item){
		item = escapeRegexpString(item);
		item = new RegExp(item+"$");
		return item;
	});
	if(!settings.fullDomain){
		settings.ignoreDomains.push(/[^\.]+\.[^\.]+$/);
	}
};

var converter = function(req,res,next){
	var subs;
	//saving original path
	req.trueUrl = req.url;
	//remove the port if present.
	subs = req.headers.host.replace(/:.*$/,"");
	//removing the ignored domain;
	settings.ignoreDomains.every(function(domain){
		//using every this way it will only replace the first domain found and be false after the first replace.
		return subs === (subs = subs.replace(domain,""));
	});

	//removing the trailing `.`
	subs = subs.replace(/\.$/,"");

	//turn it to a path str.
	subs = subs.split(".");
	if(settings.reverse){
		subs = subs.reverse()
	}
	subs = subs.join("/");

	//assigning to req.url (replacing first `/` from the old url)
	req.url = "/" + subs + (subs?"/":"") + req.url.replace(/^\//,"");
	next();
}

module.exports = function(config){
	setup(config);
	return {
		converter : converter
	};
}