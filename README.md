# Task Planner

## Overview


The Task Planner application is a Kanban tool designed to help users manage their tasks efficiently. It provides a user-friendly interface for creating, editing, and deleting tasks, allowing users to drag and drop tasks between different columns to progress their status, as well as adding comments, exporting data and adding tags to each task.

This application is built using the SAPUI5 framework and follows the SAP Cloud Application Programming (CAP) model. It leverages OData V2 and V4 services for data management and uses Core Data Services (CDS) for defining the data model.

The application is developed in TypeScript and runs on a Node.js backend, ensuring a modern and robust development experience.

## Screenshots
### Task Planner Kanban Board
![Task Planner](./assets/captura_home.png)
### Task Detail Page
![Task Detail](./assets/captura_detail.png)
### Task Detail Edit
![Task Detail Edit](./assets/captura_detail_edit.png)
### Task Creation
![Task Creation](./assets/captura_create.png)

## Features

- **Task Management**: Create, edit, and delete tasks.
- **Comments**: Add comments to tasks for better collaboration.
- **Tags**: Organize tasks using tags.
- **Responsive Design**: Works on various devices and screen sizes.

## Technologies Used

- **SAPUI5**: The application is built using the SAPUI5 framework.
- **SAP CAP**: The application is built using the SAP Cloud Application Programming (CAP) model.
- **Typescript**: The application is built using Typescript.
- **OData**: Data is managed using OData V2 and V4 services.
- **CDS**: Core Data Services for defining the data model.
- **Node.js**: The backend is powered by Node.js.

## Folder Structure

```
/app
  ├── /webapp
  │   ├── /controller
  │   ├── /model
  │   ├── /view
  │   └── index.html
  ├── /db
  │   └── data.cds
  ├── /srv
  │   ├── service.cds
  │   └── service.ts
  ├── package.json
  └── tsconfig.json
```

## Getting Started

1. Clone the repository.

   ```bash
   git clone <repository-url>
   ```

2. Install the necessary dependencies using npm or yarn.
   ```bash
   npm install
   ```
   or
   ```bash
   yarn install
   ```
3. Ensure you have the @sap/cds dependency installed.
4. Ensure you have the node.js installed.
   You can download it from [Node.js official website](https://nodejs.org/).
5. Start the application:
   ```bash
   cds-ts watch
   ```
6. Open your browser and navigate to `http://localhost:8080` to view the application.

## Data Model
![Task Planner](./assets/captura_datamodel.png)
The data model is defined using Core Data Services (CDS) and includes the following entities:
- **Tasks**: Represents a task with properties like ID, title, description, status, priority, and tags.
- **Comments**: Represents a comment associated with a task.
- **Tags**: Represents a tag that can be associated with tasks for better organization. 
- **TaskTags**: Represents the many-to-many relationship between tasks and tags.
- **TaskStatuses**: Represents the different statuses a task can have, such as "To Do", "In Progress", and "Done".
- **TaskTypes**: Represents the different types of tasks, such as "Feature", "Bug", and "Improvement".


## Usage
- **Creating a Task**: Click on the "New Task" button to open the task creation dialog. Fill in the details and save.
- **Editing a Task**: Click on a task to open the detail view. From there, you can edit the task details, add comments, and manage tags.
- **Deleting a Task**: In the task detail view, click on the delete button to remove the task.
- **Change Task Status**: You can change the status of a task by dragging it to a different column or by using the "Progress Status" button in the task detail view.
- **Adding Comments**: In the task detail view, you can add comments to the task for better collaboration.
- **Adding Tags**: In the task detail view, you can add tags to the task for better organization. Use the tag multi input field to enter new tags or select existing ones. Tags can be used to categorize tasks and make them easier to find.
- **Exporting Data**: Use the export button to download the task data in CSV format.
- **Drag and Drop**: You can drag and drop tasks between different columns in the Kanban board page to change their status.
- **Responsive Design**: The application is designed to work on various devices and screen sizes. You can use it on desktops, tablets, and smartphones.


## Contributing

Contributions are welcome! Please submit a pull request or open an issue for any enhancements or bug fixes.

## License
Application developed by @Alenriquez96