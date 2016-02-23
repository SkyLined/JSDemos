function SmoothMandelTask(oMandelRenderer) {
  var oThis = this;
  oThis.sDescription = 'Smoothed escape time';
  oThis.oMandelRenderer = oMandelRenderer;
  oThis.nWidth = 1 / oMandelRenderer.nZoom;
  oThis.nHeight = oMandelRenderer.oImageData.height / (oMandelRenderer.nZoom * oMandelRenderer.oImageData.width);
  oThis.progress = 0;
  oThis.iIndex = 0;
  oThis.iY = 0;
  oThis.nY = oMandelRenderer.oCenter.y - oThis.nHeight / 2;
  oThis.iX = 0;
}
SmoothMandelTask.prototype.run = function () {
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
SmoothMandelTask.prototype.setPixel = function() {
  var oThis = this,
      iIterations = 0,
      nCI = oThis.nY,
      nCR = oThis.oMandelRenderer.oCenter.x + (oThis.iX / oThis.oMandelRenderer.oImageData.width - 0.5) * oThis.nWidth,
      nZI = nCI,
      nZR = nCR,
      nI2, nR2, d;
  // http://en.wikipedia.org/wiki/Mandelbrot_set#Optimizations
  var tx = (nCR - .25), ty2 = oThis.nY * oThis.nY, q = tx * tx + ty2;
  if (q * (q + tx) < .25 * ty2) {
    iIterations = oThis.oMandelRenderer.iMaxIterations;
  }
  while ((d = (nI2 = nZI * nZI) + (nR2 = nZR * nZR)) < oThis.nEscape) {
    if (++iIterations > oThis.oMandelRenderer.iMaxIterations) {
      var iCheckerBoard = 255 - ((Math.floor(oThis.iX / 10) + Math.floor(oThis.iY / 10)) % 2) * 32;
      oThis.oMandelRenderer.oImageData.data[oThis.iIndex++] = 
      oThis.oMandelRenderer.oImageData.data[oThis.iIndex++] = 
      oThis.oMandelRenderer.oImageData.data[oThis.iIndex++] = iCheckerBoard;
      oThis.oMandelRenderer.oImageData.data[oThis.iIndex++] = 255;
      return;
    }
    nZI = nZR * nZI * 2 + nCI; nZR = nR2 - nI2 + nCR;
  }
  var nOvershot = 1 - Math.log(Math.log(Math.sqrt(d)) / Math.log(Math.sqrt(oThis.nEscape))) / Math.log(2);

  var nProgressToInfinity = 1 - (iIterations + nOvershot - 1) / oThis.oMandelRenderer.iMaxIterations;
  var nValue = 3 + Math.log(1 + (Math.E - 1) / (1 - nProgressToInfinity));
  nValue *= oThis.oMandelRenderer.nColorSpeed / 5;
  var oColor = oThis.oMandelRenderer.oColorGradient.getColor(nValue + oThis.oMandelRenderer.nColorBase);
  oThis.oMandelRenderer.oImageData.data[oThis.iIndex++] = oColor.r255();
  oThis.oMandelRenderer.oImageData.data[oThis.iIndex++] = oColor.g255();
  oThis.oMandelRenderer.oImageData.data[oThis.iIndex++] = oColor.b255();
  oThis.oMandelRenderer.oImageData.data[oThis.iIndex++] = 255;
}