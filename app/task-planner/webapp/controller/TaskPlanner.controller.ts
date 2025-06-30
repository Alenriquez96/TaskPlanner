import GridList from "sap/f/GridList";
import GridListItem from "sap/f/GridListItem";
import MessageBox from "sap/m/MessageBox";
import MessageToast from "sap/m/MessageToast";
import { DropInfo$DropEvent } from "sap/ui/core/dnd/DropInfo";
import Controller from "sap/ui/core/mvc/Controller";
import ODataModel from "sap/ui/model/odata/v2/ODataModel";
import { ListItemBase$PressEvent } from "sap/m/ListItemBase";
import Router from "sap/f/routing/Router";
import FlexibleColumnLayout from "sap/f/FlexibleColumnLayout";

/**
 * @namespace task.planner.taskplanner.controller
 */
export default class TaskPlanner extends Controller {
  /*eslint-disable @typescript-eslint/no-empty-function*/
  public onInit(): void {}

  public onDrop(oEvent: DropInfo$DropEvent): void {
    const draggedItem = oEvent.getParameter("draggedControl") as GridListItem;
    const draggedItemContext = draggedItem.getBindingContext();
    if (!draggedItemContext) return;

    const oTargetGrid = oEvent.getSource().getParent() as GridList;

    // 👇 Obtener el status_ID según la columna destino
    let newStatusId: string;
    const targetGridStatus = oTargetGrid
      .getCustomData()
      .find((c) => c.getKey() === "status")
      ?.getValue();
    switch (targetGridStatus) {
      case "1":
        newStatusId = "1";
        break;
      case "2":
        newStatusId = "2";
        break;
      case "3":
        newStatusId = "3";
        break;
      default:
        return;
    }

    const oModel = draggedItemContext.getModel() as ODataModel;
    const sPath = draggedItemContext.getPath();

    oModel.setProperty(`${sPath}/status_ID`, newStatusId);

    oModel.submitChanges({
      success: () => MessageToast.show("Tarea progresada correctamente"),
      error: (err: Error) => MessageBox.error(err.message),
    });
    oModel.refresh(true);
  }

  /**
   * onTaskPress
   */
  public onTaskPress(oEvent: ListItemBase$PressEvent) {
    const router = (this.getOwnerComponent() as any)?.getRouter() as Router;
    const fcl = this.getView()
      ?.getParent()
      ?.getParent() as FlexibleColumnLayout;
    if (fcl && fcl.getLayout() === "OneColumn") {
      fcl.setLayout("TwoColumnsMidExpanded");
    }
    router.navTo("RouteTaskPlannerDetail", {
      taskId: oEvent.getSource().getBindingContext()?.getProperty("ID"),
    });
  }
}
