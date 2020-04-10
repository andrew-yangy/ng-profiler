import { CHILD_HEAD, CONTEXT, FLAGS, HOST, LView, LViewFlags, NEXT, PARENT, TVIEW } from "../angular/interfaces/view";
import { RenderFlags } from "../angular/interfaces/definition";
import { scheduleOutsideOfZone } from "./zone";
import { CanvasFactory } from "./canvas";
import { ACTIVE_INDEX, ActiveIndexFlag, CONTAINER_HEADER_OFFSET, LContainer } from "../angular/interfaces/container";
import { isLContainer } from "../angular/interfaces/type_checks";
import { getComponentLViewByIndex } from "../angular/util/view_utils";
import { createMessage } from "../../communication/messager";
import { MessageMethod, MessageType } from "../../communication/message.type";
import { generate } from 'shortid';
import { NG_PROFILER_ID } from "../constants";

export interface TreeViewItem {
  lView: LView;
  children: TreeViewItem[];
  parent?: TreeViewItem;
}

export interface SerializedTreeViewItem {
  id: string;
  name: string;
  tagName: string;
  children: SerializedTreeViewItem[];
  parent: string;
  onPush: boolean;
  context: any;
}

class TreeView {
  serialisedTreeView: SerializedTreeViewItem;
  rectMap = new Map();
  setView = (treeView: TreeViewItem) => {
    this.serialisedTreeView = this.serialiseTreeViewItem(treeView.children[0]);
    postMessage(createMessage(MessageType.COMPONENT_TREE, MessageMethod.Response, this.serialisedTreeView), '*');
    console.log(this.serialisedTreeView);
  };

  serialiseTreeViewItem(
    treeViewItem: TreeViewItem
  ): SerializedTreeViewItem {
    if (!treeViewItem) return ;
    return {
      id: treeViewItem.lView[HOST][NG_PROFILER_ID],
      name: this.getComponentName(treeViewItem.lView),
      tagName: treeViewItem.lView && treeViewItem.lView[HOST]?.localName,
      children: treeViewItem.children && treeViewItem.children.map(loopTreeViewItem =>
        this.serialiseTreeViewItem(loopTreeViewItem)
      ),
      parent: this.getComponentName(treeViewItem.lView[PARENT]),
      context: this.getContextState(treeViewItem.lView[CONTEXT]),
      onPush: treeViewItem.lView && (treeViewItem.lView[FLAGS] & LViewFlags.CheckAlways) === 0
    };
  }

  getComponentName = (lView: LView | LContainer) => {
    return lView[CONTEXT].constructor.name.length > 1 ? lView[CONTEXT].constructor.name : lView[HOST] && lView[HOST]['localName'];
  };

  getContextState = (context) => {
    return Object.keys(context).reduce((acc, key) => {
      if (typeof context[key] !== 'object'
        // TODO: handle object
        // || context[key] && Object.getPrototypeOf(context[key]).isPrototypeOf(Object)
      ) {
        acc[key] = context[key];
      }
      return acc;
    }, {});
  };

  attachChildComponents = (hostLView: LView, components: number[], addChildElement: (children: TreeViewItem[] | TreeViewItem) => void) => {
    const children = [];
    const addElement = (treeViewItem) => {
      children.push(treeViewItem);
    };

    for (let i = 0; i < components.length; i++) {
      const componentView = getComponentLViewByIndex(components[i], hostLView);
      this.attachComponent(componentView, addElement);
    }
    addChildElement(children);
  };

  attachComponent = (componentView: LView, addElement: (treeView: TreeViewItem) => void) => {
    const componentTView = componentView[TVIEW];
    const treeView = {
      lView: componentView,
      children: []
    };
    const addChildElement = (childElements: TreeViewItem[]) => {
      treeView.children = treeView.children.concat(...childElements);;
    };
    this.attachTemplate(componentView);
    const childComponents = componentTView.components;
    if (childComponents !== null) {
      this.attachChildComponents(componentView, childComponents, addChildElement);
    }
    this.attachDynamicEmbeddedViews(componentView, addChildElement);
    addElement(treeView);
  };

  /**
   * Goes over dynamic embedded views (ones created through ViewContainerRef APIs) and refreshes
   * them by executing an associated template function.
   */
  attachDynamicEmbeddedViews = (lView: LView, addChildElement) => {
    let children = [];
    let viewOrContainer = lView[CHILD_HEAD];
    while (viewOrContainer !== null) {
      // Note: viewOrContainer can be an LView or an LContainer instance, but here we are only
      // interested in LContainer
      let activeIndexFlag: ActiveIndexFlag;
      if (isLContainer(viewOrContainer) &&
        (activeIndexFlag = viewOrContainer[ACTIVE_INDEX]) >> ActiveIndexFlag.SHIFT ===
        ActiveIndexFlag.DYNAMIC_EMBEDDED_VIEWS_ONLY) {

        for (let i = CONTAINER_HEADER_OFFSET; i < viewOrContainer.length; i++) {
          const embeddedLView = viewOrContainer[i] as LView;
          const embeddedTView = embeddedLView[TVIEW];

          embeddedTView.components && this.attachComponent(embeddedLView, (element) => {
            children = [...children, ...element.children]
          });
        }
        if ((activeIndexFlag & ActiveIndexFlag.HAS_TRANSPLANTED_VIEWS) !== 0) {
          // We should only CD moved views if the component where they were inserted does not match
          // the component where they were declared and insertion is on-push. Moved views also
          // contains intra component moves, or check-always which need to be skipped.
          // refreshTransplantedViews(viewOrContainer, lView[DECLARATION_COMPONENT_VIEW] !);
        }
      }
      viewOrContainer = viewOrContainer[NEXT];
    }
    addChildElement(children);
  };

  private attachTemplate = (lView: LView) => {
    const tView = lView[TVIEW];
    if (lView[HOST] && !lView[HOST][NG_PROFILER_ID]) {
      lView[HOST][NG_PROFILER_ID] = generate();
    }
    const originTemplate = tView.template;
    if (!originTemplate) return ;
    const uuid = lView[HOST] && lView[HOST][NG_PROFILER_ID];
    tView.template = (...args) => {
      originTemplate(...args);
      if (args[0] === RenderFlags.Update && lView[HOST]) {
        scheduleOutsideOfZone(() => {
          if (!this.rectMap.has(uuid)) {
            this.rectMap.set(uuid, lView[HOST].getBoundingClientRect());
          }
          CanvasFactory.draw(uuid, this.rectMap.get(uuid));
          postMessage(createMessage(MessageType.UPDATE_TREE, MessageMethod.Response, uuid), '*');
        })
      }
    }
  };
}
export const TreeViewFactory = new TreeView();