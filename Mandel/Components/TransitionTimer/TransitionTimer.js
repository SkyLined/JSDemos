function TransitionTimer(nDuration, nFrequency, fProgressCallback, fCancelledCallback) {
  var oThis = this;
  oThis.__nDuration = parseFloat(nDuration);
  oThis.__nFrequency = parseFloat(nFrequency);
  oThis.__fProgressCallback = fProgressCallback;
  oThis.__fCancelledCallback = fCancelledCallback || null;
  oThis.__iInterval = null;
  oThis.__iStartTime = null;
  oThis.__bStarted = false;
  oThis.__bCancelled = false;
}

TransitionTimer.prototype.start = function () {
  var oThis = this;
  if (oThis.__bStarted) return;
  oThis.__bStarted = true;
  if (oThis.__bCancelled) return;
  oThis.__iStartTime = new Date().valueOf();
  if (oThis.__nDuration <= 0) {
    oThis.__fProgressCallback(1);
  } else {
    oThis.__iInterval = setInterval(function() {
      if (oThis.__bCancelled) return;
      var nProgress = (new Date().valueOf() - oThis.__iStartTime) / (1000 * oThis.__nDuration);
      if (nProgress >= 1) {
        clearInterval(oThis.__iInterval);
        oThis.__fProgressCallback(1);
      } else {
        oThis.__fProgressCallback(nProgress);
      }
    }, Math.min(oThis.__nDuration, 1000 / oThis.__nFrequency));
  }
}
TransitionTimer.prototype.cancel = function () {
  var oThis = this;
  if (oThis.__bCancelled) return;
  oThis.__bCancelled = true;
  if (oThis.__bStarted) {
    clearInterval(oThis._iInterval);
  }
  if (oThis.__fCancelledCallback != null) oThis.__fCancelledCallback();
}
