Install Babel for JSX Preprocessor for React files
* Note there is the no-save option here.
* If Async/Await needs to be used, install babel 7 & change settings in .babelrc.js.
> npm install --no-save babel-cli@6 babel-preset-react-app@3

npx babel --watch app_project/jsx_files --out-dir ./public/javascripts/app_project --presets react-app/prod