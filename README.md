# js-file[![Build Status](https://secure.travis-ci.org/simonfan/js-file.png?branch=master)](http://travis-ci.org/simonfan/js-file)

Introspect .js files.


``` javascript

var aaa = 'lalala';


// <<block>>

{
	"name": "Andre",
	"lalala": "bla bla bla",
	"data": "data about Andre"
}

// <<block>>

/*
<<block>>
{
	"name": "Andre",
	"lalala": "bla bla bla",
	"data": "data about Andre"
}
<<block>>
*/

// <<line:



//<<name:

/**
 *
 *
 */

//

// for blocks, any content in the directive lines is ignored.
JSON.parse(file('pragmas').block('json-block'))

// delimiter:>> Some data <<:delimiter


JSON.parse(file('lalala.js').block('some-delimiter'));


file('lalalal.js').line(4);
file('lalalal.js').line('lalalala');

```
