if (arguments.length < 1 || !arguments[0]) {
    print('usage:\n    jsc cssm_jsc.js -- CSSTEXT...');
    quit();
}

load('/Users/pdc/Projects/svg-jigsaw/tools/cssmin.js');

var frags = [];
for (var i = 0; i < arguments.length; ++i) {
    frags.push(YAHOO.compressor.cssmin(arguments[i]));
}
print(frags.join('\n'));