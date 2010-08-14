
var SVG = 'http://www.w3.org/2000/svg';
var XLINK = 'http://www.w3.org/1999/xlink';

var doc = null;
var rootElt = null;

// Find an element by ID.
function elt(idOrElt) {
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
        logElt = subelt(elt('bg'), 'text', {
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

// Called from main SVG element when document loaded.
function init(evt) {
	doc = evt.target.ownerDocument;
	rootElt = doc.documentElement;
	
	var pieces = mkPieces('im.jpg', 640, 427, 4, 4);
	initDrag('p', pieces);
};

function mkPieces(u, imWd, imHt, nh, nv) {	
    var wd = imWd / nh;
    var ht = imHt / nv;
	var pieces = [];
	var defsElt = elt('defs');
	var piecesElt = elt('p');
	var dwd = piecesElt.ownerSVGElement.width.animVal.value;
	var dht = piecesElt.ownerSVGElement.height.animVal.value;
	var fracWd = 1 / nh;
	var fracHt = 1 / nv;
	for (var i = 0; i < nh; ++i) {
	    for (var j = 0; j < nv; ++j) {
		    var id = String.fromCharCode(97 + i) + String.fromCharCode(97 + j);
		    
		    // Create path.
		    var ds = ['M0,0'];
		    ds.push('h' + wd);
		    ds.push('v' + ht);
		    ds.push('h' + -wd);
		    ds.push('z');
		    d = ds.join(' ');
		    /*
		    clipPathElt = subelt(defsElt, 'clipPath', {
		        id: 'c' + id, 
		        clipPathUnits: 'objectBoundingBox'
		    })
		    subelt(clipPathElt, 'path', {d: d})
		    */
		    
		    // Create pattern. This is my 2nd attempt to place an image in a shape.
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
		    
		    // Create image with clip path.
		    var pieceElt = subelt(piecesElt, 'g', {
		        id: 'g' + id,
		        transform: 'translate(' + x + ',' + y + ')'	        
		    }) 
		    
	        var pathElt = subelt(pieceElt, 'path', {
	            d: d,
	            stroke: '#CCC',
	            'stroke-width': 1,
	            fill: 'url(#p' + id + ')'
	        })
	        
	        /*
	        
	        pieceElt = subelt(piecesElt, 'rect', {
	            id: 'r' + id,
	            width: wd,
	            height: ht
            });\
            */
            pieceElt.ownerPiece = {elts: {id: pieceElt}};
		    pieces.push(pieceElt.ownerPiece);
	    }
	}
	return pieces;
}

function initDrag(bgElt, pieces) {
    bgElt = elt(bgElt);
    var isDrag = false;
    var dragPiece = null;
    var dragStartX = null;
    var dragStartY = null;
    var startX = null;
    var startY = null;

    // SVGPoint to keep track of the offset of the dragging session
    var dragOffset = rootElt.createSVGPoint();

    bgElt.addEventListener('mousemove', function (evt) {
        if (isDrag) {
            var shiftX = evt.clientX - dragStartX;
            var shiftY = evt.clientY - dragStartY;
            
            for (var j in dragPiece.elts) {
                var e = dragPiece.elts[j];
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
            dragPiece = null;
            isDrag = false;
            log('dun; dragPiece=' + typeof(dragPiece) + ', isDrag=' + isDrag);
        }
    }, false);

    for (var pieceIndex in pieces) {
        var piece = pieces[pieceIndex];
        for (var eltID in piece.elts) {
            var pieceElt = piece.elts[eltID];
            pieceElt.addEventListener('mousedown', function (evt) {
                dragPiece = evt.currentTarget.ownerPiece;
                isDrag = true;

                dragStartX = evt.clientX;
                dragStartY = evt.clientY;
                for (var j in dragPiece.elts) {
                    var e = dragPiece.elts[j];
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