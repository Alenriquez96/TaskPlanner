import Log from "sap/base/Log";
import FlexibleColumnLayout from "sap/f/FlexibleColumnLayout";
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
import Controller from "sap/ui/core/mvc/Controller";
import { Route$PatternMatchedEvent } from "sap/ui/core/routing/Route";
import UIComponent from "sap/ui/core/UIComponent";
import { EdmType } from "sap/ui/export/library";
import Spreadsheet from "sap/ui/export/Spreadsheet";
import Context from "sap/ui/model/Context";
import JSONModel from "sap/ui/model/json/JSONModel";
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

    this.getView()?.setModel(
      new JSONModel({
        isFullScreen: false,
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
          Log.error("Error deleting task:", err);
        },
      });
    }
  }

  public handleFullScreen(oEvent: Button$PressEvent): void {
    const fcl = this.getView()
      ?.getParent()
      ?.getParent() as FlexibleColumnLayout;
    if (fcl) {
      fcl.setLayout("MidColumnFullScreen");
      (this.getView()?.getModel("UI") as JSONModel)?.setProperty(
        "/isFullScreen",
        true
      );
    }
  }

  public handleExitFullScreen(oEvent: Button$PressEvent): void {
    const fcl = this.getView()
      ?.getParent()
      ?.getParent() as FlexibleColumnLayout;
    if (fcl) {
      fcl.setLayout("TwoColumnsMidExpanded");
      (this.getView()?.getModel("UI") as JSONModel)?.setProperty(
        "/isFullScreen",
        false
      );
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

  public async onExportTask(oEvent: Button$PressEvent): Promise<void> {
    const oContext = this.getView()?.getBindingContext();
    const serviceUrl = (
      this.getView()?.getModel() as ODataModel
    ).getServiceUrl();
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

  public onAddTag(oEvent: Button$PressEvent): void {
    const tagComboBox = new ComboBox({
      width: "100%",
      placeholder: "Enter tag name",
      items: {
        path: "/TasksTags",
        templateShareable: false,
        template: new Item({
          key: "{TasksTags/tag/name}",
          text: "{TasksTags/tag/name}",
        }),
      },
      selectionChange: (oEvent) => {
        const selectedItem = oEvent.getParameter("selectedItem");
        if (selectedItem) {
          tagComboBox.setValueState("None");
        } else {
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
        press: () => {
          const tagName = tagComboBox.getValue();
          const oModel = this.getView()?.getModel() as ODataModel;
          const oContext = this.getView()?.getBindingContext();
          const path = oContext?.getPath();

          if (oModel && oContext && path) {
            oModel.create(
              `${path}/tags`,
              { tag: { name: tagName } },
              {
                success: () => {
                  MessageToast.show("Tag added successfully");
                  tagDialog.close();
                },
                error: (err: Error) => {
                  Log.error("Error adding tag:", err);
                  MessageBox.error("Error adding tag: " + err.message);
                },
              }
            );
          }
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
    tagDialog.open();
  }
}
