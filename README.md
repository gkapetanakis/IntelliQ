# Software Engineering Project 2022-2023

Group: softeng2022-01
Members: el19005, el19062

## Setup

### Software requirements
* Git
* node.js
* MongoDB

### Installation Instructions
* Clone repository wherever you want (e.g. `/`)
#### Back-end service
1. Start the MongoDB service
2. Inside `/api-backend`:
   1. Run `npm install`
   2. Run `npm run dev`
3. Application can now be accessed on `localhost:9103/intelliq_api`
#### Front-end service _(requires back-end to be running to function properly)_
1. Inside `/frontend`:
   1. Run `npm run build`
   2. Run `sudo npm run preview` (`sudo` is required to run on port 443)
2. Application can now be accessed on `localhost:443`
