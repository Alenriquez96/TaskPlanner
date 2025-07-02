using { my } from '../db/schema.cds';

service TaskService {
    entity Tasks as projection on  my.taskPlanner.Tasks;
    entity TaskTypes as projection on my.taskPlanner.TaskTypes;
}