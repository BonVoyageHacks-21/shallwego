var countriesList = [];

/* What should the add-on do after it is installed */
function onInstall() {
  onOpen();
}

/* What should the add-on do when a document is opened */
function onOpen() {
  DocumentApp.getUi()
  .createAddonMenu() // Add a new option in the Google Docs Add-ons Menu
  .addItem("Destination", "showSidebar")
  .addToUi();  // Run the showSidebar function when someone clicks the menu

  // run function to check if there is a table of destinations already in the document
  var countriesTableID = findCountryTable();
  if (countriesTableID != -1) {
    // if there is a table, then get the list of countries, save as variable countriesList
    countriesList = getCountriesList(countriesTableID);

  } else {
    // if there is no table, append the table to the bottom of the document
    createCountriesTable();
  
    // also save countriesList as an empty list
    countriesList = [];
  }

}

/* Show a 300px sidebar with the HTML from googlemaps.html */
function showSidebar() {
  var html = HtmlService.createTemplateFromFile("destination")
    .evaluate()
    .setTitle("Destination"); // The title shows in the sidebar
  DocumentApp.getUi().showSidebar(html);

}

// returns the id of the country table relative to body
function findCountryTable() {
  // get the body
  var body = DocumentApp.getActiveDocument().getBody();

  var numElems = body.getNumChildren();

  // find the appropriate table
  for (let i = 0; i < numElems; i++) {
    // find the paragraph with the text "COUNTRY OF VISIT"
    
    var nextChild = body.getChild(i);
    
    if (nextChild.getType() == DocumentApp.ElementType.PARAGRAPH) {
      if (nextChild.getText().includes("Countries to visit")) {
        Logger.log("found table title");
        for (let j = i; j < numElems; j++) {
          nextChild = body.getChild(j);
          Logger.log(nextChild.getType())
          if (nextChild.getType() == DocumentApp.ElementType.TABLE) {
            return j;
          }
        }
        break;
      }
    }
  }

  return -1;  

}

function logTable() {
  Logger.log(countriesList);
  console.log(countriesList);

}

function getCountriesList(country_table_id) {
  logTable();

  var body = DocumentApp.getActiveDocument().getBody();

  var tableElement = body.getChild(country_table_id);

  var numberOfCountryTableRows = tableElement.getNumRows();
  Logger.log(numberOfCountryTableRows);

  var countriesList_found = [];

  // return the countries list if avaiable
  for (let rowNum = 1; rowNum < numberOfCountryTableRows; rowNum++) {
    // get the first cell of that row
    var locationNameCell = tableElement.getCell(rowNum, 0);
    var locationNameStr = locationNameCell.getText();

    // append it to countries list found
    countriesList_found.push(locationNameStr);

    Logger.log(countriesList_found);
  }
  // otherwise return a empty list
  return countriesList_found
}

// to return the countries list to the html side
function reutrnCountriesList() {
  var countriesTableID = findCountryTable();
  countriesList = getCountriesList(countriesTableID);
  return countriesList;
}

function testReturn() {
  return ["apple", "orrange", "adfasdf"]
}

function addEntry(country) {
  

  countriesList = reutrnCountriesList();

  // if the country name is not already in the countriesList
  var countriesListLen = countriesList.length;
  Logger.log(countriesList);

  for (let i = 0; i < countriesListLen; i++) {
    if (countriesList[i].includes(country)) {
      return false;
    }
  }

  // add it to the countriesList
  countriesList.push(String(country));

  Logger.log(countriesList);
  
  // add a new row to the table
  if (findCountryTable() != 1) { 
    var body = DocumentApp.getActiveDocument().getBody();
    
    var country_table_id = findCountryTable();

    var tableElement = body.getChild(country_table_id);
    var new_table_row = tableElement.appendTableRow();
    new_table_row.appendTableCell(country);
    new_table_row.appendTableCell("0");
    new_table_row.appendTableCell();

    Logger.log(tableElement.getNumRows());

  }

  // update the stylings of the rows based on the maximum value to highlight the first max in the list
  updateStylings();
}

function removeEntry(cntry) {
  country = cntry.toString();

  // if the country name is in the countriesList
  Logger.log("riceeeee");
  countriesList = reutrnCountriesList();

  Logger.log(countriesList);

  var countriesListLen = countriesList.length;

  for (let i = 0; i < countriesListLen; i++) {
    if (countriesList[i].includes(country)) {

      // remove the selected country from the countriesList
      countriesList.splice(i,1);

      // remove the selected country from the table (make sure to skip the heading row)
      if (findCountryTable() != 1) { 
        var body = DocumentApp.getActiveDocument().getBody();
        
        var country_table_id = findCountryTable();

        var tableElement = body.getChild(country_table_id);
        var numberOfCountryTableRows = tableElement.getNumRows();


        for (let rowNum = 1; rowNum < numberOfCountryTableRows; rowNum++) {
          // get the first cell of that row
          var locationNameCell = tableElement.getCell(rowNum, 0);
          var locationNameStr = locationNameCell.getText();

          // remove the row
          if (locationNameStr.includes(country)) {
            tableElement.removeRow(rowNum);
            break;
          }
        }
        
        Logger.log(tableElement.getNumRows());

        break;
      }
      
      // update the stylings of the rows based on the maximum value to highlight the first max in the list
      updateStylings();
      return true;
    }
  }

  return false;
}

