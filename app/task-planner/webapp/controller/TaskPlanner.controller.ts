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
import { Button$PressEvent } from "sap/m/Button";
import Fragment from "sap/ui/core/Fragment";
import Dialog, { Dialog$AfterCloseEvent } from "sap/m/Dialog";
import JSONModel from "sap/ui/model/json/JSONModel";
import { ValueState } from "sap/ui/core/library";
import Log from "sap/base/Log";
import { LayoutType } from "sap/f/library";

interface TaskData {
  title: string;
  description: string | null;
  dueDate: string | null;
  priority: string;
  status_ID: string;
  type_ID?: string;
}

/**
 * @namespace task.planner.taskplanner.controller
 */
export default class TaskPlanner extends Controller {
  private newTaskDialog: Dialog | null = null;
  public onInit(): void {
    this.getView()?.setModel(
      new JSONModel({
        title: {
          value: null,
          required: true,
          valueState: ValueState.None,
        },
        description: {
          value: null,
          required: false,
          valueState: ValueState.None,
        },
        dueDate: {
          value: null,
          required: true,
          valueState: ValueState.None,
        },
        priority: {
          value: "1", // Default to Low priority
          required: false,
          valueState: ValueState.None,
        },
        severity: {
          value: "1", // Default to Low severity
          required: false,
          valueState: ValueState.None,
        },
        type: {
          value: null,
          required: true,
          valueState: ValueState.None,
        },
      }),
      "newTask"
    );
  }

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
      layout: LayoutType.TwoColumnsMidExpanded
    });
  }

  public async onNewTask(oEvent: Button$PressEvent): Promise<void> {
    if (!this.newTaskDialog) {
      this.newTaskDialog = (await Fragment.load({
        name: "task.planner.taskplanner.view.fragments.NewTask",
        controller: this,
        type: "XML",
      })) as Dialog;

      this.getView()?.addDependent(this.newTaskDialog);
    }
    this.newTaskDialog.open();
  }

  public onCreateTaskPress(oEvent: Button$PressEvent): void {
    const newTaskModel = this.getView()?.getModel("newTask") as JSONModel;
    const newTaskData = newTaskModel.getData();
    const oModel = this.getView()?.getModel() as ODataModel;
    const taskData: TaskData = {
      title: newTaskData.title.value,
      description: newTaskData.description.value,
      dueDate: newTaskData.dueDate.value,
      priority: newTaskData.priority.value,
      type_ID: newTaskData.type.value,
      status_ID: "1", // Default to "To Do" status
    };

    if (!this.validateNewTaskData(taskData)) {
      MessageBox.error("Por favor, completa los campos obligatorios.");
      return;
    }

    oModel.create("/Tasks", taskData, {
      success: (data: { results: [] }) => {
        MessageToast.show("Tarea creada correctamente");

        if (this.newTaskDialog) {
          this.newTaskDialog.close();
        }
      },
      error: (err: Error) => {
        if (this.newTaskDialog) {
          this.newTaskDialog.close();
        }
        Log.error("Error creating task", err);
        MessageBox.error(err.message);
      },
    });
  }

  /**
   * Validates the new task data before creating a new task.
   * @param newTaskData {TaskData} - The data of the new task to validate.
   * @returns {boolean} - Returns true if the data is valid, false otherwise.
   */
  private validateNewTaskData(newTaskData: TaskData): boolean {
    const newTaskModel = this.getView()?.getModel("newTask") as JSONModel;

    let isValid = true;
    if (!newTaskData.title) {
      newTaskModel.setProperty("/title/valueState", ValueState.Error);
      isValid = false;
    } else {
      newTaskModel.setProperty("/title/valueState", ValueState.None);
    }

    if (newTaskData.dueDate) {
      newTaskModel.setProperty("/dueDate/valueState", ValueState.None);
    } else {
      newTaskModel.setProperty("/dueDate/valueState", ValueState.None);
    }
    return isValid;
  }

  public onCancelPress(oEvent: Button$PressEvent): void {
    if (this.newTaskDialog) {
      this.newTaskDialog.close();
    }
  }

  public onAfterClose(oEvent: Dialog$AfterCloseEvent): void {
    if (this.newTaskDialog) {
      const newTaskModel = this.getView()?.getModel("newTask") as JSONModel;
      newTaskModel.setData({
        title: { value: "", required: true, valueState: ValueState.None },
        description: {
          value: "",
          required: false,
          valueState: ValueState.None,
        },
        dueDate: {
          value: null,
          required: false,
          valueState: ValueState.None,
        },
        priority: { value: "1", required: true, valueState: ValueState.None },
        type: { value: null, required: true, valueState: ValueState.None },
      });
      this.newTaskDialog.destroy();
      this.newTaskDialog = null;
    }
  }
}
