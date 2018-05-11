# express-mongo-react-andDesign
A workflow with full live reload for webpack&express application.

The explaining post could be found [here](http://acgtofe.com/posts/2016/02/full-live-reload-for-express-with-webpack).

## Start

1. Clone this repo.

2. Install dependencies.

        cd client && npm install
        cd server && npm install

3. Try these out on development.

    * open `client` directory
    * `npm run dll` to build dll file on client/dist.
    * copy `client/dist/vendor.dll.js` to `server/dist/dll/vendor.dll.js`
    * `npm run dev` to start client project
    * open `server` directory
    * `npm run start:dev` to start server project

4. Try these out on production.

    * open `client` directory
    * `npm run dll` to build dll file on client/dist.
    * copy `client/dist/vendor.dll.js` to `server/dist/dll/vendor.dll.js`
    * `npm run build` to build file
    * open `server` directory
    * `npm run start:pro` to start server project
