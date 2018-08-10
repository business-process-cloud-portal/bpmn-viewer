import BpmnViewer from 'bpmn-js/lib/NavigatedViewer';
import TouchModule from 'diagram-js/lib/navigation/touch';
import DriveAppsUtil from 'drive-apps-util';
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

let options = {
  "clientId": "349923725301-cn75hqucfe63q2r40j1i40oiuocgtpst.apps.googleusercontent.com",
  "scope": [
    "profile",
    "https://www.googleapis.com/auth/drive.readonly",
    "https://www.googleapis.com/auth/drive.install"
  ]
};

let driveAppsUtil = new DriveAppsUtil(options);
driveAppsUtil.init().then(() => {
  driveAppsUtil.login().then((user) => {
    showUserImage(user);

    if (window.location.search) {
      let state = JSON.parse(decodeURI(window.location.search.substr(7)));
      if (state.action === "open") {
        id = state.ids[0];
        driveAppsUtil.getDocumentContent(id).then((text) => {
          window.localStorage.setItem("bpmndoc", text);
          loadViewer(text);
        }, (reason) => {
          showErrorMessage(reason);
        });
        driveAppsUtil.getDocumentMeta(id).then((fileinfo) => {
          document.getElementById('docinfo').textContent = fileinfo.name;
          document.getElementById('docinfodrawer').textContent = fileinfo.name;
          document.title = fileinfo.name;
          window.localStorage.setItem("bpmndoctitle", fileinfo.name);
        }, (reason) => {
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
        }
      }
    }
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

function showUserImage(user) {
  document.getElementById('userimage').classList.remove("is-hidden");
  document.getElementById('userimage').classList.add("visible");
  document.getElementById('userimage').src = user.get().getBasicProfile().getImageUrl();
}

function loadViewer(text) {
  var viewer = new BpmnViewer({ container: '#viewer', position: "absolute", additionalModules: [TouchModule] });
  window.viewer = viewer;
  document.getElementById('splash').style.visibility = "hidden";
  viewer.importXML(text, function (err) {

    if (err) {
      showErrorMessage('Error loading BPMN model: ' + err);
    }
    else {
      viewer.get('canvas').zoom('fit-viewport', 'auto');
      showInfoMessage('BPMN model loaded');
    }
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