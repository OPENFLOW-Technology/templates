# NodeJS Rest API

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
  - [Installation](#installation)
  - [Configuration](#configuration)
- [Project Structure](#project-structure)
- [Usage](#usage)
- [Testing](#testing)

## Introduction

This template holds an MVP REST api implementation for a NODE js application. It have a basic barer authentication, sms, well organized project structure.

## Features

- User registration
- Role management
- Permission
- Send SMS

## Prerequisites

Before getting started, ensure that the following software and tools are installed:

- Node.js and npm
- A database system (PostgreSQL/Mysql)

## Getting Started

Follow these steps to set up and run the software.

### Installation


#### Configuration
Configure your project by setting the required environment variables. Refer to the .env file for details.

## Project Structure
The project is organized as follows:

    src/: Contains the source code, including controllers, routes, and middleware.
        controllers/: Controllers for handling various API endpoints.
        entities/: Database entity definitions using an ORM or a similar framework (e.g., TypeORM).
        middleware/: Custom middleware functions like authentication and authorization.
        routes/: Route definitions that connect endpoints to controllers.
        utils/: Utility functions that can be reused across the application.
        index.ts: The main entry point for the application.
    dist: Contains compiled javascript implementation of the Typescript code.
    config/: Configuration files for the application.
    uploads/: Storage for property-related documents.
    .env: Environment variables.

## Usage
To use the software, follow the API documentation provided. This documentation includes information on available endpoints and payload structures.

## Testing
To run tests, execute the following command:

``` shell npm test ``` 
