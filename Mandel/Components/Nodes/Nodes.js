var goNamespaces = {
  'xhtml': 'http://www.w3.org/1999/xhtml',
  'svg':   'http://www.w3.org/2000/svg',
}

function createNode(oDetails, oParentOrDocument) {
  var oNodes = __createNodes([oDetails], oParentOrDocument, {'':[]});
  if (oNodes[''].length > 0) return oNodes[''][0];
  for (var sName in oNodes) if (sName != '') return oNodes[sName];
}
function createNodes(aoDetails, oParentOrDocument) {
  return __createNodes(aoDetails, oParentOrDocument, {'':[]});
}
function __createNodes(aoDetails, oParentOrDocument, oNodes) {
  var bDocument = oParentOrDocument.nodeType == 9; // DOCUMENT_NODE
  var oDocument = bDocument ? oParentOrDocument : oParentOrDocument.ownerDocument;
  var oParent = bDocument ? null : oParentOrDocument;
  aoDetails.forEach(function(oDetails) {
    if (!('name' in oDetails)) throw new Error('Details is missing a tag name.');
    var sTagName = oDetails.name;
    var sNamespace = 'namespace' in oDetails ? oDetails.namespace : null;
    var iEqualsIndex = sTagName.indexOf('=');
    var sName = null;
    if (iEqualsIndex > -1) {
      var sName = sTagName.substr(0, iEqualsIndex);
      sTagName = sTagName.substr(iEqualsIndex + 1);
    }
    var iColonIndex = sTagName.indexOf(':');
    if (iColonIndex > -1) {
      var sNamespacePrefix = sTagName.substr(0, iColonIndex);
      sTagName = sTagName.substr(iColonIndex + 1);
      if (sNamespace != null && goNamespaces[sNamespacePrefix] != sNamespace)
          throw new Error('Details has conflicting namespace and prefix');
      sNamespace = goNamespaces[sNamespacePrefix];
    }
    if (sNamespace == null) sNamespace = goNamespaces['xhtml'];
    var oNode = oDocument.createElementNS(sNamespace, sTagName);
    if (sName == null) {
      oNodes[''].push(oNode);
    } else {
      if (sName in oNodes) throw new Error('Cannot create two nodes named "' + sName + '"');
      oNodes[sName] = oNode;
    }
    if (oParent != null) oParent.appendChild(oNode);
    if ('attributes' in oDetails)
        for (var sAttributeName in oDetails.attributes)
            oNode.setAttribute(sAttributeName, oDetails.attributes[sAttributeName]);
    if ('styles' in oDetails)
        for (var sStyleName in oDetails.styles)
            oNode.style[sStyleName] = oDetails.styles[sStyleName];
    if ('html' in oDetails)
        oNode.innerHTML = oDetails.html;
    if ('children' in oDetails)
        __createNodes(oDetails.children, oNode, oNodes);
    if ('captureEvents' in oDetails)
        for (var sEvent in oDetails.captureEvents)
            addCaptureEventListener(oNode, sEvent, oDetails.captureEvents[sEvent]);
    if ('captureTargetEvents' in oDetails)
        for (var sEvent in oDetails.captureTargetEvents)
            addCaptureTargetEventListener(oNode, sEvent, oDetails.captureTargetEvents[sEvent]);
    if ('targetEvents' in oDetails)
        for (var sEvent in oDetails.targetEvents)
            addTargetEventListener(oNode, sEvent, oDetails.targetEvents[sEvent]);
    if ('bubbleTargetEvents' in oDetails)
        for (var sEvent in oDetails.bubbleTargetEvents)
            addBubbleTargetEventListener(oNode, sEvent, oDetails.bubbleTargetEvents[sEvent]);
    if ('bubbleEvents' in oDetails)
        for (var sEvent in oDetails.bubbleEvents)
            addBubbleEventListener(oNode, sEvent, oDetails.bubbleEvents[sEvent]);
  });
  return oNodes;
}