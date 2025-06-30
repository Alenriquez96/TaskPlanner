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

  public priorityTextFormatter(priority: int): string {
    if (priority) {
      switch (priority) {
        case 1:
          return "Low";
        case 2:
          return "Medium";
        case 3:
          return "High";
        case 4:
          return "Critical";
        default:
          return "Unknown";
      }
    }
    return "Unknown";
  }

  public priorityFormatter(priority: int): ValueState {
    if (priority) {
      switch (priority) {
        case 1:
          return ValueState.Success; // Low
        case 2:
          return ValueState.Information; // Medium
        case 3:
          return ValueState.Warning; // High
        case 4:
          return ValueState.Error; // Critical
        default:
          return ValueState.None; // Default case
      }
    }
    return ValueState.None;
  }

  public statusTask(status: int | string): MessageType {
    if (status) {
      if (typeof status === "string") {
        status = parseInt(status, 10);
      }
      switch (status) {
        case 1:
          return MessageType.Information;
        case 2:
          return MessageType.Warning;
        case 3:
          return MessageType.Success;
        case 4:
          return MessageType.Error;
        case 5:
          return MessageType.Warning;
        case 6:
          return MessageType.Error;
        case 7:
          return MessageType.Information;
        default:
          return MessageType.None;
      }
    }
    return MessageType.None;
  }
}
