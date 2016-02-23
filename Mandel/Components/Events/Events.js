function addEvents(oThis, asEventNames) {
  oThis.__dsfEventListeners = {};
  asEventNames.forEach(function(sEventName) {
    oThis.__dsfEventListeners[sEventName] = [];
  });
}
function addEventsCode(fConstructor, oThis) {
  fConstructor.prototype.addEventListener = function(sEventName, fEventHandler) {
    if (typeof(fEventHandler) != 'function') throw new Error('Event handler must be a function');
    var oThis = this;
    if (sEventName in oThis.__dsfEventListeners) {
      oThis.__dsfEventListeners[sEventName].push(fEventHandler);
    } else {
      throw new Error('Unknown event "' + sEventName + '"');
    }
  }
  fConstructor.prototype.removeEventListener = function(sEventName, fEventHandler) {
    if (typeof(fEventHandler) != 'function') throw new Error('Event handler must be a function');
    var oThis = this;
    if (sEventName in oThis.__dsfEventListeners) {
      var iIndex = oThis.__dsfEventListeners[sEventName].indexOf(fEventHandler);
      if (iIndex != -1) {
        oThis.__dsfEventListeners[sEventName].splice(iIndex, 1);
      } else {
        throw new Error('Handler for "' + sEventName + '" not registered: ' + fEventHandler);
      }
    } else {
      throw new Error('Unknown event "' + sEventName + '"');
    }
  }
  fConstructor.prototype.fireEvent = function (sEventName, oDetails) {
    var oThis = this;
    if (sEventName in oThis.__dsfEventListeners) {
      oThis.__dsfEventListeners[sEventName].forEach(function (fEventHandler) {
        fEventHandler(oThis, oDetails);
      });
    } else {
      throw new Error('Unknown event "' + sEventName + '"');
    }
  }
}