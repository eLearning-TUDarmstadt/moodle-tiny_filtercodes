# Moodle Tiny Editor Filtercodes Integration

![PHP](https://img.shields.io/badge/PHP-v8.1%20to%20v8.3-blue.svg)
![Moodle](https://img.shields.io/badge/Moodle-v4.4%20to%20v5.0-orange.svg)
[![Contributions welcome](https://img.shields.io/badge/contributions-welcome-green.svg)](#contributing)
[![License](https://img.shields.io/badge/License-GPL%20v3-blue.svg)](#license)

[FilterCodes](https://github.com/michael-milette/moodle-filter_filtercodes) filter for Moodle enables content creators to easily customize and personalize Moodle sites and course content using over 135 plain text tags that can be used almost anywhere in Moodle.
This Plugin provides a seamless integration of [FilterCodes](https://github.com/michael-milette/moodle-filter_filtercodes) Tags in the tiny-mce editor

## Installation Instructions

### Requirements

 - Moodle 4.4+
 - [FilterCodes](https://github.com/michael-milette/moodle-filter_filtercodes) Filter Plugin needs to be installed and enabled

### Method 1: Installation via Moodle UI

1. **Download the Plugin**
    - Download the plugin file.

2. **Log in as Administrator**
    - Access your Moodle site and log in with administrator privileges.

3. **Navigate to Plugin Installation**
    - Go to **Site Administration > Plugins > Install Plugins**.

4. **Upload the Plugin**
    - Click on "Upload a file" and select the downloaded plugin file.
    - Follow the on-screen instructions to complete the installation.

### Method 2: Installation by Unzipping the Plugin into /lib/editor/tiny/plugins

1. **Download the Plugin**
    - Download the plugin file.

2. **Unzip the Plugin**
    - Extract the contents of the plugin file to access the plugin directory.

3. **Upload to Server**
    - Using FTP or SSH, upload the extracted plugin files to the `/lib/editor/tiny/plugins/filtercodes` directory on your Moodle server.

4. **Set Permissions**
    - Ensure that the directory and file permissions are set correctly to allow Moodle to access the plugin.

### Notes

- **Backup Your Site**: Always ensure a full backup of your Moodle site before installing new plugins to prevent data loss in case of issues.
- **Permissions**: Verify that the server has appropriate write permissions for the plugin directory when using the UI method.
- **FTP/SSH Access**: For the manual method, ensure you have the necessary access to upload files directly to the server.
