# CallerTech Desktop App


## Local Development
### Dependencies
- Node 12.x
- Yarn
- Callertech Server running

To install the Yarn Packages, run `yarn`
### steps to compile the appl
1. Set the `base_url` and `host_name` in the `src/settings.js` file
2. Run the command `yarn start`


## Compiling React Webapp
Increment the version number in `public/index.html` and `public/version.js`
For compiling for production, run `yarn webapp`
If you want to compile for staging, run `yarn webapp:staging`

## Building installer
Increment the version number in `package.json`
For beta version, run `yarn release:beta`
For production version, run `yarn release`