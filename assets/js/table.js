// Class to represent a row in the sidecar xml file
function SidecarRow(row) {
    var self = this;    
    self.row = ko.observable(row);
}

// Overall viewmodel for this screen, along with initial state
function RowsViewModel() {
    var self = this;
    
    self.sourceFormats = ko.observableArray(['InDesign', 'HTML'])

    // Empty row with default data
    self.fileRows = [
        {
          article_name: "",
          source_format : ['InDesign'],
          custom_toc_icon : "",
          vertical_file_location : "",
          vertical_file_layout_name : "",
          horizontal_file_location : "",
          horizontal_file_layout_name : "",
          article_title : "",
          author : "",
          kicker : "",
          description : "",
          tags : "",
          ads : true,
          smooth_scrolling : 'never',
          flattened_stack : false,
          article_access : 'free'
        }
    ];    

    // Initialize table with default empty row
    self.rowsCollection = ko.observableArray([
      new SidecarRow(self.fileRows[0])
    ]);
    
    self.generatedXML = ko.observable("");
    
    // Add new row to the table
    self.addNewRow = function() {
      //create new instance of this model to get default fileRow values
      var newViewModel = new RowsViewModel();
      self.rowsCollection.push(new SidecarRow(newViewModel.fileRows[0]));
    };
    
    self.removeRow = function(row) {
      self.rowsCollection.remove(row);
    };
    
    // Generate xml file
    self.generateSidecar = function() {
      var rowsToSend = {items: []};
      ko.utils.arrayForEach(self.rowsCollection(), function(item, idx) {
        rowsToSend['items'][idx] = item.row();
      });
      var object = self;
      $.get('/backend/generate.php', rowsToSend, function(response){
        console.log(response);
        object.generatedXML(response);
      });      
    };
}

var viewModel = new RowsViewModel();
ko.applyBindings(viewModel);