# Installing Catalyst AppVetting Software 
## for Local Testing on a Windows Machine
(Updated 05/05/2020)

#### Thank You 
for your willingness to use your skills and talents developing software for **Catalyst Partnerships NW**.  This brief document is intended to step you through the onboarding process.

**This guide will help you:**
- **Install Ubuntu Linux on your Windows Machine**
- **Do some pre-install checks of previously installed components**
- **Install the Catalyst software**
- **The Development Process**
- **If you're interested in helping...the way we use GitHub**
- **Set up the VS Code IDE to access the Catalyst software in the Linux environment**
- **Other dev notes**

## Installing Ubuntu Linux
### Install the Windows Subsystem for Linux (WSL)
Before you can install Ubuntu (linux) on your Windows machine, you must let Windows know you want to install a linux instance.  To do this:
- Open PowerShell as Administrator and run:
```
Enable-WindowsOptionalFeature -Online -FeatureName Microsoft-Windows-Subsystem-Linux
```
- Restart your computer when prompted.


### Install Ubuntu: 

- Open the windows store
- Download and install Ubuntu ^18


## Pre-installation Checklist


### Make sure any prior local installations are gone
Open Ubuntu
```
cd /usr/src/ 
ls
```
- Make sure the src folder does not contain the following folders:
  - Catalyst-AppVetting
  - db 
  - db_backups
  - logs
- IF they exist, delete them.

