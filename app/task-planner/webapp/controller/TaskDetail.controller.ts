import Log from "sap/base/Log";
import FlexibleColumnLayout from "sap/f/FlexibleColumnLayout";
import { LayoutType } from "sap/f/library";
import Router from "sap/f/routing/Router";
import Button, { Button$PressEvent } from "sap/m/Button";
import ComboBox from "sap/m/ComboBox";
import Dialog from "sap/m/Dialog";
import { FeedInput$PostEvent } from "sap/m/FeedInput";
import { FeedListItemAction$PressEvent } from "sap/m/FeedListItemAction";
import Label from "sap/m/Label";
import MessageBox from "sap/m/MessageBox";
import MessageToast from "sap/m/MessageToast";
import TextArea, { TextArea$LiveChangeEvent } from "sap/m/TextArea";
import VBox from "sap/m/VBox";
import Item from "sap/ui/core/Item";
import ListItem from "sap/ui/core/ListItem";
import Controller from "sap/ui/core/mvc/Controller";
import { Route$PatternMatchedEvent } from "sap/ui/core/routing/Route";
import UIComponent from "sap/ui/core/UIComponent";
import { EdmType } from "sap/ui/export/library";
import Spreadsheet from "sap/ui/export/Spreadsheet";
import Context from "sap/ui/model/Context";
import JSONModel from "sap/ui/model/json/JSONModel";
import ODataModel from "sap/ui/model/odata/v2/ODataModel";
import { Tag, TaskTags } from "../model/types";
import List from "sap/m/List";

/**
 * @namespace task.planner.taskplanner.controller
 */
export default class TaskDetail extends Controller {
  private oRouter: Router;
  private taskId?: string;
  public onInit(): void | undefined {
    const oOwnerComponent = this.getOwnerComponent();

    this.oRouter = (oOwnerComponent as UIComponent).getRouter() as Router;

    if (this.oRouter) {
      this.oRouter
        ?.getRoute("RouteTaskPlannerDetail")
        ?.attachPatternMatched(this.onRouteMatched, this);
    }

    this.getView()?.setModel(
      new JSONModel({
        isFullScreen: false,
        isEditMode: false
      }),
      "UI"
    );

    this.getView()?.setModel(
      new JSONModel([
        {
          key: "delete",
          text: "Delete",
          icon: "sap-icon://delete",
        },
        {
          key: "share",
          text: "Share",
          icon: "sap-icon://share-2",
        },
        {
          key: "edit",
          text: "Edit",
          icon: "sap-icon://edit",
        },
      ]),
      "commentsActions"
    );
  }

  /**
   * Handler for the route matched event. It gets triggered when the route for the task detail view is matched.
   * This method retrieves the task ID from the route parameters and binds the view to the corresponding task.
   * If the task ID is present, it binds the view to the task's details
   * @param oEvent 
   */
  private onRouteMatched(oEvent: Route$PatternMatchedEvent): void {
    this.taskId = (oEvent.getParameter("arguments") as { taskId?: string }).taskId;
    if (this.taskId) {
      this.getView()?.bindElement({
        path: `/Tasks(${this.taskId})`,
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
    if (this.oRouter && this.oRouter.getRoute("RouteTaskPlanner")) {
      (this.getView()?.getModel("UI") as JSONModel)?.setProperty("/isFullScreen",false);
      this.oRouter.navTo("RouteTaskPlanner", {
        layout: LayoutType.OneColumn,
      }, true);
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
          Log.error("Error deleting task:", err);
        },
      });
    }
  }

  public handleFullScreen(oEvent: Button$PressEvent): void {
    if (this.oRouter) {
      (this.getView()?.getModel("UI") as JSONModel)?.setProperty("/isFullScreen",true);
      this.oRouter.navTo("RouteTaskPlannerDetail", {
        taskId: this.taskId,
        layout: LayoutType.MidColumnFullScreen,
      }, true);
    }
  }

