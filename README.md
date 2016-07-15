# express-subdomain2path
Express middleware to add subdomains (or full domain) to the path so it can be handled by the express router
#
The Express Router can control routing basd on paths out of the box, but not based on subdomains, this middleware will add the subdomain to the begining of the path so you can have routes based on subdomains. 

# API
```js
var subdomain2path = require("subdomain2path");

app.use(subdomain2path(options).converter);
```

## Options
The ```subdomain2path``` function take an optional but reccomended ```options``` object.

##### ignoreDomains
```ignoreDomains``` is an ```array``` of domains (```Strings```) that should be ignored when converting subdomains to paths, this will especially be usefull when you want to ignore some subdomains ex: ```ex1.example.com```, if you omit this option only the top level domain will be ignored unless ```fullDomain``` is set to true.
#
Note: A domain in ```ignoredDomains``` will be ignored even if ```fullDomain``` is set to ```true```.

##### fullDomain
Defaults to ```false```, sets whether the full domain should be conevrted or not, leaving this as is will automaticlly remove the top domain from being converted, (using regex ```/[^\.]+\.[^\.]+$/```).
#
Note: setting this to ```true``` will conevert the full domain togther with the TLD, ex: the path will become ```/com/example/ex1```, if you do not want this behavior you can omit this setting and only set ```ignoredDomains``` to ```[".com"]```, which will have the desired effect.
##### reverse
Defaults to ```true```, sets wheter the order of domain levels should be converted in path, ex: given ```room1.org1.exmple.org``` when reverse is ```true``` it will give ```/org1/room1```, setting it to ```false``` will give ```/room1/org1```.

***

#Examples
Will follow.

***

###Tests 
```sh
npm test
```