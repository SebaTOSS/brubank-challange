# NestJS Application for Telephone Invoice Generation for BruBank

This project is a NestJS application designed to handle the uploading of CSV files and the generation of telephone invoices. It includes a controller for processing incoming requests and a service for handling business logic related to invoice generation.

## Project Structure

- **src/**
  - **app.controller.ts**: Handles incoming requests and delegates them to the appropriate service.
  - **app.module.ts**: The root module of the application, importing necessary modules and controllers.
  - **app.service.ts**: Contains business logic and can be injected into controllers.
  - **controllers/**
    - **invoice.controller.ts**: Manages CSV file uploads and invoice generation.
  - **services/**
    - **invoice.service.ts**: Processes CSV data and generates invoices.
  - **types/**
    - **index.ts**: Defines the structure of data used in the application.

## Features

- Upload CSV files containing telephone data.
- Generate invoices based on the uploaded data.
- Modular architecture with clear separation of concerns.

## Installation

1. Clone the repository:

```
git clone <repository-url>
```

2. Install dependencies:
   ```
   npm install
   ```

## Usage

To start the application, run:
```
npm run start
```

The application will be available at `http://localhost:3000`.

## API Endpoints

- **POST /invoice/upload**: Upload a CSV file for processing.
- **POST /invoice/generate**: Generate an invoice based on the provided payload.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License

This project is licensed under the MIT License.