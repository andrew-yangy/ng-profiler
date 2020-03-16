import { Message, MessageMethod, MessageType } from "../communication/message.type";
import { AngularInfo } from "../core";

function onDOMContentLoaded() {
  const traceSwitcherCbx = document.getElementById('traceSwitcherCbx');
  const descrElem = document.getElementById('description');
  const errorElem = document.getElementById('error');
  const switcherElem = document.getElementById('switcher');

  traceSwitcherCbx.addEventListener('change', e => {
    const enabled = (e.target as HTMLInputElement).checked;
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
      const message: Message<boolean> = {
        type: MessageType.TOGGLE_TRACING,
        method: MessageMethod.Response,
        content: enabled
      };
      chrome.tabs.sendMessage(tabs[0].id, message);
    });
  });

  const message: Message = {
    type: MessageType.IS_IVY
  };

  chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
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
          switcherElem.style.display = 'none';
          errorElem.innerText = `This page doesn't appear to be using IVY.`;
        } else {
          descrElem.innerText = `Found Angular on version ${request.content.version}`;
        }
      }
    }
  );
}

document.addEventListener('DOMContentLoaded', onDOMContentLoaded);