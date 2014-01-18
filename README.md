bring
=====

A more natural and intelligent way (as opposed to the default "require" function) to import packages to your code.


Instead of doing ```var authService = require("../../services/core/authService");``` you can do any of the following:


Assumming services is in your project's **root** directory
```javascript
var authService = bring("/services/core/authService");
```
or using a partial path to the module
```javascript
var authService = bring("core/authService");
```
or just the module name
```javascript
var authService = bring("authService");
```

##Installation

Just do an ```npm install bring``` then:
```javascript
var bring       = require("bring");
var authService = bring("authService");
```
or even better (in your main module) do this: ```global.bring = require("bring");``` and then in any module you can easily do this:
```javascript
var authService = bring("authService");
```

## Usage
"bring" supports many natural ways to import your packages. Just type in anything you feel natural to you and it will bring the module you had in mind!

###In Application Code

Use slash as your application's root directory not the system's root (OMG!)

```javascript
var authService = bring("/services/core/authService");
```

Use double (or more) slashes for the system's root directory (I can't imagine why you would need to do that!)

```javascript
var wieredModuleFromOtherLocation = bring("//home/jay/otherLocation/wieredModule");
```

Use only the module name if you feel like it (It doesn't matter where it is located "bring" will just bring it to you!)

```javascript
var authService = bring("authService");
```

Use a partial path to your module is also possible

```javascript
var authService = bring("core/authService");
```

Use the folder name if you will (the trailing slash is there just for you to know that it's a directory!)

```javascript
var userService = bring("services/user/");
```

You can always use relative paths like ```"./somePath"``` or ```"../../someOtherPath"```

```javascript
var authService = bring("../../services/core/authService");
```

Of course you can always "bring" default node modules or installed modules (in the "node_modules" directory)

```javascript
var fs = bring("fs");
```

###Test Code
"bring" will help you a lot in writing your tests, because test are always in a seperate folder (I hope...) and it is very hard to "require" them with all the nasty relative paths. All you have to do is just using one of the described ways above and forget about all the headaches you had before you knew "bring"! 

## License

(The MIT License)

Copyright (c) 2011-2014 Jake Luer <jake@alogicalparadox.com>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

