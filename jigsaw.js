
var SVG = 'http://www.w3.org/2000/svg';
var XLINK = 'http://www.w3.org/1999/xlink';

var doc = null;
var rootElt = null;

// Find an element by ID.
function getElt(idOrElt) {
    if (idOrElt.getAttribute) {
        return idOrElt;
    }
    return doc.getElementById(idOrElt);
}

// Create an element with the given name and attributes. 
function mk(n, atts) {
    var e = document.createElementNS(SVG, n);
    if (atts) {
        for (var i in atts) {
            if (i == 'href') {
                e.setAttributeNS(XLINK, 'href', atts[i])
            } else {
                e.setAttribute(i, atts[i]);
            }
        }
    }
    return e;
}

// Create an element and attach it to an existing one.
function subelt(p, n, atts) {
    e = mk(n, atts);
    p.appendChild(e);
    return e;
}

var logElt;
var logTspans;
var logLineHt = 16;
var logMax = 600 / 16;

function log(text) {
    if (logTspans == null) {
        logElt = subelt(getElt('bg'), 'text', {
            'font-height': logLineHt,
            x: 0,
            y: logLineHt
        });
        logTspans = [];
    }
    if (logTspans.length >= logMax) {
        var e = logTspans.shift();
        logElt.removeChild(e);
        for (var i in logTspans) {
            logTspans[i].setAttribute('y', (i - 0) * logLineHt);
        }
    }
    var newElt = subelt(logElt, 'tspan', {
        x: 0,
        y: logTspans.length * logLineHt
    });
    newElt.appendChild(doc.createTextNode(text));
    logTspans.push(newElt);
}

//
// Application specific
//

//
// hv -- either 'h' for a bottom or top side or 'v'
// vh -- either 'v' or 'h'
// len -- total length of the side (width or height of the piece). May be -ve.
// bwh -- width or height of the bump (in the direction along the side). Same sign as len.
// bhw -- height or width of the bump (in the direction perpendicular to the side). May be -ve.
function bump(hv, vh, len, bwh, bhw) {
    return [hv + 0.5 * (len - bwh), vh + bhw, hv + bwh, vh + -bhw, hv + 0.5 * (len - bwh)];
}

function mkPieceElts(u, imWd, imHt, nh, nv) {	
    var wd = imWd / nh;
    var ht = imHt / nv;
	var hunks = [];
	var defsElt = getElt('defs');
	var hunksElt = getElt('p');
	var dwd = hunksElt.ownerSVGElement.width.animVal.value;
	var dht = hunksElt.ownerSVGElement.height.animVal.value;
	
    var hash = function (i, j) {
        return ((i * 37) ^ (j * 1009)) % 17;
    }
	
	var pieceEltss = []; // 2-d array of hunks
	var pieceElts = []; // simple list of hunks
	for (var i = 0; i < nh; ++i) {
	    pieceEltss[i] = []
	    for (var j = 0; j < nv; ++j) {
		    var id = String.fromCharCode(97 + i) + String.fromCharCode(97 + j);
		    
		    // Create path.
		    var ds = ['M0,0'];
		    if (j == 0) {
		        ds.push('h' + wd);
	        } else if (hash(i, j) & 1) {
	            ds.splice(ds.length, 0, bump('h', 'v', wd, 0.2 * wd, 0.1 * ht));
	        } else {
	            ds.splice(ds.length, 0, bump('h', 'v', wd, 0.2 * wd, -0.1 * ht));
		    }
		    if (i == nh - 1) {
		        ds.push('v' + ht);
	        } else if (hash(i + 1, j) & 2) {
	            ds.splice(ds.length, 0, bump('v', 'h', ht, 0.2 * ht, 0.1 * wd));
	        } else {
	            ds.splice(ds.length, 0, bump('v', 'h', ht, 0.2 * ht, -0.1 * wd));
		    }
		    if (j == nv - 1) {
		        ds.push('h' + -wd);
	        } else if (hash(i, j + 1) & 1) {
	            ds.splice(ds.length, 0, bump('h', 'v', -wd, -0.2 * wd, 0.1 * ht));
	        } else {
	            ds.splice(ds.length, 0, bump('h', 'v', -wd, -0.2 * wd, -0.1 * ht));
		    }
		    if (i == 0) {
		        ds.push('v' + -ht);
	        } else if (hash(i, j) & 2) {
	            ds.splice(ds.length, 0, bump('v', 'h', -ht, -0.2 * ht, 0.1 * wd));
	        } else {
	            ds.splice(ds.length, 0, bump('v', 'h', -ht, -0.2 * ht, -0.1 * wd));
		    }
		    
		    ds.push('z');
		    d = ds.join(' ');
		    
		    // Create pattern. 
		    // The image is added using a pattern (a) so that it does
		    // not expand the bbox of the piece, and (b) because
		    // images are independently draggable in Safari
		    var patternElt = subelt(defsElt, 'pattern', {
		        id: 'p' + id,
		        patternUnits: 'userSpaceOnUse',
		        patternContentUnits: 'userSpaceOnUse',
		        patternTransform: 'translate(' + (-i * wd) + ',' + (-j * ht) + ')',
		        x: 0,
		        y: 0,
		        width: imWd,
		        height: imHt		        
		    });
		    var imageElt = subelt(patternElt, 'image', {
		        href: u, 
		        x: 0,
		        y: 0,
		        width: imWd,
		        height: imHt
	        });
	        
	        // Random starting position.
		    var x = Math.random() * (dwd - wd);
		    var y = Math.random() * (dht - ht);
		    
		    /*
		    // Non-random starting points to see that the hunks fit.
		    x = i * wd * 1.15;
		    y = j * ht * 1.15;
		    */
		    
		    // Create image with clip path.
		    var pieceElt = subelt(hunksElt, 'g', {
		        id: 'g' + id,
		        transform: 'translate(' + x + ',' + y + ')'	        
		    }) 
		    
	        var pathElt = subelt(pieceElt, 'path', {
	            d: d,
	            stroke: '#CCC',
	            'stroke-width': 1,
	            fill: 'url(#p' + id + ')'
	        })
	        
		    pieceEltss[i][j] = pieceElt;
		    pieceElts.push(pieceElt)
	    }
	}
	
	for (i = 0; i < nh; ++i) {
	    for (j = 0; j < nv; ++j) {
	        pieceEltss[i][j].adjs = []
	        if (i > 0) {
	            pieceEltss[i][j].adjs.push({elt: pieceEltss[i - 1][j], dx: -wd});
            }
            if (i + 1 < nh) {
	            pieceEltss[i][j].adjs.push({elt: pieceEltss[i + 1][j], dx: +wd});
            }
            if (j > 0) {
	            pieceEltss[i][j].adjs.push({elt: pieceEltss[i][j - 1], dy: -ht});
            }
            if (j + 1 < nv) {
	            pieceEltss[i][j].adjs.push({elt: pieceEltss[i][j + 1], dy: +ht});
            }
	    }
	}
	
	return pieceElts;
}

