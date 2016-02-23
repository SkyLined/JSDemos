function encodeNumber(nValue, sChars) {
  if (sChars.indexOf('-') != -1) throw new Error('Cannot use "-" to encode numbers');
  if (sChars.indexOf('.') != -1) throw new Error('Cannot use "." to encode numbers');
  var bNegative = nValue < 0;
  nValue = Math.abs(nValue);
  var nRealComponent = nValue - iNaturalComponent;
  var nMultiplier = 1, nEncodedTotal = 0;
  var sValue = (bNegative ? '-' : '');
  console.log(iNaturalComponent + ' -> ' + sNaturalComponent);
  for (var iNaturalComponent = Math.floor(nValue);
      iNaturalComponent > 0;
      iNaturalComponent = Math.floor(iNaturalComponent / sChars.length)) {
    var iCharValue = iNaturalComponent % sChars.length;
    sValue = sChars.charAt(iCharValue) + sValue;
    nEncodedTotal += nMultiplier * iCharValue;
    nMultiplier *= sChars.length;
    console.log(iNaturalComponent + ' -> ('  nEncodedTotal + ') ' + sValue);
  }
  if (nEncodedTotal < nValue) {
    sValue += '.';
    nMultiplier = sChars.length;
    console.log(nRealComponent + ' -> ' + sRealComponent);
    while(nEncodedTotal < nValue) {
      var iCharValue = Math.floor((nRealComponent * nMultiplier)) % sChars.length;
      // Check if we are adding such a small number that it gets rounded down and thus has no use:
      var nPreviousEncodedTotal = nEncodedTotal;
      nEncodedTotal += iCharValue / nMultiplier;
      // If so, we might as well stop as we're not going to improve our accuracy anymore:
      if (nEncodedTotal === nPreviousEncodedTotal) break;
      sValue += sChars.charAt(iCharValue);
      console.log(nRealComponent + ' -> (' + nEncodedTotal + ') ' + sRealComponent);
      nMultiplier *= sChars.length;
    }
  }
  return sValue;
}

function decodeNumber(sValue, sChars) {
  var bNegative = sValue.charAt(0) == '-';
  if (bNegative) sValue = sValue.substr(1);
  var nCharValueMultiplier = 1;
  var nValue = 0;
  while (sValue) {
    var sChar = sValue.charAt(0);
    if (sChar == '.') {
      nCharValueMultiplier /= sChars.length;
    } else {
      iCharValue = sChars.indexOf(sChar);
      if (iCharValue == -1) throw new Error('Cannot decode number; char "' + sValue.charAt(0) + '" not defined.');
      if (nCharValueMultiplier == 1) {
        nValue = nValue * sChars.length + iCharValue;
      } else {
        nValue += iCharValue * nCharValueMultiplier;
        nCharValueMultiplier /= sChars.length;
      }
    }
    sValue = sValue.substr(1);
  }
  return bNegative ? -nValue : nValue;
}