function voteEntry(country, userName) {
  
  countriesList = reutrnCountriesList();
  
  // if the country name is in the countriesList
  var countriesListLen = countriesList.length;

  Logger.log("i am here")

  for (let i = 0; i < countriesListLen; i++) {
    if (countriesList[i].includes(country)) {

      // remove the selected country from the table (make sure to skip the heading row)
      if (findCountryTable() != 1) { 
        var body = DocumentApp.getActiveDocument().getBody();
        
        var country_table_id = findCountryTable();

        var tableElement = body.getChild(country_table_id);
        var numberOfCountryTableRows = tableElement.getNumRows();


        for (let rowNum = 1; rowNum < numberOfCountryTableRows; rowNum++) {
          // get the first cell of that row

          var locationNameCell = tableElement.getCell(rowNum, 0);
          var locationNameStr = locationNameCell.getText();

          // remove the row
          if (locationNameStr.includes(country)) {
            var userNameCell = tableElement.getCell(rowNum, 2);
            var userNameStr = userNameCell.getText();

            Logger.log(userNameStr);

            if (!userNameStr.includes(userName)) {
              // increment the value of the Num votes column
              var votesCell = tableElement.getCell(rowNum, 1);
              var votesStr = votesCell.getText();

              var newVotes = parseInt(votesStr) + 1;

              votesCell.setText(newVotes.toString());
              
              userNameCell.appendParagraph(userName);
            }

          } else {
            // check if the user is in that row
            var userNameCell = tableElement.getCell(rowNum, 2);
            var userNameStr = userNameCell.getText();

            // Logger.log(userNameStr);

            if (userNameStr.includes(userName)) {
              // if yes, decrement the num votes columnn
              var votesCell = tableElement.getCell(rowNum, 1);
              var votesStr = votesCell.getText();

              var newVotes = parseInt(votesStr) - 1;

              votesCell.setText(newVotes.toString());

              // and remove the user's name from voters column
              // add the user to the voters column
              var numNamesInCell = userNameCell.getNumChildren()
              for (let childNum = 0; childNum < numNamesInCell; childNum++) {
                Logger.log((userNameCell.getChild(childNum).getText()))

                if (userNameCell.getChild(childNum).getText().includes(userName)) {
                  userNameCell.removeChild(userNameCell.getChild(childNum));
                  
                }
              }
  
            }

          }
        }

        break;
      }
    } 
  }

  // update the stylings of the rows based on the maximum value to highlight the first max in the list
  updateStylings();
}


function updateStylings() {

  // if there is more than the heading
  var body = DocumentApp.getActiveDocument().getBody();

  var country_table_id = findCountryTable();

  var tableElement = body.getChild(country_table_id);

  var most_votes = 0;
  var most_votes_row_ID = 1;
  
  var cellStyle = {};
  cellStyle[DocumentApp.Attribute.BACKGROUND_COLOR] = null;
  cellStyle[DocumentApp.Attribute.BOLD] = false;
  cellStyle[DocumentApp.Attribute.FOREGROUND_COLOR] = '#000000';

  if( tableElement.getNumRows() > 1) {
    // for loop through the rows of the table
    var numberOfCountryTableRows = tableElement.getNumRows();

    for (let rowNum = 1; rowNum < numberOfCountryTableRows; rowNum++) {
      // get the first cell of that row
      var locationNameCell = tableElement.getCell(rowNum, 1);
      var locationNameStr = locationNameCell.getText();

      // convert the string into and integer
      var votes = parseInt(locationNameStr);

      // if it is higher than the current most votes then take note of the row id
      if (votes > most_votes) {
        most_votes = votes;
        most_votes_row_ID = rowNum;
      }

      // reset the style of all the rows
      locationNameCell.setAttributes(cellStyle);
      locationNameCell = tableElement.getCell(rowNum, 2);
      locationNameCell.setAttributes(cellStyle);
      locationNameCell = tableElement.getCell(rowNum, 0);
      locationNameCell.setAttributes(cellStyle);
    }

    // then for the row with the id change it to the highlight styling
    var highlightCellStyle = {};
    highlightCellStyle[DocumentApp.Attribute.BACKGROUND_COLOR] = "#ffff00";
    highlightCellStyle[DocumentApp.Attribute.FOREGROUND_COLOR] = '#000000';
    
    locationNameCell = tableElement.getCell(most_votes_row_ID, 2);
    locationNameCell.setAttributes(highlightCellStyle);
    locationNameCell = tableElement.getCell(most_votes_row_ID, 1);
    locationNameCell.setAttributes(highlightCellStyle);
    locationNameCell = tableElement.getCell(most_votes_row_ID, 0);
    locationNameCell.setAttributes(highlightCellStyle);

  }
}

function createCountriesTable() {
  var body = DocumentApp.getActiveDocument().getBody();

  body.appendPageBreak();

  // append to current document the paragraph "Countries to visit"
  var section = body.appendParagraph("Countries to visit");
  section.setHeading(DocumentApp.ParagraphHeading.HEADING3);
  
  // Create a two-dimensional array containing the cell contents.
  var heading = [
    ['Location', "Num votes", "Voters"],
  ];

  // create the style for the heading
  var headerStyle = {};
  headerStyle[DocumentApp.Attribute.BACKGROUND_COLOR] = '#cccccc';
  headerStyle[DocumentApp.Attribute.BOLD] = true;


  // Build a table from the array.
  var countriesTable = body.appendTable(heading);

  var headerRow = countriesTable.getRow(0);

  for (let cellNum = 0; cellNum < 3; cellNum++) {
    var headerCell = headerRow.getCell(cellNum)
    headerCell.setAttributes(headerStyle);
  }

}

function getEmail() {
  return Session.getActiveUser().getEmail();
}

/////////////// KIV SECTION //////////////////

// find the table of contents assuming only one and return the position
function findTableOfContents() {

}

function updateTableOfContents() {

}

function testingFunction () {
  
}



