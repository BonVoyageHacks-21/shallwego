/* What should the add-on do after it is installed */
function onInstall() {
  onOpen();
}

/* What should the add-on do when a document is opened */
function onOpen() {
  DocumentApp.getUi()
  .createAddonMenu() // Add a new option in the Google Docs Add-ons Menu
  .addItem("shallwego", "showSidebar")
  .addToUi();  // Run the showSidebar function when someone clicks the menu
}

/* Show a 300px sidebar with the HTML from googlemaps.html */
function showSidebar() {
  var html = HtmlService.createTemplateFromFile("information")
    .evaluate()
    .setTitle("information"); // The title shows in the sidebar
  DocumentApp.getUi().showSidebar(html);
}

/* This Google Script function does all the magic. */
function insertGoogleMap(e) {
  var map = Maps.newStaticMap()
    .setSize(600, 400) // Insert a Google Map 800x600 px
    .setMarkerStyle(Maps.StaticMap.MarkerSize.MID, Maps.StaticMap.Color.RED, 'T')
    .addMarker(e)
    .setZoom(15)
    .setCenter(e); // e contains the address entered by the user

  DocumentApp.getActiveDocument()
    .getCursor() // Find the location of the cursor in the document
    .insertInlineImage(map.getBlob()); // insert the image at the cursor
}

/* Add text information to document. */
function appendDestinationInformation(information) {
  /*
  var body = DocumentApp.getActiveDocument().getBody();

    // append to current document the paragraph "Countries to visit"
  body.appendParagraph(information);
  */

  var cursor = DocumentApp.getActiveDocument().getCursor();
  var element = cursor.insertText(information);
  element.setBold(false);
  
}

/* Goes to next page */
function showNext(page) {
  var ui = HtmlService.createHtmlOutputFromFile(page)
      .setTitle(page);
  DocumentApp.getUi().showSidebar(ui);
}
