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
    
    // Add new row to the table
    self.addNewRow = function() {
      self.rowsCollection.push(new SidecarRow(self.fileRows[0]));
    };
    
    self.removeRow = function(row) {
      self.rowsCollection.remove(row);
    };
    
    // Generate xml file
    self.generateSidecar = function() {
      var data = ko.toJSON(self.rowsCollection);
      console.log(data);
    }
}

var viewModel = new RowsViewModel();
ko.applyBindings(viewModel);