  public handleExitFullScreen(oEvent: Button$PressEvent): void {
    if (this.oRouter) {
      (this.getView()?.getModel("UI") as JSONModel)?.setProperty("/isFullScreen",false);
      this.oRouter.navTo("RouteTaskPlannerDetail", {
        taskId: this.taskId,
        layout: LayoutType.TwoColumnsMidExpanded,
      }, true);
    }
  }

  public onPostComment(oEvent: FeedInput$PostEvent) {
    const commentValue = oEvent.getParameter("value");
    if (commentValue && commentValue.trim().length) {
      const oModel = this.getView()?.getModel() as ODataModel;
      const oContext = this.getView()?.getBindingContext();
      const path = oContext?.getPath();
      if (oModel && oContext && path) {
        const newComment = {
          comment: commentValue,
        };

        oModel.create(`${path}/comments`, newComment, {
          success: () => {
            MessageToast.show("Comment added successfully");
            oEvent.reset(); // Clear the input field
          },
          error: (err: Error) => {
            Log.error("Error adding comment:", err);
            MessageBox.error("Error adding comment: " + err.message);
          },
        });
      }
    }
  }

  /**
   * Handles the comment action press. 
   * This method processes actions like delete, share, and edit on comments.
   * @param oEvent The event object for the comment action press.
   */
  public onCommentActionPress(oEvent: FeedListItemAction$PressEvent): void {
    const actionKey = oEvent.getSource().getKey();

    switch (actionKey) {
      case "delete":
        const model = this.getView()?.getModel() as ODataModel;
        model.remove(
          (oEvent.getSource().getBindingContext() as any).getDeepPath(),
          {
            success: () => {
              MessageToast.show("Comment deleted successfully");
            },
            error: (err: Error) => {
              Log.error("Error deleting comment:", err);
              MessageBox.error("Error deleting comment: " + err.message);
            },
          }
        );
        break;
      case "share":
        const comment = oEvent
          .getSource()
          .getBindingContext()
          ?.getProperty("comment");
        const subject = encodeURIComponent("Comment about the tast");
        const body = encodeURIComponent(
          `Take a look at this comment:\n\n"${JSON.stringify(comment)}"`
        );
        window.open(`mailto:?subject=${subject}&body=${body}`, "_blank");

        break;
      case "edit":
        const begginButton = new Button({
          text: "Save",
          type: "Emphasized",
          press: () => {
            const newCommentValue = textArea.getValue();
            const oModel = this.getView()?.getModel() as ODataModel;
            const path = (
              oEvent.getSource().getBindingContext() as any
            ).getDeepPath();

            if (oModel && path) {
              oModel.update(
                path,
                { comment: newCommentValue },
                {
                  success: () => {
                    MessageToast.show("Comment updated successfully");
                    editCommentDlg.close();
                  },
                  error: (err: Error) => {
                    Log.error("Error updating comment:", err);
                    MessageBox.error("Error updating comment: " + err.message);
                  },
                }
              );
            }
          },
        });

        const textArea = new TextArea({
          width: "100%",
          value: (
            oEvent.getSource().getBindingContext() as Context
          ).getProperty("comment"),
          rows: 4,
          placeholder: "Edit your comment here...",
          liveChange: (textAreaLiveChangeEvent: TextArea$LiveChangeEvent) => {
            const value = textAreaLiveChangeEvent.getParameter("value");
            if (value?.trim().length === 0) {
              begginButton.setEnabled(false);
            } else {
              begginButton.setEnabled(true);
            }
          },
        });

        const editCommentDlg = new Dialog({
          title: "Edit Comment",
          resizable: true,
          draggable: true,
          state: "Information",
          type: "Message",
          content: [
            new VBox({
              width: "100%",
              items: [
                new Label({
                  text: "Edit your comment:",
                }),
                textArea,
              ],
            }),
          ],
          beginButton: begginButton,
          endButton: new Button({
            text: "Cancel",
            press: () => {
              editCommentDlg.close();
            },
          }),
          afterClose: () => {
            editCommentDlg.destroy();
          },
        });

        editCommentDlg.open();
        break;
      default:
        break;
    }
  }

