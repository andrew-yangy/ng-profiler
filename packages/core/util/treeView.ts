import {
  CHILD_HEAD,
  CONTEXT,
  FLAGS,
  HOST,
  LView,
  LViewFlags,
  NEXT,
  PARENT,
  RENDERER_FACTORY,
  TVIEW
} from "../angular/interfaces/view";
import { RenderFlags } from "../angular/interfaces/definition";
import { scheduleOutsideOfZone } from "./zone";
import { CanvasFactory } from "./canvas";
import { ACTIVE_INDEX, ActiveIndexFlag, CONTAINER_HEADER_OFFSET, LContainer } from "../angular/interfaces/container";
import { isLContainer } from "../angular/interfaces/type_checks";
import { getComponentLViewByIndex } from "../angular/util/view_utils";
import { createMessage } from "../../communication/messager";
import { MessageMethod, MessageType } from "../../communication/message.type";
import { generate } from "shortid";
import { NG_PROFILER_ID } from "../constants";
import { findLView } from "../angular/render3/context_discovery";

declare const ng;

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
  treeLViewMap = new Map<string, LView>();
  enabled: boolean;
  private _highlightView: boolean;
  private _highlightTree: boolean;
  private _bodyLView: LView;

  get highlightView() {
    return this._highlightView;
  }

  set highlightView(status: boolean) {
    this._highlightView = status;
  }

  get highlightTree() {
    return this._highlightTree;
  }

  set highlightTree(status: boolean) {
    this._highlightTree = status;
  }

  get bodyLView() {
    if (!this._bodyLView) {
      this.bodyLView = findLView(document.body);
    }
    return this._bodyLView;
  };

  set bodyLView(view: LView) {
    this._bodyLView = view;
  }

  enable = () => this.enabled = true;
  disable = () => this.enabled = false;

  setView = (treeView: TreeViewItem) => {
    this.serialisedTreeView = this.serialiseTreeViewItem(treeView.children[0]);
    console.log(treeView, this.serialisedTreeView);
  };

  serialiseTreeViewItem(
    treeViewItem: TreeViewItem
  ): SerializedTreeViewItem {
    if (!treeViewItem) return ;
    return {
      id: treeViewItem.lView[HOST][NG_PROFILER_ID],
      name: this.getComponentName(treeViewItem.lView),
      tagName: treeViewItem.lView && treeViewItem.lView[HOST]!?.localName,
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
      if (typeof context[key] !== 'object' && typeof context[key] !== 'function'
        // TODO: handle object
        // || context[key] && Object.getPrototypeOf(context[key]).isPrototypeOf(Object)
      ) {
        acc[key] = context[key];
      }
      return acc;
    }, {});
  };

  applyChanges = (data: SerializedTreeViewItem) => {
    const lView = this.treeLViewMap.get(data.id);
    Object.keys(data.context).forEach(key => {
      lView[CONTEXT][key] = data.context[key];
    });
    ng.applyChanges(lView[CONTEXT]);
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
          const embeddedTView = embeddedLView?.[TVIEW];

          embeddedTView?.components && this.attachComponent(embeddedLView, (element) => {
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
    let uuid;
    if (lView[HOST] && !lView[HOST][NG_PROFILER_ID]) {
      uuid = generate();
      lView[HOST][NG_PROFILER_ID] = uuid;
      this.treeLViewMap.set(uuid, lView);
      this.profilingTemplate(lView, (start, end) => {
        console.log(lView, start, end, end - start);
      });
    }

    const originTemplate = tView.template;
    if (!originTemplate) return ;

    tView.template = (...args) => {
      originTemplate(args[0], args[1]);
      if (!this.enabled) return ;
      if (args[0] === RenderFlags.Update && lView[HOST]) {
        scheduleOutsideOfZone(() => {
          try {
            this.highlightView && CanvasFactory.draw(uuid, this.treeLViewMap.get(uuid)[HOST]!?.getBoundingClientRect());
            this.highlightTree && postMessage(createMessage(MessageType.UPDATE_TREE, MessageMethod.Response, uuid), '*');
          } catch (e) {
            console.log(e);
          }
        })
      }
    }
  };

  private profilingTemplate(componentView: LView, record: (start: number, end: number) => void) {
    const renderer = componentView[RENDERER_FACTORY];
    const oriBegin = renderer.begin;
    const oriEnd = renderer.end;

    let start, end;
    renderer.begin = function() {
      oriBegin.apply(this);
      start = performance.now();
    };
    renderer.end = function () {
      oriEnd.apply(this);
      end = performance.now();
      record(start, end);
    };
  }
}
export const TreeViewFactory = new TreeView();