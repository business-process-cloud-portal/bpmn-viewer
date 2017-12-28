import BpmnViewer from 'bpmn-js';
import bpmnDiagram from './diagram.bpmn';
import GoogleLoadDocument from 'google-document-loader';

let id = "0B-K7oJWHTbZ8RjZ0LWhEM3JQbm8";

var viewer = new BpmnViewer({ container: '#viewer' });

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
  viewer.importXML(text, function(err) {

    if (err) {
      console.log('error rendering', err);
    } else {
      console.log('rendered');
    }
  });

});
