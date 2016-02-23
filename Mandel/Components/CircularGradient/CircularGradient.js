function CircularGradient(oDefaultColor) {
  var oThis = this;
  oThis.__oDefaultColor = oDefaultColor || null;
  oThis.__aoColors = [];
}

CircularGradient.prototype.addColor = function(oRGBA, nProgress, nPower) {
  var oThis = this;
  oThis.__aoColors.push({
    __oRGBA:      oRGBA,
    __nProgress:  Math.max(0, Math.min(1, parseFloat(nProgress))),
    __nPower:     parseFloat(nPower),
  });
}

CircularGradient.prototype.getColor = function(nProgress) {
  var oThis = this;
  var nRTotal = 0, nGTotal = 0, nBTotal = 0, nATotal = 0;
  oThis.__aoColors.forEach(function(oGradientColor) {
    var nA = Math.pow((1 + Math.sin((nProgress + oGradientColor.__nProgress) * Math.PI * 2)) / 2, oGradientColor.__nPower);
    nRTotal += oGradientColor.__oRGBA.nR * oGradientColor.__oRGBA.nA * nA;
    nGTotal += oGradientColor.__oRGBA.nG * oGradientColor.__oRGBA.nA * nA;
    nBTotal += oGradientColor.__oRGBA.nB * oGradientColor.__oRGBA.nA * nA;
    nATotal += nA;
  });
  if (nATotal > 0) {
    return oThis.__oDefaultColor.copy().overlay(new RGBA(nRTotal, nGTotal, nBTotal, nATotal));
  } else {
    return oThis.__oDefaultColor.copy();
  }
}
