# MockServer Browser Admin
This SPA admin page is for a tiny tool for controlling [mockserver-node](https://www.mock-server.com/mock_server/running_mock_server.html) expectations, you can easily create, update, delete, read the active expectations of your target mock server with host and port.

Since this admin page is really a simple demo for using the mockserver browser api, if this does not really match your needs, welcome to fork and update to your favorite style and features.

> Default MockServer Client version is "5.15.0", you can find and change the version in `index.html`.


## Tech
Made with `React + TS + TailwindCSS + CodeMirror`


## Install
```bash
$ npm install
```


## Bundle
```bash
$ npm run build
```


## Preview
```bash
$ npm run preview
```
> This preview feature will run up Vite's default preview page, if you want to serve the bundle on your own server, since this is all SPA static files, just upload the `dist` folder or serve the `dist` with your static server.


## Author
- 2023/09/27 made by JohnnyWang with ❤️