### Shut off any MongoDB instances
(This step is necessary if you have ever installed any instances of MongoDB on your computer, and will not hurt if you haven't.)
- Open windows powershell or equivalent and type 
```
net stop mongodb
```
This should shut off any windows instances of mongoDB. We should be good to go!

## Installing the Catalyst Software
### Get the installation started:
From the linux command line, run:
```
export AVT_GIT_BRANCH=develop && export AVT_AUTO_S3=catalyst-db-dev/env_files/.env-test && curl https://raw.githubusercontent.com/dandahle/Catalyst-AppVetting/${AVT_GIT_BRANCH}/script/init-curl.sh | sudo bash -
```
The above line finds the installation script (init-curl.sh) from the develop branch of our gitHub repo, and executes it locally.  Enjoy the log files as they wander down your linux console.  **This process will take a few minutes.**  During this process, you may encounter firewall issues.  If they come from Ubuntu, you should be safe.

### Configure the .env File
Installation will pause in .vim to allow you to configure a file called .env.
This .env file contains all the variable configuration data necessary to not only install locally (which we are doing), but also in AWS.

The following .env setup will allow you to download some starter data for your local instance.  Any data changes you make will only be local changes, and will not affect any other remote data sets. ***Note: REMOVE or CHANGE all areas that have `<***` `***>` (including the `<*` symbols...) *** *I like using Local as my last name, so as not to confuse it with an actual AWS implementation (if applicable).*

```
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_S3_RESTORE_BUCKET=
AWS_S3_BACKUP_BUCKET=
AWS_DEFAULT_REGION=
AVT_GIT_BRANCH=develop
AVT_RESTORE_FROM_BACKUP=no
AVT_RESTORE_FROM_BACKUP_FOLDER=
AVT_SERVER_PORT=8000 <*** You can change this, but remember when running in browser ***>
CATALYST_USER_EMAIL=<***MAKE UP YOUR OWN, but REMEMBER IT SOMEHOW***>
CATALYST_USER_PASSWORD=<***AGAIN, MAKE IT UP AND RECORD IT SOMEWHERE***>
DB_USERNAME=<***THIS is INTERNAL, but make up something and RECORD THIS AS WELL***>
DB_PASSWORD=<***THIS is INTERNAL, but but make up something and RECORD THIS AS WELL***>
OPTIONAL_SETTINGS=I-----CHANGING----BELOW----OPTIONS---IS-----OPTIONAL-----I
AVT_ENVIRONMENT=DEVELOPMENT
CATALYST_USER_FIRST_N=<***Your First Name***>
CATALYST_USER_LAST_N=Local <***or Your Last Name***>
DB_AUTHSOURCE=admin
DB_HOST=localhost
DB_PORT=27017
DB_NAME=catalyst
```
Once you finish, write quit `:wq` and verify your settings are correct.  If not, open vim to fix what you need to: `vim Catalyst-AppVetting/.env` and save with `:wq` again.

Then run the script noted on the page, here for reference as well:
`cd /usr/src/Catalyst-AppVetting && sudo bash ./script/init-setup.sh`

(ASIDE: Anytime you see port:8000 for the rest of this manual, assume it is the port you put in the env file if you changed it.)

If you choose to start the web-application tool, do so now, open your browser to localhost:8000, and use your creds to sign in and create users and applications.  We'll discuss the post-install development process in further detail below.

**Installation COMPLETE!**

## The Development Process...

### Getting Started

Open Ubuntu
Type `cd /usr/src/Catalyst-AppVetting`
Type `./script/start-all.sh`
Open a browser to `localhost:8000`  
**Okay, it should be up and running**

### Using the software
In order to test the software, you'll need to create some data.  
* **Logging in:** Use your CATALYST_USER_EMAIL and
CATALYST_USER_PASSWORD .env creds to log in (blue Log In button upper right corner).  This is an administrator account. With this account, you can set up users with their respective roles, to see what they see.
* **Users and Roles:** Click on the `Users` button - you should see yourself as an ADMIN.  Click `Add New User` to add a user with different roles to see what permissions they have to see what they see.  For instance, Site Assessor roles cannot see the `Vetting` tab.  There are certain places Vetting agents can't enter information in the Site Assessment views, and so on. 
* **Creating application data** (literally): Click `Apply` tab to fill out an application (fill in, like ALL the fields, and be sure to click "Yes" radio buttons to fill in more information) and click Submit.  This will save the application information in your local database, so you only have to do this once.
* **Viewing and modifying and entering more data:** From the success page, click on the `Vetting` or `Site Assessment` or `Project Summary` tab (if it is there.  If not, navigate back to `localhost:8000` or change users).  Click around, change data, enter vetting notes, work items, summaries, etc.
* **SEEING the database:** Mongo has an app (Mongo 3T?? or Robomongo?? or Compass??) that allows you to see (and...gulp...edit) the database.  No idea how to install it, but if you do, at least on Windows, you may need to do that `net stop mongodb` as described in the setup above. so the linux version doesn't get confused.  IF ANYONE successfully attempts to install this AND CONNECTS to their local database, please, for the love of all that is good, delete this paragraph and post instructions here in its place.

## **If You're Interested in fixing issues and submitting them for review, read on...**

**Take a look** at the Open Issues using the Issues Tab at the top of the GitHub page.

### Submitting changes to the codebase

If you know what you're doing, you may wish to create your own fork of this software and submit merge requests if you want to share your changes with us.  The following will share how to use our repo to make the changes, allowing you to create merge requests (to our develop branch, please) which will be reviewed before implementing changes.

### Quick Summary:
We begin by **branching off develop,** making changes to that branch, and submitting merge requests **compared with develop.**  We continually work out the details of this, and will update this file accordingly (especially if you find some method that works better).  But for now, please follow the instructions below to submit code changes.  

**Begin Your Branch - open a console from your local catalyst repo folder:**
* `git checkout develop`
* `git pull`
* Use the "Issue Code" Number from the google doc spreadsheet to name your branch.  If you must test, please use TST-##.
* For Example: `git branch VW-12`
* Check out the branch: `git checkout VW-12`
* Create the remote github branch: `git push -u origin VW-12`

**During Development**
* Make your code changes, committing them to your local branch.  (for example):
	`git commit -am "insert commit message here, saying what you did"`
* We also encourage you to commit your local branch to the remote repository early and often using the following command:
	`git push`

	*(Don't worry - this doesn't merge it into the master branch or anything - it just saves your work remotely on a branch of the same name, so you have a backup in case something goes wrong...)*

**Before the final pull request.  Go to your branch and...**
* `git status` - - if there is anything to commit, be sure to
	`git commit -am "commit message here"   THEN:
* `git checkout develop` 
* `git pull` -- pulls any changes from other developers
* `git checkout <yourBranch>`
* `git merge develop` -- merges those changes into your branch. 
* `git push` -- one final local branch push to remote branch.  NOW...

**Create a Pull Request**
After pushing your local changes to the gitHub repo branch:
* point your browser to the repository on github.com.
* Make sure you are signed in to GitHub
* Click the `Pull Requests` tab.
* Click `New Pull Request`.
* In the **base:** dropdown, **select develop. <-- IMPORTANT**
* In the **compare:** dropdown, select the branch you recently pushed to the repository.
* Be sure the changes you have made are reflected in the commits and code comparison below.
* Click `Create pull request`.
* Modify the Title: use code and description title from the spreadsheet, like `VW-12: Fixed Vetting Worksheet Buttons`
* Modify the Description (be as brief as you want) - basically be sure to highlight the changes this Pull Request is introducing to the develop branch.

And that should create a Pull Request. 

## Using VS Code as your IDE:

### Install Remote - WSL Extension

If you wish to use VS Code as your IDE on your Windows machine, it is helpful to install the Windows Subsystem for Linux **Remote - WSL extension** in VS Code to access the files.  Now, if your VS Code is updated to the latest version, it SHOULD detect that you have activated WSL. (from the first step in this document), and give you a helper box in the lower right corner to install "Remote - WSL."  Follow the instructions to install the extension.

If you don't get the helper box, you can go to the Welcome Screen, click on Tools and Languages, and search for WSL in the Extensions Marketplace (on the left), and the "Remote - WSL" extension should be at or near the top.  Install it.

### Using the WSL Extension to Access Catalyst Files

Once your Remote WSL Extension is installed and active, the bottom left corner goes green.  Click it, and open a new window (if multiple distros, then choose the one you installed Catalyst to).  Then in the new window, open a new folder, and type /usr/src/ and click okay - you're all set - manipulate code in the Catalyst-Appvetting folder, and you'll see changes in localhost:8000.  

## Other Dev Notes

### Using GitHub

The catalyst production code is located at [github.com/dandahle/Catalyst-AppVetting](github.com/dandahle/Catalyst-AppVetting). Please follow best practices when forking and branching.  Pull requests to the main develop branch will need to be approved.

Please also be sure to merge the upstream branch into your own (and fixing any merge conflicts) before submitting any pull requests.

### Good reads
* Anatomy of an HTTP Transaction - https://nodejs.org/en/docs/guides/anatomy-of-an-http-transaction/
* Using express, handlebars, and mongoDB - https://sites.google.com/site/redmahbub/development/hbs-mongo-with-express4

### MongodB Documentation
* mongoDB - https://docs.mongodb.com/manual/introduction/
* mongoDB Node.js driver quick reference - http://mongodb.github.io/node-mongodb-native/2.2/
* mongoDB Node.js driver API - http://mongodb.github.io/node-mongodb-native/2.2/api/

### Packages
*Package* | *Description* | *Documentation*
--- | --- | ---
Bluebird | Full feature promise library with ES6 support | http://bluebirdjs.com/docs/
body-parser | Parse incoming request bodies in a middleware before your handlers, availabe under the `req.body` property | www.ewiggin.gitbooks.io/expressjs-middleware/content/body-parser.html
bootstrap | HTML, CSS, and JS framework for developing responsive, mobile first projects on the web | http://getbootstrap.com/getting-started/
cookie-parser | Parse Cookie header and populate `req.cookies` with an object keyed by the cookie names. Optionally you may enable signed cookie support by passing a `secret` string, which assigns `req.secret` so it may be used by other middleware | www.github.com/expressjs/cookie-parser
debug | tiny node.js debugging utility modelled after node core's debugging technique | www.npmjs.com/package/debug
express | Web framework for Node.js | www.expressjs.com
forever | Tool used to ensure a node script runs uninterrupted | www.npmjs.com/package/forever
jquery | jQuery is a fast, small, and feature-rich JavaScript library | http://api.jquery.com/
hbs | HTML semantic template builder | www.handlebarsjs.com
mongodb | official MongoDB driver for Node.js, needed for mongoose | www.docs.mongodb.com/getting-started/node/client/
mongoose | An object modeling tool used with mongoDB designed to work in an asynchronous environment | www.mongoosejs.com/docs/guide.html
morgan | HTTP request logger middleware for node.js | www.npmjs.com/package/morgan
request | Wrapper to use basica HTTP request functions | www.npmjs.com/package/request#http-authentication
serve-favicon | favicon serving middleware with caching | www.npmjs.com/package/serve-favicon
X-editable | Library for inline editing | https://vitalets.github.io/x-editable/

### Thanks Again for helping out! 