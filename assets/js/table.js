// Class that represents a row in the sidecar xml file
function SidecarRow(row) {
    var self = this;    
    self.row = ko.observable(row);
}

// Overall viewmodel for this screen, along with the initial state
function SidecarViewModel() {
    var self = this;
    self.structure = new sidecarStructure();
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
      var sidecarObj = {sidecar: {entry: []}};
      var x2js = new X2JS({escapeMode: false});      
      ko.utils.arrayForEach(self.rowsCollection(), function(item, idx) {
        var row = self.structure.convert(item);
        sidecarObj.sidecar.entry.push(row);
      });
      
      var sidecarXmlString = x2js.json2xml_str(sidecarObj);      
      self.generatedXML(formatXml(sidecarXmlString));
    };
    
    self.importSidecarData = function(xmlstr) {
        var x2js = new X2JS({escapeMode: false});
        var jsonObj = x2js.xml_str2json(xmlstr);        
        
        self.rowsCollection.removeAll();
        self.generatedXML("");        
        ko.utils.arrayForEach(jsonObj.sidecar.entry, function(item, idx) {
            var rowData = self.structure.importFromXmlObject(item);
            self.rowsCollection.push(new SidecarRow(rowData));
        });
    };
    
    //read xmlfile provided to file input field
    self.readXmlFile= function(obj, evt) {
        var file = evt.target.files[0]; 
        if (file.type.match('text.*')) {
            var reader = new FileReader();
            reader.onloadend = (function(f){
                return function(e) {
                    self.importSidecarData(e.target.result);
                };
            })(file);
            reader.readAsText(file);
        }
        else {
            alert('Incorrect file type');
        }
    };
}

var viewModel = new SidecarViewModel();
ko.applyBindings(viewModel);