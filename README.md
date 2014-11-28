Motivation
========

Your age.


![](extension/screenshot.png)

[Link to extension in chrome web store](https://chrome.google.com/webstore/detail/motivation-devm33-fork/edaphnidncfdooaldnhdmijjephlbehh)

## Usage

### Age
Enter birthday on first use to see age.

### Bookmarks
Displays vertical view of bookmarks in the top right corner.

To select a bookmark either click or focus on the page and press the key
of the the number to the left of the bookmark.
*Note: focusing the page is just tab in my browser (chrome on linux).*

All bookmarks in a folder can also be opened by middle clicking the folder,
presing spacebar before pressing the folder's key, or using the bookmark in
position 0 to open all for the current folder.

Right clicking on bookmarks displays a context menu with the option to delete
the bookmark.

## TODO (reasons for forking)

- [x] Fix wiggling back and forth of age.
- [ ] Add optional access to bookmarks
    - [x] Display clickable shortcuts with favicons
    - [x] Add hotkeys to open shortcuts
    - [x] Support more than 10 bookmarks
    - [x] Add ability to navigate down into bookmark folders
    - [x] Add ability to "open all bookmarks" in a folder
    - [ ] Add ability to drag to reorder bookmarks
    - [ ] Persist options and data across devices using storage api
    - [ ] Make bookmark display/permissions optional

Fork of [maccman/motivation](https://github.com/maccman/motivation)
