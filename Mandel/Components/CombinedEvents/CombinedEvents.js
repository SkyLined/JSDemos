// The "capture" and "bubble" phase both automatically includes the "target" phase. We can detect the "target" phase by
// comparing the events "srcElement" property has the same value as the "currentTarget" property. The following
// functions allow you to easily add event listeners that exclusively trigger during the "capture", "target" or
// "bubble" phase, or exactly once during each of them.
// http://dev.w3.org/2006/webapi/DOM-Level-3-Events/html/DOM3-Events.html#capture-phase
// http://dev.w3.org/2006/webapi/DOM-Level-3-Events/html/DOM3-Events.html#target-phase
// http://dev.w3.org/2006/webapi/DOM-Level-3-Events/html/DOM3-Events.html#bubble-phase
var gaafEventWrappers = [];

function addCaptureTargetEventListener(oObject, sEvent, fEventHandler) {
  return oObject.addEventListener(sEvent, fEventHandler, true);
}
function removeCaptureTargetEventListener(oObject, sEvent, fEventHandler) {
  return oObject.removeEventListener(sEvent, fEventHandler, true);
}
function addCaptureEventListener(oObject, sEvent, fEventHandler) {
  // Use "capture" event listener but exclude "target" phase:
  var fEventHandlerWrapper = function (oEvent) {
    if (oEvent.target != oEvent.currentTarget) return fEventHandler.call(this, oEvent);
  }
  gaafEventWrappers.push([oObject, sEvent, fEventHandler, 'capture', fEventHandlerWrapper]);
  return oObject.addEventListener(sEvent, fEventHandlerWrapper, true);
}
function removeCaptureEventListener(oObject, sEvent, fEventHandler) {
  for (var i = 0; i < gaafEventWrappers.length; i++) {
    var afEventWrapper = gaafEventWrappers[i];
    if (afEventWrapper[0] === oObject && afEventWrapper[1] == sEvent && afEventWrapper[2] == fEventHandler && afEventWrapper[3] == 'capture') {
      gaafEventWrappers.splice(i, 1);
      return oObject.removeEventListener(sEvent, afEventWrapper[4], true);
    }
  }
  throw new Error('Event handler not registered');
}

function addTargetEventListener(oObject, sEvent, fEventHandler) {
  // Use "bubble" event listener but only call handler during "target" phase:
  var fEventHandlerWrapper = function (oEvent) {
    if (oEvent.target == oEvent.currentTarget) return fEventHandler.call(this, oEvent);
  }
  gaafEventWrappers.push([oObject, sEvent, fEventHandler, 'target', fEventHandlerWrapper]);
  oObject.addEventListener(sEvent, fEventHandlerWrapper, false);
}
function removeTargetEventListener(oObject, sEvent, fEventHandler) {
  for (var i = 0; i < gaafEventWrappers.length; i++) {
    var afEventWrapper = gaafEventWrappers[i];
    if (afEventWrapper[0] === oObject && afEventWrapper[1] == sEvent && afEventWrapper[2] == fEventHandler && afEventWrapper[3] == 'target') {
      gaafEventWrappers.splice(i, 1);
      return oObject.removeEventListener(sEvent, afEventWrapper[4], false);
    }
  }
  throw new Error('Event handler not registered');
}
function addBubbleTargetEventListener(oObject, sEvent, fEventHandler) {
  oObject.addEventListener(sEvent, fEventHandler, false);
}
function addBubbleEventListener(oObject, sEvent, fEventHandler) {
  // Use "bubble" event listener but exclude "target" phase:
  var fEventHandlerWrapper = function (oEvent) {
    if (oEvent.target != oEvent.currentTarget) return fEventHandler.call(this, oEvent);
  }
  gaafEventWrappers.push([oObject, sEvent, fEventHandler, 'bubble', fEventHandlerWrapper]);
  oObject.addEventListener(sEvent, fEventHandlerWrapper, false);
}
function removeBubbleEventListener(oObject, sEvent, fEventHandler) {
  for (var i = 0; i < gaafEventWrappers.length; i++) {
    var afEventWrapper = gaafEventWrappers[i];
    if (afEventWrapper[0] === oObject && afEventWrapper[1] == sEvent && afEventWrapper[2] == fEventHandler && afEventWrapper[3] == 'bubble') {
      gaafEventWrappers.splice(i, 1);
      return oObject.removeEventListener(sEvent, afEventWrapper[4], false);
    }
  }
  throw new Error('Event handler not registered');
}

function addCombinedEventListener(oObject, sEvent, fEventHandler) {
  // Call event listener with two extra arguments: "bCapture" and "bBubble", which indicate if the event is in the
  // "capture" phase (true, false), "target phase" (false, false) or "bubble phase" (false, true).
  // Use "capture" event listener which includes the "target" phase:
  var fCaptureEventHandlerWrapper = function (oEvent) {
    return fEventHandler.call(this, oEvent, oEvent.target != oEvent.currentTarget, false);
  }
  var fBubbleEventHandlerWrapper = function (oEvent) {
    if (oEvent.target != oObject) return fEventHandler.call(this, oEvent, false, true);
  }
  gaafEventWrappers.push([oObject, sEvent, fEventHandler, 'combined', fCaptureEventHandlerWrapper, fBubbleEventHandlerWrapper]);
  oObject.addEventListener(sEvent, fCaptureEventHandlerWrapper, true);
  // Use "bubble" event listener but exclude the "target" phase, as we already handeled that in the "capture" phase:
  oObject.addEventListener(sEvent, fBubbleEventHandlerWrapper, false);
}

function removeCombinedEventListener(oObject, sEvent, fEventHandler) {
  for (var i = 0; i < gaafEventWrappers.length; i++) {
    var afEventWrapper = gaafEventWrappers[i];
    if (afEventWrapper[0] === oObject && afEventWrapper[1] == sEvent && afEventWrapper[2] == fEventHandler && afEventWrapper[3] == 'combined') {
      gaafEventWrappers.splice(i, 1);
      oObject.removeEventListener(sEvent, afEventWrapper[4], true);
      return oObject.removeEventListener(sEvent, afEventWrapper[5], false);
    }
  }
  throw new Error('Event handler not registered');
}

