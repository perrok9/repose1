/**
 * Generated by Verge3D Puzzles v.3.3.0
 * Fri Sep 04 2020 15:06:19 GMT+0100 (British Summer Time)
 * Prefer not editing this file as your changes may get overridden once Puzzles are saved.
 * Check out https://www.soft8soft.com/docs/manual/en/introduction/Using-JavaScript.html
 * for the information on how to add your own JavaScript to Verge3D apps.
 */

'use strict';

(function() {

// global variables/constants used by puzzles' functions
var _pGlob = {};

_pGlob.objCache = {};
_pGlob.fadeAnnotations = true;
_pGlob.objClickCallbacks = [];
_pGlob.pickedObject = '';
_pGlob.objHoverCallbacks = [];
_pGlob.hoveredObject = '';
_pGlob.objMovementInfos = {};
_pGlob.objDragOverCallbacks = [];
_pGlob.objDragOverInfoByBlock = {}
_pGlob.dragMoveOrigins = {};
_pGlob.dragScaleOrigins = {};
_pGlob.mediaElements = {};
_pGlob.loadedFiles = {};
_pGlob.loadedFile = '';
_pGlob.promiseValue = '';
_pGlob.animMixerCallbacks = [];
_pGlob.arHitPoint = new v3d.Vector3(0, 0, 0);
_pGlob.states = [];
_pGlob.percentage = 0;
_pGlob.animateParamUpdate = null;
_pGlob.openedFile = '';
_pGlob.xrSessionAcquired = false;
_pGlob.xrSessionCallbacks = [];
_pGlob.screenCoords = new v3d.Vector2();
_pGlob.gamepadIndex = 0;

_pGlob.AXIS_X = new v3d.Vector3(1, 0, 0);
_pGlob.AXIS_Y = new v3d.Vector3(0, 1, 0);
_pGlob.AXIS_Z = new v3d.Vector3(0, 0, 1);
_pGlob.MIN_DRAG_SCALE = 10e-4;
_pGlob.SET_OBJ_ROT_EPS = 1e-8;

_pGlob.vec2Tmp = new v3d.Vector2();
_pGlob.vec2Tmp2 = new v3d.Vector2();
_pGlob.vec3Tmp = new v3d.Vector3();
_pGlob.vec3Tmp2 = new v3d.Vector3();
_pGlob.vec3Tmp3 = new v3d.Vector3();
_pGlob.vec3Tmp4 = new v3d.Vector3();
_pGlob.eulerTmp = new v3d.Euler();
_pGlob.eulerTmp2 = new v3d.Euler();
_pGlob.quatTmp = new v3d.Quaternion();
_pGlob.quatTmp2 = new v3d.Quaternion();
_pGlob.colorTmp = new v3d.Color();
_pGlob.mat4Tmp = new v3d.Matrix4();
_pGlob.planeTmp = new v3d.Plane();
_pGlob.raycasterTmp = new v3d.Raycaster();
_pGlob.intervals = {};

_pGlob.wooProductInfo = {};

var _pPhysics = {};

_pPhysics.tickCallbacks = [];
_pPhysics.syncList = [];

// internal info
_pPhysics.collisionData = [];

// goes to collision callback
_pPhysics.collisionInfo = {
    objectA: '',
    objectB: '',
    distance: 0,
    positionOnA: [0, 0, 0],
    positionOnB: [0, 0, 0],
    normalOnB: [0, 0, 0]
};

var PL = v3d.PL = v3d.PL || {};

// a more readable alias for PL (stands for "Puzzle Logic")
v3d.puzzles = PL;

PL.procedures = PL.procedures || {};

PL.execInitPuzzles = function(options) {
    // always null, should not be available in "init" puzzles
    var appInstance = null;

    var _initGlob = {};
    _initGlob.percentage = 0;
    _initGlob.output = {
        initOptions: {
            fadeAnnotations: true,
            useBkgTransp: false,
            preserveDrawBuf: false,
            useCompAssets: false,
            useFullscreen: true,
            useCustomPreloader: false,
            preloaderStartCb: function() {},
            preloaderProgressCb: function() {},
            preloaderEndCb: function() {},
        }
    }

    // provide the container's id to puzzles that need access to the container
    _initGlob.container = options !== undefined && 'container' in options
            ? options.container : "";

    

    // initSettings puzzle
_initGlob.output.initOptions.fadeAnnotations = false;
_initGlob.output.initOptions.useBkgTransp = false;
_initGlob.output.initOptions.preserveDrawBuf = true;
_initGlob.output.initOptions.useCompAssets = true;
_initGlob.output.initOptions.useFullscreen = true;

    return _initGlob.output;
}

PL.init = function(appInstance, initOptions) {
initOptions = initOptions || {};

if ('fadeAnnotations' in initOptions) {
    _pGlob.fadeAnnotations = initOptions.fadeAnnotations;
}




// utility functions envoked by the HTML puzzles
function getElements(ids, isParent) {
    var elems = [];
    if (Array.isArray(ids) && ids[0] != 'CONTAINER' && ids[0] != 'WINDOW' &&
        ids[0] != 'DOCUMENT' && ids[0] != 'BODY' && ids[0] != 'QUERYSELECTOR') {
        for (var i = 0; i < ids.length; i++)
            elems.push(getElement(ids[i], isParent));
    } else {
        elems.push(getElement(ids, isParent));
    }
    return elems;
}

function getElement(id, isParent) {
    var elem;
    if (Array.isArray(id) && id[0] == 'CONTAINER') {
        if (appInstance !== null) {
            elem = appInstance.container;
        } else if (typeof _initGlob !== 'undefined') {
            // if we are on the initialization stage, we still can have access
            // to the container element
            var id = _initGlob.container;
            if (isParent) {
                elem = parent.document.getElementById(id);
            } else {
                elem = document.getElementById(id);
            }
        }
    } else if (Array.isArray(id) && id[0] == 'WINDOW') {
        if (isParent)
            elem = parent;
        else
            elem = window;
    } else if (Array.isArray(id) && id[0] == 'DOCUMENT') {
        if (isParent)
            elem = parent.document;
        else
            elem = document;
    } else if (Array.isArray(id) && id[0] == 'BODY') {
        if (isParent)
            elem = parent.document.body;
        else
            elem = document.body;
    } else if (Array.isArray(id) && id[0] == 'QUERYSELECTOR') {
        if (isParent)
            elem = parent.document.querySelector(id);
        else
            elem = document.querySelector(id);
    } else {
        if (isParent)
            elem = parent.document.getElementById(id);
        else
            elem = document.getElementById(id);
    }
    return elem;
}



// setHTMLElemStyle puzzle
function setHTMLElemStyle(prop, value, ids, isParent) {
    var elems = getElements(ids, isParent);
    for (var i = 0; i < elems.length; i++) {
        var elem = elems[i];
        if (!elem || !elem.style)
            continue;
        elem.style[prop] = value;
    }
}




// utility function envoked by almost all V3D-specific puzzles
// filter off some non-mesh types
function notIgnoredObj(obj) {
    return (obj.type !== "AmbientLight" && obj.name !== ""
            && !(obj.isMesh && obj.isMaterialGeneratedMesh));
}


// utility function envoked by almost all V3D-specific puzzles
// find first occurence of the object by its name
function getObjectByName(objName) {
    var objFound;
    var runTime = _pGlob !== undefined;
    objFound = runTime ? _pGlob.objCache[objName] : null;

    if (objFound && objFound.name === objName)
        return objFound;

    appInstance.scene.traverse(function(obj) {
        if (!objFound && notIgnoredObj(obj) && (obj.name == objName)) {
            objFound = obj;
            if (runTime) {
                _pGlob.objCache[objName] = objFound;
            }
        }
    });
    return objFound;
}


// utility function envoked by almost all V3D-specific puzzles
// retrieve all objects on the scene
function getAllObjectNames() {
    var objNameList = [];
    appInstance.scene.traverse(function(obj) {
        if (notIgnoredObj(obj))
            objNameList.push(obj.name)
    });
    return objNameList;
}


// utility function envoked by almost all V3D-specific puzzles
// retrieve all objects which belong to the group
function getObjectNamesByGroupName(targetGroupName) {
    var objNameList = [];
    appInstance.scene.traverse(function(obj){
        if (notIgnoredObj(obj)) {
            var groupNames = obj.groupNames;
            if (!groupNames)
                return;
            for (var i = 0; i < groupNames.length; i++) {
                var groupName = groupNames[i];
                if (groupName == targetGroupName) {
                    objNameList.push(obj.name);
                }
            }
        }
    });
    return objNameList;
}


// utility function envoked by almost all V3D-specific puzzles
// process object input, which can be either single obj or array of objects, or a group
function retrieveObjectNames(objNames) {
    var acc = [];
    retrieveObjectNamesAcc(objNames, acc);
    return acc;
}

function retrieveObjectNamesAcc(currObjNames, acc) {
    if (typeof currObjNames == "string") {
        acc.push(currObjNames);
    } else if (Array.isArray(currObjNames) && currObjNames[0] == "GROUP") {
        var newObj = getObjectNamesByGroupName(currObjNames[1]);
        for (var i = 0; i < newObj.length; i++)
            acc.push(newObj[i]);
    } else if (Array.isArray(currObjNames) && currObjNames[0] == "ALL_OBJECTS") {
        var newObj = getAllObjectNames();
        for (var i = 0; i < newObj.length; i++)
            acc.push(newObj[i]);
    } else if (Array.isArray(currObjNames)) {
        for (var i = 0; i < currObjNames.length; i++)
            retrieveObjectNamesAcc(currObjNames[i], acc);
    }
}




// outline puzzle
function outline(objNames, doWhat) {
    objNames = retrieveObjectNames(objNames);
    if (!objNames)
        return;
    if (!appInstance.postprocessing || !appInstance.postprocessing.outlinePass)
        return;
    var outlineArray = appInstance.postprocessing.outlinePass.selectedObjects;
    for (var i = 0; i < objNames.length; i++) {
        var objName = objNames[i];
        var obj = getObjectByName(objName);
        if (!obj)
            continue;
        if (doWhat == "ENABLE") {
            if (outlineArray.indexOf(obj) == -1)
                outlineArray.push(obj);
        } else {
            var index = outlineArray.indexOf(obj);
            if (index > -1)
                outlineArray.splice(index, 1);
        }
    }
}



// utility function used by the whenClicked, whenHovered and whenDraggedOver puzzles
function initObjectPicking(callback, eventType, mouseDownUseTouchStart) {

    var elem = appInstance.renderer.domElement;
    elem.addEventListener(eventType, pickListener);
    if (eventType == "mousedown") {
        var touchEventName = mouseDownUseTouchStart ? "touchstart" : "touchend";
        elem.addEventListener(touchEventName, pickListener);
    }

    var raycaster = new v3d.Raycaster();
    function pickListener(event) {
        event.preventDefault();

        var xNorm = 0, yNorm = 0;
        if (event instanceof MouseEvent) {
            xNorm = event.offsetX / elem.clientWidth;
            yNorm = event.offsetY / elem.clientHeight;
        } else if (event instanceof TouchEvent) {
            var rect = elem.getBoundingClientRect();
            xNorm = (event.changedTouches[0].clientX - rect.left) / rect.width;
            yNorm = (event.changedTouches[0].clientY - rect.top) / rect.height;
        }

        _pGlob.screenCoords.x = xNorm * 2 - 1;
        _pGlob.screenCoords.y = -yNorm * 2 + 1;
        raycaster.setFromCamera(_pGlob.screenCoords, appInstance.camera);
        var objList = [];
        appInstance.scene.traverse(function(obj){objList.push(obj);});
        var intersects = raycaster.intersectObjects(objList);
        if (intersects.length > 0) {
            var obj = intersects[0].object;
            callback(obj, event);
        } else {
            callback(null, event);
        }
    }
}

// utility function used by the whenDraggedOver puzzles
function fireObjectPickingCallbacks(objName, source, index, cbParam) {
    for (var i = 0; i < source.length; i++) {
        var cb = source[i];
        if (objectsIncludeObj([cb[0]], objName)) {
            cb[index](cbParam);
        }
    }
}

function objectsIncludeObj(objNames, testedObjName) {
    if (!testedObjName) return false;

    for (var i = 0; i < objNames.length; i++) {
        if (testedObjName == objNames[i]) {
            return true;
        } else {
            // also check children which are auto-generated for multi-material objects
            var obj = getObjectByName(objNames[i]);
            if (obj && obj.type == "Group") {
                for (var j = 0; j < obj.children.length; j++) {
                    if (testedObjName == obj.children[j].name) {
                        return true;
                    }
                }
            }
        }
    }
    return false;
}

// utility function used by the whenClicked, whenHovered and whenDraggedOver puzzles
function getPickedObjectName(obj) {
    // auto-generated from a multi-material object, use parent name instead
    if (obj.isMesh && obj.isMaterialGeneratedMesh && obj.parent) {
        return obj.parent.name;
    } else {
        return obj.name;
    }
}



// whenHovered puzzle
initObjectPicking(function(obj) {

    var prevHovered = _pGlob.hoveredObject;
    var currHovered = obj ? getPickedObjectName(obj) : "";

    if (prevHovered == currHovered) return;

    // first - all "out" callbacks, then - all "over"
    _pGlob.objHoverCallbacks.forEach(function(el) {
        if (objectsIncludeObj(el.objNames, prevHovered)) {
            // ensure the correct value of the hoveredObject block
            _pGlob.hoveredObject = prevHovered;
            el.callbacks[1]();
        }
    });

    _pGlob.objHoverCallbacks.forEach(function(el) {
        if (objectsIncludeObj(el.objNames, currHovered)) {
            // ensure the correct value of the hoveredObject block
            _pGlob.hoveredObject = currHovered;
            el.callbacks[0]();
        }
    });

    _pGlob.hoveredObject = currHovered;
}, 'mousemove');



// whenHovered puzzle
function registerOnHover(objNames, callback_over, callback_out) {
    objNames = retrieveObjectNames(objNames) || [];
    var objNamesFiltered = objNames.filter(function(name) {
        return name;
    });

    _pGlob.objHoverCallbacks.push({
        objNames: objNamesFiltered,
        callbacks: [callback_over, callback_out]
    });
}



// openWebPage puzzle
function openWebPage(url, mode) {

    if (appInstance.controls) {
        appInstance.controls.dispose();
        appInstance.enableControls();
    }

    if (mode == "NEW") {
        window.open(url);
    } else if (mode == "NO_RELOAD") {
        history.pushState('verge3d state', 'verge3d page', url);
    } else {
        var target;
        switch (mode) {
            case "SAME":
                target = "_self";
                break;
            case "TOP":
                target = "_top";
                break;
            case "PARENT":
                target = "_parent";
                break;
        }
        if (typeof window.PE != "undefined") {
            if (window.confirm("Are you sure you want to leave Puzzles?"))
                window.open(url, target);
        } else {
            window.open(url, target);
        }
    }
}



// whenClicked puzzle
initObjectPicking(function(obj) {

    // save the object for the pickedObject block
    _pGlob.pickedObject = obj ? getPickedObjectName(obj) : '';

    _pGlob.objClickCallbacks.forEach(function(el) {
        var isPicked = obj && objectsIncludeObj(el.objNames, getPickedObjectName(obj));
        el.callbacks[isPicked ? 0 : 1]();
    });
}, 'mousedown');



// whenClicked puzzle
function registerOnClick(objNames, cbDo, cbIfMissedDo) {
    objNames = retrieveObjectNames(objNames) || [];
    var objNamesFiltered = objNames.filter(function(name) {
        return name;
    });
    _pGlob.objClickCallbacks.push({
        objNames: objNamesFiltered,
        callbacks: [cbDo, cbIfMissedDo]
    });
}



registerOnHover('applecore', function() {
  setHTMLElemStyle('cursor', 'pointer', ['BODY'], false);
  outline('applecore', 'ENABLE');
}, function() {
  setHTMLElemStyle('cursor', 'default', ['BODY'], false);
  outline('applecore', 'DISABLE');
});
registerOnHover('avo', function() {
  setHTMLElemStyle('cursor', 'pointer', ['BODY'], false);
  outline('avo', 'ENABLE');
}, function() {
  setHTMLElemStyle('cursor', 'default', ['BODY'], false);
  outline('avo', 'DISABLE');
});
registerOnHover('cactus', function() {
  setHTMLElemStyle('cursor', 'pointer', ['BODY'], false);
  outline('cactus', 'ENABLE');
}, function() {
  setHTMLElemStyle('cursor', 'default', ['BODY'], false);
  outline('cactus', 'DISABLE');
});
registerOnHover('door', function() {
  setHTMLElemStyle('cursor', 'pointer', ['BODY'], false);
  outline('door', 'ENABLE');
}, function() {
  setHTMLElemStyle('cursor', 'default', ['BODY'], false);
  outline('door', 'DISABLE');
});
registerOnHover('football', function() {
  setHTMLElemStyle('cursor', 'pointer', ['BODY'], false);
  outline('football', 'ENABLE');
}, function() {
  setHTMLElemStyle('cursor', 'default', ['BODY'], false);
  outline('football', 'DISABLE');
});

['applecore', 'avo', 'cactus', 'football', 'door'];

appInstance.printPerformanceInfo();

registerOnClick('applecore', function() {
  openWebPage('https://repose.space/haha/HAHA.html', 'NEW');
}, function() {});
registerOnClick('avo', function() {
  openWebPage('https://repose.space/video_texture_copy/video_texture.html', 'NEW');
}, function() {});
registerOnClick('cactus', function() {
  openWebPage('https://repose.space/haha/HAHA.html', 'NEW');
}, function() {});
registerOnClick('football', function() {
  openWebPage('https://repose.space/haha/HAHA.html', 'NEW');
}, function() {});
registerOnClick('door', function() {
  openWebPage('https://repose.space/kallax.html', 'NEW');
}, function() {});



} // end of PL.init function

})(); // end of closure

/* ================================ end of code ============================= */
