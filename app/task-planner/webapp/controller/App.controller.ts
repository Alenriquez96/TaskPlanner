
import { FlexibleColumnLayout$StateChangeEvent } from "sap/f/FlexibleColumnLayout";
import Component from "sap/ui/core/Component";
import Controller from "sap/ui/core/mvc/Controller";
import Router, { Router$RouteMatchedEvent } from "sap/ui/core/routing/Router";
import UIComponent from "sap/ui/core/UIComponent";
import JSONModel from "sap/ui/model/json/JSONModel";

/**
 * @namespace task.planner.taskplanner.controller
 */
export default class App extends Controller {
  private oOwnerComponent?: Component
  private oRouter?: Router;
  private currentRouteName?: string;
  private currentProduct: string ;
  /*eslint-disable @typescript-eslint/no-empty-function*/
  public onInit(): void {
      this.getView()?.setModel(
        new JSONModel([
          {
            key: "1",
            title: "Low",
            icon: "sap-icon://task",
          },
          {
            key: "2",
            title: "Medium",
            icon: "sap-icon://process",
          },
          {
            key: "3",
            title: "High",
            icon: "sap-icon://complete",
          },
          {
            key: "4",
            title: "Urgent",
            icon: "sap-icon://stop",
          },
          {
            key: "5",
            title: "Critical",
            icon: "sap-icon://pause",
          },
        ]),
        "priorityModel"
      );

      this.getView()?.setModel(
        new JSONModel([
          {
            key: "1",
            title: "Low",
            icon: "sap-icon://task",
          },
          {
            key: "2",
            title: "Medium",
            icon: "sap-icon://process",
          },
          {
            key: "3",
            title: "High",
            icon: "sap-icon://complete",
          },
          {
            key: "4",
            title: "Urgent",
            icon: "sap-icon://stop",
          },
          {
            key: "5",
            title: "Critical",
            icon: "sap-icon://pause",
          },
        ]),
        "severityModel"
      );

      this.oOwnerComponent = this.getOwnerComponent();
      this.oRouter = (this.oOwnerComponent as UIComponent).getRouter();
      if (this.oRouter) {
        this.oRouter.attachRouteMatched(this.onRouteMatched, this);
      }
  }

  private onRouteMatched(oEvent: Router$RouteMatchedEvent): void {
      let routeName = oEvent.getParameter("name");
      let oArguments  = oEvent.getParameter("arguments") as { taskId: string };

      // Save the current route name
      this.currentRouteName = routeName;
      this.currentProduct = oArguments.taskId;
  }

  public onStateChanged(oEvent: FlexibleColumnLayout$StateChangeEvent): void {
      const isNavigationArrow = oEvent.getParameter("isNavigationArrow");
      const layout = oEvent.getParameter("layout");

      // Replace the URL with the new layout if a navigation arrow was used
      if (isNavigationArrow && this.oRouter && this.currentRouteName) {
        this.oRouter.navTo(this.currentRouteName, {layout: layout, product: this.currentProduct}, true);
      }
  }

  public onExit(): void {
      if (this.oRouter) {
        this.oRouter.detachRouteMatched(this.onRouteMatched, this);
      }
  }
}
