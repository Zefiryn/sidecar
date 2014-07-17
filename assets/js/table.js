// Class that represents a row in the sidecar xml file
function SidecarRow(entry) {
    var self = this;
    self.entry = ko.observable(entry);
    self.hasTocIcon = ko.computed(function() {
        return this.entry().toc_image() != "";
    }, this);
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
    self.decorator = new Decorator();

    /**
     * Sidecar table functions
     */
    self.sourceFormats = ko.observableArray(self.structure.sourceFormats);
    self.accessOptions = ko.observableArray(self.structure.accessOptions);
    self.generatedOutputXML = ko.observable("");
    self.generatedFullXML = ko.observable("");

    // Add new row to the table
    self.addNewRow = function() {
        if (self.structure.updateOnly() === false) {
            //create new instance of sidecarStructure to get default fileRow values
            var rowFields = new sidecarStructure();
            self.entries.push(new SidecarRow(rowFields.fields));
        }
    };

    self.removeRow = function(row) {
        if (self.structure.updateOnly() === false) {
            self.entries.remove(row);
        }
    };

    // Generate xml file
    self.generateSidecar = function() {
        self.generatedOutputXML(self.structure.generateXml(self.entries(), false));
        self.decorator.outputCodeDecoration();
    };
    
    self.generateFullSidecar = function() {
        self.generatedFullXML(self.structure.generateXml(self.entries(), true));
    }

    /**
     * Import new collection from xml string
     */
    self.importSidecarData = function(xmlstr) {
        self.entries.removeAll();
        self.generatedOutputXML("");
        self.generatedFullXML("");
        self.entries(self.structure.importFromXml(xmlstr));        
        self.decorator.inputHeightMatchAll();
    };

    self.setUpdateOnlyFlag = function(object, event) {
        self.structure.updateOnly(event.target.checked);
        var state = event.target.checked ? "disable" : "enable";
        $('#metadata-table ol, #content-source-table ol').sortable(state);
    };

    //read xmlfile provided to file input field
    self.readXmlFile = function(obj, evt) {
        self.reader.readXmlFile(obj, evt, self.importSidecarData);
        //reset input selection
        $('#importfileform')[0].reset();
    };

    /**
     * Trigger click of file input
     */
    self.showImportBox = function() {
        $('#sidecar_file').trigger('click');
    };

    /**
     * Show box with export options
     */
    self.showExportBox = function() {
        $('#export-options').show();
    };
    
    self.hideExportBox = function() {
        $('#export-options').hide();
    };
    
    /**
     * Trigger downloading generated xml as file
     */
    self.exportXml = function() {
        self.hideExportBox();

        //generate again as metadata checkbox might have been changed
        self.generateFullSidecar();
        var sidecarFile = new Blob([self.generatedFullXML()], {type: "text/xml;charset=utf-8"});
        saveAs(sidecarFile, "sidecar.xml");
    };

    //initial table with one empty row
    self.entries = ko.observableArray([
        new SidecarRow(self.structure.fields)
    ]);

    /**
     * Section handling functions
     */
    self.selectedSection = ko.observable();

    self.sections = ko.observableArray([
        new Section('Metadata', self.selectedSection),
        new Section('Content Source', self.selectedSection),
        new Section('XML Code', self.selectedSection, self.generateSidecar)
    ]);

    //inialize to the first section
    self.selectedSection(self.sections()[0]);

    //initialize other elements
    $('document').ready(function() {
        //make sure to keep all inputs height in sync
        $('#metadata-table').on('keydown, keyup', 'textarea, input[type="text"]', self.decorator.inputHeightMatch);
        $('#metadata-table ol, #content-source-table ol').sortable({
            placeholder: "placeholder",
            handle: ".sort-handle"
        });
    });
}

var viewModel = new SidecarViewModel();
ko.applyBindings(viewModel);