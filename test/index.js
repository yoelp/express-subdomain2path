var request = require("request");
var spawn = require('child_process').spawn;

var cp;

exports.testDefaultOptions = function(test) {
    test.expect(4);
    cp = spawn("node",["app.js","default"]);

    cp.stdout.on('data', (data) => {
    	//test when no subdomains, no path.
	    request({
	    	method : "GET",
	    	url : "http://localhost:9876/",
	    	headers : {
	    		"host" : "example.com"
	    	}
	    },function(err,res,body){
	    	var expected = "/";
	    	body = JSON.parse(body);
	    	test.equal(body.path, expected,`Body ${body.path} should match ${expected}`);
	    });
	    //test when no subdomains, with path.
	    request({
	    	method : "GET",
	    	url : "http://localhost:9876/about",
	    	headers : {
	    		"host" : "example.com"
	    	}
	    },function(err,res,body){
	    	var expected = "/about";
	    	body = JSON.parse(body);
	    	test.equal(body.path, expected,`Body ${body.path} should match ${expected}`);
	    });
    	//test when only subdomains.
	    request({
	    	method : "GET",
	    	url : "http://localhost:9876/",
	    	headers : {
	    		"host" : "team1.org1.example.com"
	    	}
	    },function(err,res,body){
	    	var expected = "/org1/team1/";
	    	body = JSON.parse(body);
	    	test.equal(body.path, expected,`Body ${body.path} should match ${expected}`);
	    });
	    //test subdomain with path
	    request({
	    	method : "GET",
	    	url : "http://localhost:9876/chat/1",
	    	headers : {
	    		"host" : "team1.org1.example.com"
	    	}
	    },function(err,res,body){
	    	var expected = "/org1/team1/chat/1";
	    	body = JSON.parse(body);
	    	test.equal(body.path, expected,`Body ${body.path} should match ${expected}`);
	    	test.done();
	    	cp.kill();
	    });
    });
};


exports.testReverseTrue = function(test) {
    test.expect(2);
    cp = spawn("node",["app.js","reverse"]);
    //test with no params
    cp.stdout.on('data', (data) => {
	    request({
	    	method : "GET",
	    	url : "http://localhost:9876/",
	    	headers : {
	    		"host" : "org1.team1.example.com"
	    	}
	    },function(err,res,body){
	    	var expected = "/org1/team1/";
	    	body = JSON.parse(body);
	    	test.equal(body.path, expected,`Body ${body.path} should match ${expected}`);
	    });
	    //test with params
	    request({
	    	method : "GET",
	    	url : "http://localhost:9876/chat/1",
	    	headers : {
	    		"host" : "org1.team1.example.com"
	    	}
	    },function(err,res,body){
	    	var expected = "/org1/team1/chat/1";
	    	body = JSON.parse(body);
	    	test.equal(body.path, expected,`Body ${body.path} should match ${expected}`);
	    	test.done();
	    	cp.kill();
	    });
    });
};

exports.testFullDomainTrue = function(test) {
    test.expect(2);
    cp = spawn("node",["app.js","fullDomain"]);
    //test with no subdomains
    cp.stdout.on('data', (data) => {
	    request({
	    	method : "GET",
	    	url : "http://localhost:9876/chat/1",
	    	headers : {
	    		"host" : "example.com"
	    	}
	    },function(err,res,body){
	    	var expected = "/com/example/chat/1";
	    	body = JSON.parse(body);
	    	test.equal(body.path, expected,`${body.path} should match ${expected}`);
	    });
	    //test with subdomain
	    request({
	    	method : "GET",
	    	url : "http://localhost:9876/chat/1",
	    	headers : {
	    		"host" : "team1.org1.example.com"
	    	}
	    },function(err,res,body){
	    	var expected = "/com/example/org1/team1/chat/1";
	    	body = JSON.parse(body);
	    	test.equal(body.path, expected,`${body.path} should match ${expected}`);
	    	test.done();
	    	cp.kill();
	    });
    });
};

exports.testWithIgnoreDomains = function(test) {
    test.expect(5);
    cp = spawn("node",["app.js","ignoreDomains"]);
    cp.stdout.on('data', (data) => {
	    //test when no subdomains, no path, should also be ignored since fullDomain is default.
	    request({
	    	method : "GET",
	    	url : "http://localhost:9876/",
	    	headers : {
	    		"host" : "example.com"
	    	}
	    },function(err,res,body){
	    	var expected = "/";
	    	body = JSON.parse(body);
	    	test.equal(body.path, expected,`Body ${body.path} should match ${expected}`);
	    });
	    //test with subdomain still not the ignored
	    request({
	    	method : "GET",
	    	url : "http://localhost:9876/chat/1",
	    	headers : {
	    		"host" : "team1.org1.example.com"
	    	}
	    },function(err,res,body){
	    	var expected = "/org1/team1/chat/1";
	    	body = JSON.parse(body);
	    	test.equal(body.path, expected,`${body.path} should match ${expected}`);
	    });
	    //test when no subdomains, no path, with domain that should be ignored.
	    request({
	    	method : "GET",
	    	url : "http://localhost:9876/",
	    	headers : {
	    		"host" : "manage.admin.example.com"
	    	}
	    },function(err,res,body){
	    	var expected = "/";
	    	body = JSON.parse(body);
	    	test.equal(body.path, expected,`Body ${body.path} should match ${expected}`);
	    });
	    //test when subdomain besides the subdomain that should be ignored.
	    request({
	    	method : "GET",
	    	url : "http://localhost:9876/",
	    	headers : {
	    		"host" : "account.admin.example.com"
	    	}
	    },function(err,res,body){
	    	var expected = "/account/";
	    	body = JSON.parse(body);
	    	test.equal(body.path, expected,`Body ${body.path} should match ${expected}`);
	    });
	    //test with subdomain besides the subdomain that should be ignored, with a path.
	    request({
	    	method : "GET",
	    	url : "http://localhost:9876/edit",
	    	headers : {
	    		"host" : "account.admin.example.com"
	    	}
	    },function(err,res,body){
	    	var expected = "/account/edit";
	    	body = JSON.parse(body);
	    	test.equal(body.path, expected,`Body ${body.path} should match ${expected}`);
	    	test.done();
	    	cp.kill();
	    });
    });
};


