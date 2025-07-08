import BaseComponent from "sap/ui/core/UIComponent";
import { createDeviceModel } from "./model/models";
import { Router$BeforeRouteMatchedEvent } from "sap/ui/core/routing/Router";
import JSONModel from "sap/ui/model/json/JSONModel";
import { LayoutType } from "sap/f/library";
import { layout } from "sap/ui/commons/library";

/**
 * @namespace task.planner.taskplanner
 */
export default class Component extends BaseComponent {

	public static metadata = {
		manifest: "json",
        interfaces: [
            "sap.ui.core.IAsyncContentCreation"
        ]
	};

	public init() : void {
		// call the base component's init function
		super.init();

        // set the device model
        this.setModel(createDeviceModel(), "device");

        const model = new JSONModel({
            layout: LayoutType.OneColumn
        });
		this.setModel(model, "layoutModel");

        // enable routing
        const router = this.getRouter()
        router.initialize();
        router.attachBeforeRouteMatched(this.onBeforeRouteMatched, this);   
	}

    private onBeforeRouteMatched(oEvent: Router$BeforeRouteMatchedEvent) : void {
        const model = this.getModel("layoutModel") as JSONModel;
        const layout = (oEvent.getParameter("arguments") as { layout?: LayoutType }).layout || LayoutType.OneColumn;
        if (model) {
            model.setProperty("/layout", layout);
        }
    }
}