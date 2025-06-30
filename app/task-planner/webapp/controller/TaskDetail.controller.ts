import FlexibleColumnLayout from "sap/f/FlexibleColumnLayout";
import Router from "sap/f/routing/Router";
import { Button$PressEvent } from "sap/m/Button";
import MessageBox from "sap/m/MessageBox";
import MessageToast from "sap/m/MessageToast";
import Controller from "sap/ui/core/mvc/Controller";
import { Route$PatternMatchedEvent } from "sap/ui/core/routing/Route";
import UIComponent from "sap/ui/core/UIComponent";
import Context from "sap/ui/model/Context";
import ODataModel from "sap/ui/model/odata/v2/ODataModel";

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

  /**
   * Handler for the close button in the detail view.
   */
  public handleClose(): void {
    const fcl = this.getView()
      ?.getParent()
      ?.getParent() as FlexibleColumnLayout;
    if (fcl && fcl.getLayout() === "TwoColumnsMidExpanded") {
      fcl.setLayout("OneColumn");
    }

    if (this.oRouter && this.oRouter.getRoute("RouteTaskPlanner")) {
      this.oRouter.navTo("RouteTaskPlanner", {}, true);
    }
  }

  /**
   * Handler for the delete task button.
   * @param oEvent
   */
  public onDeleteTask(oEvent: Button$PressEvent): void {
    const oContext = this.getView()?.getBindingContext();
    if (oContext) {
      MessageBox.confirm("Are you sure you want to delete this task?", {
        title: "Confirm Delete",
        actions: ["Delete", "Cancel"],
        emphasizedAction: "Delete",
        initialFocus: "Cancel",
        onClose: (sAction: string) => {
          if (sAction === "Delete") {
            this.deleteTask(oContext?.getPath());
          }
        },
      });
    }
  }

  private deleteTask(path: string): void {
    const oModel = this.getView()?.getModel() as ODataModel;

    if (oModel) {
      this.getView()?.setBusy(true);
      oModel.remove(path, {
        success: () => {
          this.handleClose();
          this.getView()?.setBusy(false);
          MessageToast.show("Task deleted successfully");
        },
        error: (err: Error) => {
          this.getView()?.setBusy(false);
          MessageBox.error("Error deleting task: " + err.message);
          console.error("Error deleting task:", err);
        },
      });
    }
  }
}
