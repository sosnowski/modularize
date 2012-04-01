# Modularize

Console tool for using NodeJS modules in the browser.

This tool allows you to use CommonJS/NodeJS compatible modules in you client-side application.


## Instalation

...

## Usage

````
modularize -s start_file.js
````

-s option provides path to entry point of your application

There some additional options that can be usefull
_________________________________________________

````
-o output.js - path to output file
-m - output will be minified using uglify-js
-mh - output will be minified using more aggressive form of compression
-w - active watch mode
````

Watch mode
__________

In this mode Modularize will constantly watch for changes in your code. 
If it detects that your code has changed, it rebuilds your bundle.

Modularize will even find new added files and add it to your output!


