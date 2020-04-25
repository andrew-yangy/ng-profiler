import { Message, MessageMethod, MessageType } from "../communication/message.type";
import { AngularInfo } from "../core";

function onDOMContentLoaded() {
  const enableCheckBox = document.getElementById('enable');
  const descrElem = document.getElementById('description');
  const errorElem = document.getElementById('error');
  const enableSwitch = document.getElementById('enableSwitch');

  chrome.storage.local.get('ngProfilerEnabled', (content) => {
    (enableCheckBox as HTMLInputElement).checked = !!content.ngProfilerEnabled;
  });

  enableCheckBox.addEventListener('change', e => {
    const enabled = (e.target as HTMLInputElement).checked;
    chrome.storage.local.set({ngProfilerEnabled: enabled});
    chrome.browserAction.setIcon({
      path: enabled ? {
        '16': 'images/icon16.png',
        '48': 'images/icon48.png',
        '128': 'images/icon128.png',
      } : {
        "16": "images/icon16_disabled.png",
        "48": "images/icon48_disabled.png",
        "148": "images/icon148_disabled.png"
      },
    });
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      const message: Message<boolean> = {
        type: MessageType.TOGGLE_PROFILING,
        method: MessageMethod.Request,
        content: enabled
      };
      chrome.tabs.sendMessage(tabs[0].id, message);
    });
  });

  chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    const message: Message = {
      type: MessageType.IS_IVY,
      method: MessageMethod.Request,
    };
    try {
      chrome.tabs.sendMessage(
        tabs[0].id,
        message
      );
    } catch (e) {
      console.error('Plugin probably disabled or something');
    }
  });

  chrome.runtime.onMessage.addListener(
    function (request: Message<AngularInfo>) {
      if (request.type === MessageType.IS_IVY) {
        if (!request.content.isIvy) {
          enableSwitch.style.display = 'none';
          errorElem.innerText = `This page doesn't appear to be using IVY.`;
        } else {
          descrElem.innerText = `Found Angular on version ${request.content.version}`;
        }
      }
    }
  );
}

document.addEventListener('DOMContentLoaded', onDOMContentLoaded);
