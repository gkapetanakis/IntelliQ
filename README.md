# IntelliQ
IntelliQ is a web application for questionnaire creation and answering, featuring a RESTful API. It was created as part of the Software Engineering class of the School of [School of Electrical and Computer Engineering](https://www.ece.ntua.gr/en) of the [National Technical University of Athens](https://ntua.gr/en/) during the academic year 2022-2023.

#### Contributors
* `ntua-el19005` - Dimitris Georgousis
* `ntua-el19062` - George Kapetanakis (me)

#### Grade
The project was graded with a 10 out of 10.

## Jump to a Section
* [Repository Contents](#repository-contents)
* [Setup Guide](#setup-guide)
* [Testing Guide](#testing-guide)

## Repository Contents
The repo consists of the following parts:
* The IntelliQ REST API definition and documentation. The definition is a YAML file which conforms to OpenAPI 3.1, while the documentation is a Postman file automatically generated from the definition.
* A back-end service which implements the API written in JavaScript using Node.js and Express. It uses Mongoose to interact with a MongoDB database.
* A front-end service written in JavaScript using Vite and Svelte. It interacts with the back-end service using the JavaScript fetch API.
* The entire project's documentation, which is a docx document generated from Visual Paradigm. The Visual Paradigm project's source files are also included.
* A Postman test collection for the API. It contains tests for all endpoints and is meant to be ran as a collection.
* The `handouts` folder contains the assignment description in both English and Greek.

## Setup Guide

### Software Requirements
* Git
* MongoDB
* Node.js

### Installation Instructions
* Clone repository wherever you want (e.g. `./`).
#### Back-end service
1. Start the MongoDB service if it isn't already running.
2. Navigate to `./backend`.
3. Run `npm install`.
4. The app needs some environment variables to function properly.
   * If the app is run in a __development__ environment, these variables are loaded from a `.env` file which must contain the variables present in the `.env_sample` file found inside `./backend`. The variables can also be created manually.
   * If the app is run in a __production__ environment, the variables contained in `.env_sample` must be created(`export VARIABLE=value` in Unix for example) manually. To run in a production environment you must also create the variable `NODE_ENV=production`.
   * __Note:__ To switch back to a development environment from production, unset `NODE_ENV` or set it equal to `development`.
4. Start the app using `npm run dev` (__development__ environment, uses `nodemon`) or `node app.mjs` (__production__ environment).
3. Application can now be accessed on `http::/APP_HOST:APP_PORT/APP_BASE_URL`.
#### Front-end service _(requires back-end to be running to function properly)_
1. Navigate to `./frontend`.
2. Run `npm install`.
3. The app needs some environment variables to function properly.
   * If the app is run in a __development__ environment, these variables are loaded from a `.env.development` file which must contain the variables present in the `.env_sample` file found insinde `./frontend`.
   * If the app is run in a __production__ environment, these variables are loaded from a `.env.production` file which must contain the variables present in the `.env_sample` file.
   * __Note:__ In both cases the variables can also be created manually.
4. Start the app using `npm run dev` (__development__ environment) or execute `npm run build` and then run the app using `npm run preview` (__production__ environment).
   * __Note:__ Some ports (e.g. 443) require admin privileges to run (`sudo`).
5. Application can now be accessed on `http(s)://VITE_APP_HOST:VITE_APP_PORT`

## Testing Guide

### Software Requirements
* Postman
* Back-end service to be running

### Instructions
1. Open Postman and go into collections.
2. Import `./test/intelliQ_API_testing.postman_collection.json`.
3. Copy all files from `./test/questionnaire_samples` to a folder (e.g. `samples`).
4. Click on the `Upload Questionnaire` request, click on `body`, remove the selected file and then re-add it from `samples` (it should be `valid-1.json`).
5. Click on the collection and click `Run`, then click `Run intelliQ API Testing`.
6. Wait for tests to finish.
