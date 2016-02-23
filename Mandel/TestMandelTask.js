function TestMandelTask(oMandelRenderer) {
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
TestMandelTask.prototype.run = function () {
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
TestMandelTask.prototype.setPixel = function() {
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
  var nValue = null, nAngle = Math.atan2(nZI, nZR), d = Math.sqrt(nI2 + nR2), nDistance = Math.sqrt(d / Math.sqrt(oThis.nEscape));
  while(iIterations < oThis.oMandelRenderer.iMaxIterations) {
    nZI = nZR * nZI * 2 + nCI; nZR = nR2 - nI2 + nCR;
    nI2 = nZI * nZI; nR2 = nZR * nZR;
    nAngle += Math.atan2(nZI, nZR);
    d = Math.sqrt(nI2 + nR2);
    nDistance = Math.sqrt(nDistance) * d / Math.sqrt(oThis.nEscape);
    iIterations++;
    if (d >= Math.sqrt(oThis.nEscape)) {
      var nProgressToEscape = nDistance;
      var nOvershot = 1 - Math.log(Math.log(d) / Math.log(Math.sqrt(oThis.nEscape))) / Math.log(2);
      var nProgressToInfinity = 1 - (iIterations + nOvershot - 1) / oThis.oMandelRenderer.iMaxIterations;
      nValue = Math.log(1 + (Math.E - 1) / (nDistance - nProgressToInfinity));
      break;
    };
  }
  if (nValue == null) {
    var nProgressToEscape = nDistance;
    nValue = Math.log(1 + (Math.E - 1) / nProgressToEscape);
    nValue *= oThis.oMandelRenderer.nColorSpeed / 5;
    var oColor = oThis.oMandelRenderer.oColorGradient.getColor(nValue + oThis.oMandelRenderer.nColorBase);
  } else {
    nValue *= oThis.oMandelRenderer.nColorSpeed / 5;
    var oColor = oThis.oMandelRenderer.oColorGradient.getColor(nValue + oThis.oMandelRenderer.nColorBase);
    if (Math.floor(oThis.iY / 10) % 2)
      oColor.nR *= .5;
  }
  oThis.oMandelRenderer.oImageData.data[oThis.iIndex++] = oColor.r255();
  oThis.oMandelRenderer.oImageData.data[oThis.iIndex++] = oColor.g255();
  oThis.oMandelRenderer.oImageData.data[oThis.iIndex++] = oColor.b255();
  oThis.oMandelRenderer.oImageData.data[oThis.iIndex++] = 255;
}