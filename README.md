In the Filter option i think we might need to create a function that gets a random value for the filter.

# Project Folder Structure Documentation

### `src`
This is the main source directory containing all the code and resources for the project.

#### `baseFiles`
Contains base resources and data files for the project, categorized by type.
- **`excel`**: Files related to Excel data.
  - **`RawXL`**: Raw Excel files intended for backup purposes, allowing easy
  restoration by copying and pasting into the Excel folder in case any file is
  accidentally deleted.
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

---
# Ideas
1. Create an Details.txt - the name can change - file for each Site to display
the last page that a lawyer was found - just for the sites that have more than
one page.

    This has a problem because some lawyer could be skipped without registration

2. Get the total of firms registred and pass this quantity for the REPORTS.XLSX

# Working on


# Fix
TOMMP - PARTNER CHECKING