  /**
   * Handles the export of task details.
   * This method creates a spreadsheet with task details and exports it.
   * @param oEvent The event object for the export button press.
   */
  public async onExportTask(oEvent: Button$PressEvent): Promise<void> {
    const oContext = this.getView()?.getBindingContext();
    const serviceUrl = (this.getView()?.getModel() as ODataModel).getServiceUrl();
    const oSheet = new Spreadsheet({
      fileName: "TaskDetails.xlsx",
      showProgress: true,
      dataSource: {
        type: "odata",
        dataUrl: serviceUrl + oContext?.getPath() || "",
        serviceUrl: serviceUrl,
        useBatch: true,
      },
      workbook: {
        columns: [
          {
            label: "ID",
            property: "ID",
            type: EdmType.String,
          },
          {
            label: "Title",
            property: "title",
            width: "25",
            type: EdmType.String,
          },
          {
            label: "Description",
            property: "description",
            width: "25",
            type: EdmType.String,
          },
          {
            label: "Type",
            property: "type_ID",
            type: EdmType.Number,
            width: "18",
          },
          {
            label: "Priority",
            property: "priority",
            type: EdmType.Number,
            width: "18",
          },
          {
            label: "Severity",
            property: "severity",
            type: EdmType.Number,
          },
          {
            label: "Due Date",
            property: "dueDate",
            type: EdmType.DateTime,
          },
        ],
      },
    });

    const data = await oSheet.build();
    if (data) {
      MessageToast.show("Spreadsheet export has finished");
      oSheet.destroy();
    }
  }

  /**
   * Handles the addition of a new tag.
   * @param oEvent The event object.
   */
  public onAddTag(oEvent: Button$PressEvent): void {
    const tagComboBox = new ComboBox({
      width: "100%",
      placeholder: "Enter tag name",
      items: {
        path: "/Tags",
        templateShareable: false,
        template: new ListItem({
          key: "{ID}",
          text: "{name}",
          additionalText: "{description}",
        }),
      },
      selectionChange: (oEvent) => {
        const selectedItem = oEvent.getParameter("selectedItem");
        if (selectedItem) {
          tagDialog.getBeginButton()?.setEnabled(true);
          tagComboBox.setValueState("None");
        } else {
          tagDialog.getBeginButton()?.setEnabled(false);
          tagComboBox.setValueState("Error");
        }
      },
    });

    const tagDialog = new Dialog({
      title: "Add Tag",
      resizable: true,
      draggable: true,
      state: "Information",
      type: "Message",
      busyIndicatorDelay: 0,
      content: [
        new VBox({
          width: "100%",
          items: [
            new Label({
              text: "Enter the tag name:",
            }),
            tagComboBox,
          ],
        }),
      ],

      beginButton: new Button({
        text: "Add",
        type: "Emphasized",
        enabled: false,
        press: async () => {
          tagDialog.setBusy(true);
          const tag = tagComboBox.getSelectedItem()?.getBindingContext()?.getObject() as Tag;

          await this.addTags([{
            ID: tag.ID,
            name: tag.name,
            descr: tag.descr
          }]);

          tagDialog.setBusy(false);
          tagDialog.close();
        },
      }),
      endButton: new Button({
        text: "Cancel",
        press: () => {
          tagDialog.close();
        },
      }),
      afterClose: () => {
        tagDialog.destroy();
      },
    });
    this.getView()?.addDependent(tagDialog);
    tagDialog.open();
  }

