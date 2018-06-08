import BpmnViewer from 'bpmn-js/lib/NavigatedViewer';
import bpmnDiagram from './diagram.bpmn';
import GoogleLoadDocument from 'google-document-loader';
import MarterialDesign from 'material-design-lite';

let id = "0B-K7oJWHTbZ8RjZ0LWhEM3JQbm8";

var viewer = new BpmnViewer({ container: '#viewer', height: '85%' });
window.viewer=viewer;
let options = {
  "clientId": "349923725301-cn75hqucfe63q2r40j1i40oiuocgtpst.apps.googleusercontent.com",
  "scope": [
    "profile",
    "https://www.googleapis.com/auth/drive",
    "https://www.googleapis.com/auth/drive.install"
  ]
};

let state = JSON.parse(decodeURI(window.location.search.substr(7)));
if (state.action === "open") {
  id = state.ids[0];
  console.log(id);
}

let loadDocument = new GoogleLoadDocument(options);
loadDocument.getDocument(id, function(text) {
  document.getElementById('userimage').src=auth.currentUser.get().getBasicProfile().getImageUrl();

  viewer.importXML(text, function(err) {

    if (err) {
      console.log('error rendering', err);
    } else {
      console.log('rendered');
    }
    viewer.get('canvas').zoom('fit-viewport', 'auto');
  });

  gapi.client.request({'path': 'https://www.googleapis.com/drive/v3/files/' + id, 'params': {'supportsTeamDrives': true}})
    .then(function(response) {
      let fileinfo = JSON.parse(response.body);
      document.getElementById('docinfo').textContent=fileinfo.name;
      document.title=fileinfo.name;
    });
});

window.exportSVG = function saveSVG() {
  viewer.saveSVG({}, function (err, svgdata) {
    var DOMURL = window.URL || window.webkitURL || window;
    var svgBlob = new Blob([svgdata], { type: 'image/svg+xml;charset=utf-8' });
    var url = DOMURL.createObjectURL(svgBlob);
    
    var event = new MouseEvent('click', {
      'view': window,
      'bubbles': true,
      'cancelable': true
     });
  
     var a = document.createElement('a');
     a.setAttribute('download', document.getElementById('docinfo').textContent + ".svg");
     a.setAttribute('href', url);
     a.setAttribute('target', '_blank');
     a.dispatchEvent(event);
  });
}

