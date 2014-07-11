// Class that represents a row in the sidecar xml file
function SidecarRow(row) {
    var self = this;
    self.row = ko.observable(row);
}

//Class that represents tab section
function Section(name, selected, callback) {
    var self = this;
    this.name = name;
    this.initCallback = callback;
    this.isSelected = ko.computed(function() {        
       if (this === selected()) {
           if (typeof self.initCallback == 'function') {
               self.initCallback();
           }
           return true;
       }
    }, this);
}

// Overall viewmodel for this screen, along with the initial state
function SidecarViewModel() {
    var self = this;
    
    //instances of utility classes
    self.structure = new sidecarStructure();
    self.reader = new fileReader();
    
    /**
     * Sidecar table functions
     */
    
    self.sourceFormats = ko.observableArray(self.structure.sourceFormats);    
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
      self.outputDecoration();
    };
    
    self.outputDecoration = function() {
        $('.output .line-number, .output .cl').remove();
        $('pre code').before('<span class="line-number"></span>');
        $('pre code').after('<span class="cl"></span>');
        var num = self.generatedXML().split(/\n/).length;
        for (var j = 0; j < num; j++) {
            var line_num = $('span.line-number')[0];
            line_num.innerHTML += '<span>' + (j + 1) + '</span>';
        }        
    };
    
    self.importSidecarData = function(xmlstr) {
        self.rowsCollection.removeAll();
        self.generatedXML("");
        self.rowsCollection(self.structure.importFromXml(xmlstr));        
    };
    
    //read xmlfile provided to file input field
    self.readXmlFile= function(obj, evt) {
        self.reader.readXmlFile(obj, evt, self.importSidecarData);
    };
    
    self.showImportBox = function() {
      $('#sidecar_file').trigger('click');  
    };
    
    /**
     * Section handling functions
     */    
    self.rowsCollection = ko.observableArray([
      new SidecarRow(self.structure.fields)
    ]);
    
    self.selectedSection = ko.observable();
    
    self.sections = ko.observableArray([
        new Section('Metadata', self.selectedSection),
        new Section('Content Source', self.selectedSection),
        new Section('XML Code', self.selectedSection, self.generateSidecar)
    ]);
    
    //inialize to the first section
    self.selectedSection(self.sections()[0]);
}

var viewModel = new SidecarViewModel();
ko.applyBindings(viewModel);