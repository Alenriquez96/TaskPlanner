import cds from "@sap/cds";
import { Tasks } from "#cds-models/TaskService";

export class TaskService extends cds.ApplicationService {
  init() {
    this.before(["CREATE", "UPDATE"], Tasks, async (req) => {
      console.log("Before CREATE/UPDATE Tasks", req.data);
    });

    this.after("READ", Tasks, async (tasks, req) => {
      console.log("After READ Tasks", tasks);
    });

    return super.init();
  }
}
