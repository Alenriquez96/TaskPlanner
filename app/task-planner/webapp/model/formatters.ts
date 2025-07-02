import { ValueState } from "sap/ui/core/library";
import MessageType from "sap/ui/core/message/MessageType";

export default {
  statusTask(status: int | string): MessageType {
    /**
    1,To Do,Tasks that are yet to be started
    2,In Progress,Tasks that are currently being worked on
    3,Done,Tasks that have been completed
    4,Blocked,Tasks that cannot proceed due to external dependencies
    5,On Hold,Tasks that are temporarily paused 
    6,Cancelled,Tasks that have been cancelled and will not be completed
    7,Review,Tasks that are awaiting review or approval
    */
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
  },
  priorityFormatter(priority: int | string): ValueState {
    if (priority) {
      if (typeof priority === "string") {
        priority = parseInt(priority, 10);
      }
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
  },
  priorityTextFormatter(priority: int | string): string {
    if (priority) {
      if (typeof priority === "string") {
        priority = parseInt(priority, 10);
      }
      switch (priority) {
        case 1:
          return "Low";
        case 2:
          return "Medium";
        case 3:
          return "High";
        case 4:
          return "Urgent";
        case 5:
          return "Critical";
        default:
          return "Unknown";
      }
    }
    return "Unknown";
  },
};
