function CombinedFeatherMandelTask(oMandelRenderer) {
  var oThis = this;
  oThis.sDescription = 'Combined angles, feathered for escape';
  oThis.oMandelRenderer = oMandelRenderer;
  oThis.nWidth = 1 / oMandelRenderer.nZoom;
  oThis.nHeight = oMandelRenderer.oImageData.height / (oMandelRenderer.nZoom * oMandelRenderer.oImageData.width);
  oThis.progress = 0;
  oThis.iIndex = 0;
  oThis.iY = 0;
  oThis.nY = oMandelRenderer.oCenter.y - oThis.nHeight / 2;
  oThis.iX = 0;
}
CombinedFeatherMandelTask.prototype.run = function () {
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
CombinedFeatherMandelTask.prototype.setPixel = function() {
  var oThis = this,
      iIterations = 0,
      nCI = oThis.nY,
      nCR = oThis.oMandelRenderer.oCenter.x + (oThis.iX / oThis.oMandelRenderer.oImageData.width - 0.5) * oThis.nWidth,
      nZI = nCI,
      nZR = nCR,
      nI2, nR2, d;
  var nAngle = Math.atan2(nZI, nZR);
  while( (d = (nI2 = nZI * nZI) + (nR2 = nZR * nZR)) < oThis.nEscape && iIterations < oThis.oMandelRenderer.iMaxIterations) {
    nZI = nZR * nZI * 2 + nCI; nZR = nR2 - nI2 + nCR;
    nAngle += Math.atan2(nZI, nZR);
    iIterations++;
  }
  var nOvershot = d < oThis.nEscape ? 0 :
      Math.log(Math.log(Math.sqrt(d)) / Math.log(Math.sqrt(oThis.nEscape))) / Math.log(2);
  var nAngle1 = (((nAngle / Math.PI / 2 + .5) % 1) + 1) % 1;
  var nValue1 = Math.pow(nAngle1, oThis.oMandelRenderer.nColorPower);
  var oColor = oThis.oMandelRenderer.oColorGradient.getColor(nValue1 + oThis.oMandelRenderer.nColorBase);
  nZI = nZR * nZI * 2 + nCI; nZR = nR2 - nI2 + nCR;
  d = (nI2 = nZI * nZI) + (nR2 = nZR * nZR);
  nAngle += Math.atan2(nZI, nZR);
  var nAngle2 = (((nAngle / Math.PI / 2 + .5) % 1) + 1) % 1;
  var nValue2 = Math.pow(nAngle2, oThis.oMandelRenderer.nColorPower);
  var oColor2 = oThis.oMandelRenderer.oColorGradient.getColor(nValue2 + oThis.oMandelRenderer.nColorBase);
  oColor.mixRGB(oColor2, 1 - nOvershot);
  oThis.oMandelRenderer.oImageData.data[oThis.iIndex++] = oColor.r255();
  oThis.oMandelRenderer.oImageData.data[oThis.iIndex++] = oColor.g255();
  oThis.oMandelRenderer.oImageData.data[oThis.iIndex++] = oColor.b255();
  oThis.oMandelRenderer.oImageData.data[oThis.iIndex++] = 255;
}