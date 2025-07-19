# Task Planner

## Overview

The Task Planner application is a Kanban tool designed to help users manage their tasks efficiently. It provides a user-friendly interface for creating, editing, and deleting tasks, as well as adding comments, exporting data and adding tags to each task.

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

## Contributing

Contributions are welcome! Please submit a pull request or open an issue for any enhancements or bug fixes.
