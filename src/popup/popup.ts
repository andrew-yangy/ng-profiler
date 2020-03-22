import { Message, MessageMethod, MessageType } from "../communication/message.type";
import { AngularInfo } from "../core";

function onDOMContentLoaded() {
  const traceSwitcherCbx = document.getElementById('traceSwitcherCbx');
  const descrElem = document.getElementById('description');
  const errorElem = document.getElementById('error');
  const switcherElem = document.getElementById('switcher');

  chrome.storage.local.get('ngProfilerEnabled', ({ngProfilerEnabled}) => {
    (traceSwitcherCbx as HTMLInputElement).checked = !!ngProfilerEnabled;
    switcherElem.classList.add('loaded');
  });

  traceSwitcherCbx.addEventListener('change', e => {
    const enabled = (e.target as HTMLInputElement).checked;
    chrome.storage.local.set({ngProfilerEnabled: enabled});
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
      const message: Message<boolean> = {
        type: MessageType.TOGGLE_PROFILING,
        method: MessageMethod.Request,
        content: enabled
      };
      chrome.tabs.sendMessage(tabs[0].id, message);
    });
  });

  chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
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
