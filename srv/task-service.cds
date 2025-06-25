using { my } from '../db/schema.cds';

service TaskService {
    entity Tasks as projection on  my.taskPlanner.Tasks;
}