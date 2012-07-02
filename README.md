tpolm_-_parsley_state
=====================

Parsley State


source code for TPOLM's Parsley State  
10k intro for DemoJS 2012  
http://pouet.net/prod.php?which=59402  


parsley state coat of arms made by kaneel was converted from svg to canvas by using random internet site and some manual cleaning.

to convert AHX file like THX.flava4-s by kaneel into url-encoded string you use Gasman's binhexjs.rb and then include it in the source code

`binhexja.rb THX.flava4-s >> AHXdump.js`

to compile the javascript with closure compiler you should write this on the console

`java -jar compiler.jar --compilation_level ADVANCED_OPTIMIZATIONS --js 02.js --externs closure_webkitaudio.js --externs closure_mozaudio.js --externs closure_ctxhash.js --js_output_file=02_closure.js`

to convert it to .png self extractable you should write this on the console

`ruby pnginator.rb 02_closure.js tpolm_-_parsley_state.png.html`
