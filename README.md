# Welcome
Press `Ctrl+Shift+V` or `CMD+Shift+V`

---
<aside>
📎  Index:

- [Project Folder Structure Documentation](#project-folder-structure-documentation)
- [How to Use?](#how-to-use)
</aside>

---


## Project Folder Structure Documentation

### `src`
This is the main source directory containing all the code and resources for the project.

#### `baseFiles`
Contains base resources and data files for the project, categorized by type.
- **`excel`**: Files related to Excel data.
- **`json`**: JSON files.

#### `config`
Contains configuration files for the project.

#### `entities`
Contains the core business entities or data models of the application.
- **`BaseSites`**: Contains base data or configuration for sites.
- **`Excel`**: Contains Excel-related entity files.

#### `sites`
Contains the main data and configurations for different law firms categorized
by how the data is obtained.
- **`ByClick`**: Contains data from websites scraped by clicking.
- **`ByFilter`**: Contains data from websites filtered by specific criteria.
- **`ByNewPage`**: Contains data from websites scraped by navigating new pages.
- **`ByPage`**: Contains data from individual pages.
- **`standingBy`**: Contains directories for law firms that are on standby or
in a different category.

#### `utils`
Contains utility scripts and functions that aid in different tasks within the
project, such as data processing, file handling, or web scraping.

---
## How to use?
1. Locate the file "app.js";

![app.js](public/imgs/app.png)

2. Click on app.js to open it, then execute the file;

![runApp](public/imgs/runApp.png)

Once the file runs, a browser window will open.

3. Select the operation that will be performed;

![webWindow](public/imgs/webWindow.png)

- **Search:** Starts a new search for lawyers.

*Note:* Starting a new search will erase the previous sheet and all contacts.

- **Check for updates:** Verifies if there is an available update for the
application.

4. To add an email to the emailsToAvoid.txt file:
- Press `Ctrl+P` or `CMD+P`.
- Start a search by typing `/` followed by the name of the firm.
- *Note:* the search isn't case sensitive.
![searchInFolder](public/imgs/searchInFolder.png)

- *Note:* All three files related to the operation, including emailsToAvoid.txt,
are located in the folder of the firm you searched for.
---
# Fix