  private addTags(tags: Tag[]): Promise<void> {
    return new Promise((resolve, reject) => {
      const oModel = this.getView()?.getModel() as ODataModel;
      const task_ID = this.getView()?.getBindingContext()?.getProperty("ID");

      if (oModel) {
        oModel.setDeferredGroups(["tagGroup"]);
        tags.forEach((tag) => {
          const payload: TaskTags = {
            task_ID: task_ID,
            tag_ID: tag.ID,
          };
          oModel.create(`/TasksTags`, payload, {
            groupId: "tagGroup"
          });
        });

        oModel.submitChanges({
          groupId: "tagGroup",
          success: () => {
            MessageToast.show("Tags added successfully");
            oModel.refresh(true);
            resolve();
          },
          error: (err: Error) => {
            Log.error("Error adding tags:", err);
            MessageBox.error("Error adding tags: " + err.message);
            reject(err);
          },
        });
      } else {
        reject(new Error("ODataModel not found"));
      }
    });
  }

  public onDeleteTags(oEvent: Button$PressEvent): void {
    const oContext = this.getView()?.getBindingContext();
    
    if (oContext) {
      const oModel = oContext.getModel() as ODataModel;
      const tagsList = oEvent.getSource().getParent()?.getParent() as List;
      const selectedItems = tagsList.getSelectedItems();
      const taskTags = selectedItems.map(item => { 
        return { task_ID: item.getBindingContext()?.getProperty("task_ID"), tag_ID: item.getBindingContext()?.getProperty("tag_ID") };
      });

      if (taskTags && taskTags.length > 0) {
        oModel.setDeferredGroups(["tagGroup"]);
        taskTags.forEach(tag => {
          oModel.remove(`/TasksTags(task_ID=${tag.task_ID},tag_ID=${tag.tag_ID})`, {
            groupId: "tagGroup"
          });
        });

        oModel.submitChanges({
          groupId: "tagGroup",
          success: () => {
            MessageToast.show("Tags deleted successfully");
            oModel.refresh(true);
          },
          error: (err: Error) => {
            Log.error("Error deleting tags:", err);
            MessageBox.error("Error deleting tags: " + err.message);
          },
        });
      } else {
        MessageBox.warning("No tags selected for deletion.");
      }
    }
  }

  public onEditTask(oEvent: Button$PressEvent): void {
    const UIModel = this.getView()?.getModel("UI") as JSONModel;
    const isEditable = UIModel.getProperty("/isEditMode");
    UIModel.setProperty("/isEditMode", !isEditable);
  }

  public onCancelEdit(oEvent: Button$PressEvent): void {
    const UIModel = this.getView()?.getModel("UI") as JSONModel;
    UIModel.setProperty("/isEditMode", false);
  }

  public onSaveTask(oEvent: Button$PressEvent): void {
    const UIModel = this.getView()?.getModel("UI") as JSONModel;
    const isEditable = UIModel.getProperty("/isEditMode");
    if (isEditable) {
      const oContext = this.getView()?.getBindingContext();
      const oModel = oContext?.getModel() as ODataModel;
      if (oContext && oModel) {
        oModel.submitChanges({
          success: () => {
            MessageToast.show("Task updated successfully");
            UIModel.setProperty("/isEditMode", false);
            oModel.refresh(true);
          },
          error: (err: Error) => {
            Log.error("Error updating task:", err);
            MessageBox.error("Error updating task: " + err.message);
          },
        });
      }
    }
  }

  public onProgressTask(oEvent: Button$PressEvent): void {
    const oContext = this.getView()?.getBindingContext();
    const oModel = oContext?.getModel() as ODataModel;

    if (oContext && oModel) {
      const taskStatus = oContext.getProperty("status");
      const nextStatus = taskStatus?.nextStatus_ID;

      if (nextStatus) {
        oModel.setProperty(`${oContext.getPath()}/status_ID`, nextStatus, oContext);
        oModel.submitChanges({
          success: () => {
            MessageToast.show("Task status updated successfully");
            oModel.refresh(true);
          },
          error: (err: Error) => {
            Log.error("Error updating task status:", err);
            MessageBox.error("Error updating task status: " + err.message);
          },
        });
      } else {
        MessageBox.warning("No next status available for this task.");
      }
    }
  }
}
