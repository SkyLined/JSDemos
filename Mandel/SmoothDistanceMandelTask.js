function SmoothDistanceMandelTask(oMandelRenderer) {
  var oThis = this;
  oThis.sDescription = 'Smooth escape time or distance to (0,0)';
  oThis.oMandelRenderer = oMandelRenderer;
  oThis.nWidth = 1 / oMandelRenderer.nZoom;
  oThis.nHeight = oMandelRenderer.oImageData.height / (oMandelRenderer.nZoom * oMandelRenderer.oImageData.width);
  oThis.progress = 0;
  oThis.iIndex = 0;
  oThis.iY = 0;
  oThis.nY = oMandelRenderer.oCenter.y - oThis.nHeight / 2;
  oThis.iX = 0;
}
SmoothDistanceMandelTask.prototype.run = function () {
  var oThis = this;
  oThis.nEscape = Math.pow(2, 12);
  oThis.setPixel();
  oThis.iX++;
  if (oThis.iX == oThis.oMandelRenderer.oImageData.width) {
    oThis.iX = 0;
    oThis.iY++;
    oThis.nY = oThis.oMandelRenderer.oCenter.y + (oThis.iY / oThis.oMandelRenderer.oImageData.height - 0.5) * oThis.nHeight;
    oThis.progress = oThis.iY / oThis.oMandelRenderer.oImageData.height;
  }
}
SmoothDistanceMandelTask.prototype.setPixel = function() {
  var oThis = this,
      iIterations = 0,
      nCI = oThis.nY,
      nCR = oThis.oMandelRenderer.oCenter.x + (oThis.iX / oThis.oMandelRenderer.oImageData.width - 0.5) * oThis.nWidth,
      nZI = nCI,
      nZR = nCR,
      nI2 = nZI * nZI,
      nR2 = nZR * nZR,
      d;
  var nCheckerBoard = 1 - ((Math.floor(oThis.iX / 10) + Math.floor(oThis.iY / 10)) % 2) / 8;
  var nValue = null;
  while(iIterations < oThis.oMandelRenderer.iMaxIterations) {
    nZI = nZR * nZI * 2 + nCI; nZR = nR2 - nI2 + nCR;
    iIterations++;
    if ((d = (nI2 = nZI * nZI) + (nR2 = nZR * nZR)) >= oThis.nEscape) {
      var nOvershot = 1 - Math.log(Math.log(Math.sqrt(d)) / Math.log(Math.sqrt(oThis.nEscape))) / Math.log(2);
      var nProgressToInfinity = 1 - (iIterations + nOvershot - 1) / oThis.oMandelRenderer.iMaxIterations;
      var nPower = Math.log(oThis.oMandelRenderer.iMaxIterations) / 100;
      nValue = Math.log(1 + (Math.pow(Math.E, nPower) - 1) / (1 - nProgressToInfinity)) / nPower;
      break;
    };
  }
  if (nValue == null) {
    var nProgressToEscape = Math.sqrt(d) / Math.sqrt(oThis.nEscape);
    var nPower = Math.log(oThis.oMandelRenderer.iMaxIterations);
    nValue = Math.log(1 + (Math.pow(Math.E, nPower) - 1) * nProgressToEscape) / nPower;
  }
  
  nValue = Math.pow(nValue, 1/4) * oThis.oMandelRenderer.nColorSpeed;
  var oColor = oThis.oMandelRenderer.oColorGradient.getColor(nValue + oThis.oMandelRenderer.nColorBase);
  oThis.oMandelRenderer.oImageData.data[oThis.iIndex++] = oColor.r255();
  oThis.oMandelRenderer.oImageData.data[oThis.iIndex++] = oColor.g255();
  oThis.oMandelRenderer.oImageData.data[oThis.iIndex++] = oColor.b255();
  oThis.oMandelRenderer.oImageData.data[oThis.iIndex++] = 255;
}