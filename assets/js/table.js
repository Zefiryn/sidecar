// Class that represents a row in the sidecar xml file
function SidecarRow(row) {
    var self = this;    
    self.row = ko.observable(row);
}

// Overall viewmodel for this screen, along with the initial state
function SidecarViewModel() {
    var self = this;
    self.structure = new sidecarStructure();
    self.fileReader = new fileReader();
    
    self.sourceFormats = ko.observableArray(self.structure.sourceFormats);
    
    self.rowsCollection = ko.observableArray([
      new SidecarRow(self.structure.fields)
    ]);
    
    self.generatedXML = ko.observable("");
    
    // Add new row to the table
    self.addNewRow = function() {
      //create new instance of sidecarStructure to get default fileRow values
      var rowFields = new sidecarStructure();
      self.rowsCollection.push(new SidecarRow(rowFields.fields));
    };
    
    self.removeRow = function(row) {
      self.rowsCollection.remove(row);
    };
    
    // Generate xml file
    self.generateSidecar = function() {      
      self.generatedXML(self.structure.generateXml(self.rowsCollection()));
    };
    
    self.importSidecarData = function(xmlstr) {
        self.rowsCollection.removeAll();
        self.generatedXML("");
        self.rowsCollection(self.structure.importFromXml(xmlstr));        
    };
    
    //read xmlfile provided to file input field
    self.readXmlFile= function(obj, evt) {
        self.fileReader.readXmlFile(obj, evt, self.importSidecarData);
    };
}

var viewModel = new SidecarViewModel();
ko.applyBindings(viewModel);