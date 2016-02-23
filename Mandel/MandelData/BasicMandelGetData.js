function BasicMandelGetData(nX, nY, iMaxIterations) {
  var nEscape = Math.pow(2, 12),
      iIterations = 1,
      nCI = nY,
      nCR = nX,
      nZI = nCI,
      nZR = nCR,
      nI2, nR2;
  // http://en.wikipedia.org/wiki/Mandelbrot_set#Optimizations
//  var tx = (nCR - .25), ty2 = nCI * nCI, q = tx * tx + ty2;
/*  if (q * (q + tx) < .25 * ty2) {
    iIterations = iMaxIterations;
  }*/
  while(Math.abs(nZI) + Math.abs(nZR) < 2.24) {
    if (++iIterations > iMaxIterations) {
      return {nValue: 0, nOpacity: 0, sValueType: 'none'}
    }
    nI2 = nZI * nZI;
    nR2 = nZR * nZR;
    nZI = nZR * nZI * 2 + nCI;
    nZR = nR2 - nI2 + nCR;
  }
  var nProgressToInfinity = 1 - (iIterations - .5) / iMaxIterations;
  var nValue = 3 + Math.log(1 + (Math.E - 1) / (1 - nProgressToInfinity));
  return {nValue: nValue, nOpacity: 1, sValueType: 'distance'};
}
BasicMandelGetData.sDescription = 'Escape time';