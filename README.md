# CS3312---Active-Learning-for-2110
Georgia Tech CS 3312 (Junior Design part 2)

CS 2110 at Georgia Tech covers a myriad of topics (see bottom).  Our team will build a website and accompanying problem/answer set covering these topics.  Specifically, with the website, the instructor will be able to present a sequence of multiple choice and/or True/False questions during a lecture. For each question, a time limit is given for the students to answer -- given a web-enabled device (laptop, tablet, phone, etc). After the time period, the answers are logged and graphed using a histogram.  The instructor is then able to display the answer and matching explanation.

The instructor should be able to track the performance of each student over the course of the semester, down to a specific question.  Furthermore, the answer order of each question should be randomized so that answers are different from one semester to the next.

Finally, the instructor should be able to add new questions to the initially produced set and remove existing ones.

## Release Notes

*December 5, 2016*

We are happy to announce our initial release, `0.1`,  of Active Learning for CS 2110.  The following sections will detail new features and known bugs and defects.

### New Features
* Login and user-session management.
* Instructors can now ask questions and create question-answer sessions.
* Instructors can now view statistics of each question-answer session.
* Students can now answer the questions asked by the instructor.
* Student answers are now recorded throughout the semester.
* Students can now practice and study with questions they have already answered for credit.
* Students can now view their performance overall and by question.
* Instructors are now able to view individual student performance overall and by question.
* Instructors are now able to create, update, edit, and delete questions from the question bank.

### Bug Fixes

There have been no bug fixes since the last release because this is the initial release.

### Known Bugs and Defects
* Instructors are unable to create new modules at this time.
* Instructors are currently unable to export student performance to an Excel spreadsheet.
* Instructors are unable to move questions between modules at this time.
* Students and instructors are currently unable to use the Georgia Tech central authentication service to log in to the application.
* Students are currently unable to view the timer for an active question on their devices.
* When creating a new question, exiting the creation dialog without updating any fields will create an empty question. The workaround for this is to simply delete the empty question after exiting the creation dialog.

## Installation Guide

### Prerequisites

All following instructions assume a Linux system of a canonical distribution (Debian, Ubuntu, Mint, RedHat, CentOS, etc.).

The host acting as a webserver must have networking capabilities and have ports 80 and 3000 open for TCP traffic.

The source code alone requires 97 MB of disk space. Third-party dependencies will require additional disk space.

### Dependencies

The application depends on the following third-party software:

* `git`: Used for acquiring the source code.
* `mysql-server`: Used for persistent data storage.
* `mysql-client`: Used for persistent data storage.
* `apache2`: Used for serving web pages.
  * On RedHat Linux and Fedora derivatives, install `httpd` instead.
* `nodejs`: Used for running the API.
  * Some package managers may use the `node` package instead. They are identical.
* `npm`: Used for installing `node` modules.

All of the packages should be available for installation using the package manager of your distribution. On Ubuntu and Mint, this is `apt` or `apt-get`. RedHat Linux uses `yum`.

You can determine which package manager your distribution uses by running the command `which $some_package_manager`.  If this command returns a path to an executable, then that is your package manager. Otherwise, `$some_package_manager` is not the package manager for your distribution.

You should be able to install each package by doing the following:

`$ $your_package_manager install -y git mysql-server mysql-client apache2 nodejs npm`

### Downloading the Source Code

The source code can be acquired from [this repository.](https://github.gatech.edu/jrodriguez79/CS3312---Active-Learning-for-2110)

Download the source code with:

`$ git clone https://github.gatech.edu/jrodriguez79/CS3312---Active-Learning-for-2110.git`

You should be able to access this repository using your Georgia Tech log in credentials.

### Building and Configuring the Application

This application uses Node.js and its surrounding toolchain, namely npm.

##### Initializing the database
To create and initialize the database, go to the `database` directory and run the following commands:

`$ mysql < createDatabase.sql`

`$ mysql cs2110_active_learning < initializeDatabase.sql`

The default database name will be `cs2110_active_learning`.

##### Configuring the Application
To configure the application to connect to your MySQL database, open the file `api/util/config.js` and change to the database connection information, particularly the `HOST`, `USER`, `PASSWORD`, and `DATABASE`.

To configure the application to connect to your web API, open the file `app/js/controllers/homeController.js` and change the `API_URL`.

##### Installing Packages
__NPM (Node Package Manager)__ is, as the name states, used to manage the JavaScript dependencies that the application uses.

To install the dependencies after downloading the applications listed above and the source code, run the following command in the root directory:

`$ npm install`

##### Building the Application
__Grunt__ is a JavaScript Task Runner and is used to automate the compilation and minification of files for use in the application.

To build the files, run the following command in the root directory:

`$ grunt`

### Deploying the Application

If the application has not been built yet, build it using:

`$ grunt`

The webserver expects all of the HTML, CSS, and JS files to be located in the directory `/var/www/html`. After building the application, place all relevant files in that directory. This can be done with the following command:

`$ sudo cp -rf ./app/*`

To run the API, execute the following command from the root of the tree containing the application source code:

`$ nodejs ./api/api.js &`

For easier deployment, the Bash script `deploy.sh` has been included in the repository. `deploy.sh` will execute all of the previous commands by running a single script. The following will deploy the application, assuming the user has `sudoer` privileges:

`$ ./deploy.sh`

If any updates are made to the code, the application will need to be re-deployed by executing the `deploy.sh` script.

Run the following command to start the webserver. You should only have to do this once.

For Ubuntu and Mint users:

`$ sudo service apache2 start`

For RedHat Linux users:

`$ sudo service httpd start`

### Troubleshooting

The installation of the `bcrypt` packager through `npm` may fail. In one case, it failed because the C++ compiler `g++` was not installed. To resolve this issue, install `g++` via the package manager that comes with your distribution.

When installing `grunt` through `npm`, `grunt` may need to be installed globally. Use the following command to do so:

`$ npm install -g grunt`

## Git flow

We are using a slightly modified version of the Git flow workflow found here: https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow

### Big idea

Everytime a developer works on a feature, they create a new branch (```git checkout -b <branch name>```)

When they are done with that branch, they merge it back into dev:
     ```git checkout dev && git merge --no-ff <branch to merge into dev>```

This creates a clean commit history and allows entire features to be easily rolled back if necessary.


### Branching convention

Branches will be named in the following convention:
	 ```feature/<your name>/<feature name>```

For multiple developers working on the same story, but different components, the following format brancing format may be useful:
    	 ```feature/<your name>/<back-end|front-end>-<feature name>```

Because the front and back ends are only coupled via API endpoints, they can be developed independently.

### Commit/PR message format

Each commit should be written in (roughly) the following format:

(If this commit/PR is added, it will:) <commit message>

E.g. Change API endpoint from thing1 to thing2