function initDrag(bgElt, pieceElts) {
    bgElt = getElt(bgElt);
    var isDrag = false;
    var dragHunk = null;
    var dragStartX = null;
    var dragStartY = null;
    var startX = null;
    var startY = null;
    
    
    var hunks = [];
    for (var i in pieceElts) {
        hunks.push(pieceElts[i].hunk = {elts: [pieceElts[i]]});
    }

    // SVGPoint to keep track of the offset of the dragging session
    var dragOffset = rootElt.createSVGPoint();

    bgElt.addEventListener('mousemove', function (evt) {
        if (isDrag) {
            var shiftX = evt.clientX - dragStartX;
            var shiftY = evt.clientY - dragStartY;
            
            for (var j in dragHunk.elts) {
                var e = dragHunk.elts[j];
                var t = 'translate(' + (e.startX + shiftX) + ',' + (e.startY + shiftY) + ')';
                e.setAttribute('transform', t);
            
                log(e.getAttribute('id') + ': shift=' + shiftX + ',' + shiftY 
                    + '; pos=' + t);
            }
        }
    }, false);
    bgElt.addEventListener('mouseup', function (evt) {
        if (isDrag) {
            // resets the pointer-events
            /*
            dragElt.style.setProperty('pointer-events', 'all');
            bgElt.style.setProperty('pointer-events', 'none');
            */
            
            // Is it close enough to a piece to snap together?
            var snaps = [];
            var checkedElts = {};
            for (var i in dragHunk.elts) {
                var e = dragHunk.elts[i];
                var m = e.getCTM();
                var dragX = m.e;
                var dragY = m.f;
                for (var j in e.adjs) {
                    var adj = e.adjs[j];
                    if (adj.elt.hunk == dragHunk || checkedElts[adj.elt]) {
                        continue;
                    }
                    var m = adj.elt.getCTM();
                    var otherX = m.e - (adj.dx || 0);
                    var otherY = m.f - (adj.dy || 0);
                    var dSquared = Math.pow(dragX - otherX, 2) + Math.pow(dragY - otherY, 2);
                    log('dragX,Y=' + dragX + ',' + dragY + '; otherX,Y=' + otherX + ',' + otherY
                        + '; dSquared=' + dSquared);
                    if (dSquared < 25) {
                        log('snap');
                        snaps.push({elts: adj.elt.hunk.elts, dx: otherX - dragX, dy: otherY - dragY});
                        checkedElts[adj.elt] = true;
                    }
                }
            }
            for (var i in snaps) {
                var snap = snaps[i];
                for (var k in dragHunk.elts) {
                    var e = dragHunk.elts[k]
                    var m = e.getCTM();
                    var t = 'translate(' + (m.e + snap.dx) + ',' + (m.f + snap.dy) + ')';
                    e.setAttribute('transform', t);
                }
                for (var k in snap.elts) {
                    snap.elts[k].hunk = dragHunk;
                }
                dragHunk.elts = dragHunk.elts.concat(snap.elts);
            }
            log('Hunk size: ' + dragHunk.elts.length);
            
            dragHunk = null;
            isDrag = false;
        }
    }, false);

    for (var k in hunks) {
        var hunk = hunks[k];
        for (var eltID in hunk.elts) {
            var pieceElt = hunk.elts[eltID];
            pieceElt.addEventListener('mousedown', function (evt) {
                dragHunk = evt.currentTarget.hunk;
                isDrag = true;

                dragStartX = evt.clientX;
                dragStartY = evt.clientY;
                for (var j in dragHunk.elts) {
                    var e = dragHunk.elts[j];
                    var m = e.getCTM();
                    e.startX = m.e;
                    e.startY = m.f;
                }
            
                /*
                // sets the new pointer-events
                dragElt.style.setProperty('pointer-events', 'none');
                bgElt.style.setProperty('pointer-events', 'all');
                */
            }, false);
        }
    }
}

// Called from main SVG element when document loaded.
function init(evt) {
	doc = evt.target.ownerDocument;
	rootElt = doc.documentElement;
	
	var pieceElts = mkPieceElts('im.jpg', 640, 427, 6, 4);
	initDrag('p', pieceElts);
};