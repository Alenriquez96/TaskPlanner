namespace my.taskPlanner;
using { cuid, managed } from '@sap/cds/common';

entity Tasks: cuid, managed {
    title  : String;
    description : String(1000);
    status: Association to one TaskStatuses;
    dueDate: DateTime;
    priority: Integer @cds.validation.range : [1, 5]; // 1 to 5 scale
    severity: Integer @cds.validation.range : [1, 5]; // 1 to 5 scale
    tags: Association to many TasksTags on tags.task.ID = $self.ID;
    type: Association to one TaskTypes;
}

entity TaskStatuses {
    key ID : Integer;
    name  : String(255);
    descr : String(1000);
}

entity Tags: cuid, managed {
    name  : String(255);
    descr : String(1000);
    tasks: Association to many TasksTags on tasks.tag.ID = $self.ID;
}

entity TasksTags {
    key task : Association to Tasks;
    key tag  : Association to Tags;
}

entity TaskTypes {
    key ID : Integer;
    name  : String(255);
    descr : String(1000);
}