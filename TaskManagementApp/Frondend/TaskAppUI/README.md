# Task Management Application (Frontend)

## Installation

1. Install [Node.js](https://nodejs.org/).
2. Install Angular CLI using the command `npm install -g @angular/cli`.
3. Run the command `npm install`.

## Bootstrap Setup

If Bootstrap is not working, follow these steps:

1. Update the `angular.json` file.
2. Add path to the `bootstrap.bundle.min.js` in the `scripts` array like:

   ```json
   "scripts": [
       "./node_modules/bootstrap/dist/js/bootstrap.bundle.min.js"
   ]

3. Add path to the `bootstrap.min.css` in the `styles` array like:

   ```json
   "styles": [
      "styles.css",
      "./node_modules/bootstrap/dist/css/bootstrap.min.css"
   ]

## Running the App

1. Run the command `ng serve` to start the app.
2. The server will run on port 4200.
3. Open your browser and navigate to [http://localhost:4200](http://localhost:4200).
