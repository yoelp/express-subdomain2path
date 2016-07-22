# express-subdomain2path
Express middleware to add subdomains (or full domain) to the path so it can be handled by the express router
#
The Express Router can control routing based on paths out of the box, but not based on subdomains, this middleware will add the subdomain to the beginning of the path so you can have routes based on subdomains. 

##Install
```sh
npm install --save express-subdomain2path
```

## Usage
```js
var subdomain2path = require("express-subdomain2path");
var options = {
	ignoreDomains : ["admin.example.com","example.com"];
}
app.use(subdomain2path(options).converter);
```
Now if you visit ```about.example.com``` the app will use the ```/about``` route, but ```admin.example.com``` and ```example.com```  will still use the ```/``` route.
loading the middleware without a config object will automatically ignore the root domain, ex: ```example.com```, this will not work if your domain is behind a second-level ex: ```.co.uk``` in that case you'll have to set ```ignoreDomains```, (See the options bellow for more info on config options);

### Options
The ```subdomain2path``` function take an optional but recommended ```options``` object.

##### ignoreDomains
```ignoreDomains``` is an ```array``` of domains (```Strings```) that should be ignored when converting subdomains to paths, this will especially be useful when you want to ignore some subdomains ex: ```ex1.example.com```, if you omit this option only the top level domain will be ignored unless ```fullDomain``` is set to true.
#
Note: A domain in ```ignoredDomains``` will be ignored even if ```fullDomain``` is set to ```true```.

##### fullDomain
Defaults to ```false```, sets whether the full domain should be converted or not, leaving this as is will automatically remove the top domain from being converted, (using regex ```/[^\.]+\.[^\.]+$/```).
#
Note: setting this to ```true``` will convert the full domain together with the TLD, ex: the path will become ```/com/example/ex1```, if you only want the domain and not the TLD you can omit this setting and only set ```ignoredDomains``` to ```[".com"]```, which will have the desired effect.
##### reverse
Defaults to ```true```, sets whether the order of domain levels should be converted in path, ex: given ```room1.org1.exmple.org``` when reverse is ```true``` it will give ```/org1/room1```, setting it to ```false``` will give ```/room1/org1```.
##### subPath
You can specify subpath under which the subdomains should be attached to the path, ex: setting ```subPath``` to ```subdomain``` will endup converting ```team1.org1.example.com``` to ```/subdomain/org1/team1/```.

***

###Tests 
```sh
npm test
```