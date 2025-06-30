import FlexibleColumnLayout from "sap/f/FlexibleColumnLayout";
import Router from "sap/f/routing/Router";
import { Button$PressEvent } from "sap/m/Button";
import { MessageType, ValueState } from "sap/ui/core/library";
import Controller from "sap/ui/core/mvc/Controller";
import { Route$PatternMatchedEvent } from "sap/ui/core/routing/Route";
import UIComponent from "sap/ui/core/UIComponent";

/**
 * @namespace task.planner.taskplanner.controller
 */
export default class TaskDetail extends Controller {
  private oRouter: Router;
  public onInit(): void | undefined {
    const oOwnerComponent = this.getOwnerComponent();

    this.oRouter = (oOwnerComponent as UIComponent).getRouter() as Router;

    if (this.oRouter) {
      this.oRouter
        ?.getRoute("RouteTaskPlannerDetail")
        ?.attachPatternMatched(this.onRouteMatched, this);
    }
  }

  private onRouteMatched(oEvent: Route$PatternMatchedEvent): void {
    const taskID = (oEvent.getParameter("arguments") as { taskId?: string })
      .taskId;
    if (taskID) {
      this.getView()?.bindElement({
        path: `/Tasks(${taskID})`,
        parameters: {
          expand: "status,type,tags($expand=tag)",
        },
      });
    }
  }

  public handleClose(oEvent: Button$PressEvent): void {
    const fcl = this.getView()
      ?.getParent()
      ?.getParent() as FlexibleColumnLayout;
    if (fcl && fcl.getLayout() === "TwoColumnsMidExpanded") {
      fcl.setLayout("OneColumn");
    }
  }
}
