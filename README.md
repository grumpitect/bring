bring
=====

A more natural and intelligent way (as opposed to the default 'require' function) to import packages to your code.


Instead of doing ```var authService = require('../../services/core/authService');``` you can do any of the following:


Assumming services is in your project's **root** directory
```
var authService = bring('/services/core/authService');
```
or using a partial path to the module
```
var authService = bring('core/authService');
```
or just the module name
```
var authService = bring('authService');
```

##Installation

###Node
Just do an ```npm install bring``` then:
```
var bring       = require('bring');
var authService = bring('authService');
```
or even better (in your main module) do this: ```global.bring = require('bring');``` and then in any module you can easily do this:
```
var authService = bring('authService');
```

## Usage
"bring" supports many natural ways to import your packages. Just type in anything you feel natural to you and it will bring the module you had in mind!

###In Application Code

Use slash as your application's root directory not the system's root (OMG!)

```
var authService = bring('/services/core/authService');
```

Use double (or more) slashes for the system's root directory (I can't imagine why you would need to do that!)

```
var wieredModuleFromOtherLocation = bring('//home/jay/wieredModule');
```

Use only the module name you feel like it

```
var authService = bring('authService');
```

Use a partial path to your module is also possible

```
var authService = bring('core/authService');
```

Use the folder name if you will (the trailing slash is there just for you to know that it's a directory!)

```
var userService = bring('services/user/');
```

You can always use relative paths like ```'./somePath'``` or ```'../../someOtherPath'```

```
var authService = bring('../../services/core/authService');
```

Of course you can always "bring" default node modules or installed modules (in the "node_modules" directory)

```
var fs = bring('fs');
```

###Test Code
"bring" will help you a lot in writing your tests, because test are always in a seperate folder (I hope...) and it is very hard to "require" them with all the nasty relative paths. All you have to do is just using one of the described ways above and forget about all the headaches you had before you knew "bring"! 
