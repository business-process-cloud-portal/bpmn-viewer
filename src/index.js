import BpmnViewer from 'bpmn-js/lib/NavigatedViewer';
import TouchModule from 'diagram-js/lib/navigation/touch';
import GoogleLoadDocument from 'google-document-loader';
import MarterialDesign from 'material-design-lite';



if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('worker.js').then(registration => {
      console.log('SW registered: ', registration);
    }).catch(registrationError => {
      console.log('SW registration failed: ', registrationError);
    });
  });
}


let id = "0B-K7oJWHTbZ8RjZ0LWhEM3JQbm8";

var viewer = new BpmnViewer({ container: '#viewer', position: "absolute", additionalModules: [TouchModule] });
window.viewer = viewer;
let options = {
  "clientId": "349923725301-cn75hqucfe63q2r40j1i40oiuocgtpst.apps.googleusercontent.com",
  "scope": [
    "profile",
    "https://www.googleapis.com/auth/drive.readonly",
    "https://www.googleapis.com/auth/drive.install"
  ]
};

if (window.location.search) {
  let state = JSON.parse(decodeURI(window.location.search.substr(7)));
  if (state.action === "open") {
    id = state.ids[0];
  }

  let loadDocument = new GoogleLoadDocument(options);
  loadDocument.getDocument(id).then((text) => {
    document.getElementById('userimage').src = auth.currentUser.get().getBasicProfile().getImageUrl();
    window.localStorage.setItem("bpmndoc", text);
    loadViewer(text);

    gapi.client.request({ 'path': 'https://www.googleapis.com/drive/v3/files/' + id, 'params': { 'supportsTeamDrives': true } })
      .then(function (response) {
        let fileinfo = JSON.parse(response.body);
        document.getElementById('docinfo').textContent = fileinfo.name;
        document.getElementById('docinfodrawer').textContent = fileinfo.name;
        document.title = fileinfo.name;
        window.localStorage.setItem("bpmndoctitle", fileinfo.name);
        document.getElementById('splash').style.visibility = "hidden";
      },
        function (reason) {
          showErrorMessage('Error loading BPMN model: ' + reason);
        });
  },
    (reason) => {
      if (typeof auth.currentUser === 'Object') {
        document.getElementById('userimage').src = auth.currentUser.get().getBasicProfile().getImageUrl();
      }
      showErrorMessage(reason);
    });
}
else {
  let text = window.localStorage.getItem("bpmndoc");
  if (text) {
    loadViewer(text);
    document.getElementById('docinfo').textContent = window.localStorage.getItem("bpmndoctitle");
    document.getElementById('docinfodrawer').textContent = window.localStorage.getItem("bpmndoctitle");
    document.title = window.localStorage.getItem("bpmndoctitle");
    document.getElementById('splash').style.visibility = "hidden";
  }
  document.getElementById('userimage').hidden = true;
}

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


function loadViewer(text) {
  viewer.importXML(text, function (err) {

    if (err) {
      showErrorMessage('Error loading BPMN model: ' + err);
    }
    else {
      showInfoMessage('BPMN model loaded');
    }
    viewer.get('canvas').zoom('fit-viewport', 'auto');
  });
}

function showErrorMessage(message) {
  if (typeof message.status !== 'undefined') {
    if (message.status === 404) {
      message = 'BPMN model not found.';
    }

  }
  var notification = document.querySelector('.mdl-js-snackbar');
  notification.MaterialSnackbar.showSnackbar(
    {
      message: message,
      timeout: 10000
    }
  );
}

function showInfoMessage(message) {
  var notification = document.querySelector('.mdl-js-snackbar');
  notification.MaterialSnackbar.showSnackbar(
    {
      message: message
    }
  );
}