tpolm_-_parsley_state
=====================

Parsley State


source code for TPOLM's Parsley State
10k intro for DemoJS 2012
http://pouet.net/prod.php?which=59402


parsley state coat of arms was converted from svg to canvas by using random internet site and some manual cleaning.

THX.flava4-s was converted into url-encoded string with Gasman's binhexjs.rb

to compile the javascript with closure compiler you should write this on the console
java -jar compiler.jar --compilation_level ADVANCED_OPTIMIZATIONS --js 02.js --externs closure_webkitaudio.js --externs closure_mozaudio.js --externs closure_ctxhash.js --js_output_file=02_closure.js

to convert it to .png self extractable you should write this on the console
ruby pnginator.rb 02_closure.js tpolm_-_parsley_state.png.html