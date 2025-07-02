import Controller from "sap/ui/core/mvc/Controller";
import JSONModel from "sap/ui/model/json/JSONModel";

/**
 * @namespace task.planner.taskplanner.controller
 */
export default class App extends Controller {
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
  }
}
