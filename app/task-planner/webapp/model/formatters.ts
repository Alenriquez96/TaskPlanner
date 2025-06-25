import MessageType from "sap/ui/core/message/MessageType";

export default {
  statusTask: function (status: string): string | undefined {
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
      switch (status) {
        case "1":
          return MessageType.None;
        case "2":
          return MessageType.Information;
        case "3":
          return MessageType.Success;
        case "4":
          return MessageType.Error;
        case "5":
          return MessageType.Warning;
        case "6":
          return MessageType.Error;
        case "7":
          return MessageType.Information;
        default:
          return MessageType.None;
      }
    }
    return MessageType.None;
  },
};
