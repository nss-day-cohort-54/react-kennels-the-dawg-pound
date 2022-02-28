# Nashville Kennels

## Deployed Working App

You can visit the [deployed Nashville Kennels application](https://kennels.nss.team) to see how the application should work.

## Setup

### Application

After cloning the repository, make sure each teammate runs the `npm install` command in the root project directory to install all required 3rd-party tools.

### API

Each teammate will run their own API instead of using a shared one. In the `data` directory, you will see a `database.json.fixture` file that each teammate will use to [seed their database](https://en.wikipedia.org/wiki/Database_seeding).

Each teammate should create a **separate** directory in their workspace directory named `kennel-api`. Then create a `database.json` file in that directory. Copy pasta the example data into the new file. Then start json-server in that directory.

We repeat, **DO NOT CREATE A `database.json` FILE ANYWHERE IN THE APPLICATION REPOSITORY**.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
