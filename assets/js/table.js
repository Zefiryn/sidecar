// Class that represents a row in the sidecar xml file
function SidecarRow(entry) {
    var self = this;
    self.entry = ko.observable(entry);
    self.hasTocIcon = ko.computed(function() {
        return this.entry().toc_image() !== "";
    }, this);
}

//Class that represents tab section
function Section(name, selected, callback, parentViewModel, preventEdit) {
    var self = this;
    this.name = name;
    this.preventEdit = preventEdit;
    this.initCallback = callback;
    this.parent = parentViewModel;
    this.isSelected = ko.computed(function() {
        if (this === selected() && this.isBlocked() === false) {
            if (typeof self.initCallback === 'function') {
                self.initCallback();
            }
            return true;
        }
    }, this);
    this.isBlocked = ko.computed(function() {
        return this.parent.structure.editUpdateOnly() && this.preventEdit;
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
    self.message = ko.observable(null);
    self.messageType = ko.observable(null);

    // Add new row to the table
    self.addNewRow = function() {
        if (self.structure.editUpdateOnly() === false) {
            //create new instance of sidecarStructure to get default fileRow values
            var rowFields = new sidecarStructure();
            self.entries.push(new SidecarRow(rowFields.fields));
        }
    };

    self.removeRow = function(row) {
        if (self.structure.editUpdateOnly() === false) {
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
    };

    /**
     * Import new collection from xml string
     */
    self.importSidecarData = function(xmlstr) {
        self.entries.removeAll();
        self.generatedOutputXML("");
        self.generatedFullXML("");
        self.entries(self.structure.importFromXml(xmlstr));        
        self.decorator.inputHeightMatchAll();
        self.toggleSorting(self.structure.importIsLocked());
    };

    self.setUpdateOnlyFlag = function(object, event) {
        self.structure.exportUpdateOnly(event.target.checked);
    };
    
    self.toggleUpdateOnly = function() {
        if (self.structure.importIsLocked() === false) {
            self.structure.editUpdateOnly(!self.structure.editUpdateOnly());
            self.toggleSorting(event.target.checked);
            self.setAvailableSection();
            self.structure.lockInfoText('You are working in Update Metatada Only mode. To add, delete article or edit Content Source section please press unlock button.');
        }
    };
    
    self.toggleSorting = function(disable) {
        var state = disable ? "disable" : "enable";
        $('#metadata-table ol, #content-source-table ol').sortable(state);
    };

    //read xmlfile provided to file input field
    self.readXmlFile = function(obj, evt) {
        self.reader.readXmlFile(obj, evt, self.importSidecarData);
        //reset input selection
        $('#importfileform')[0].reset();
    };
    
    self.importIconFile = function(obj, evt) {
        self.reader.readIconFile(obj, evt, self.structure.addIcon);
        $('.toc-import-form').each(function(idx, form){
            form.reset();
        });
    };

    /**
     * Trigger click of file input
     */
    self.showImportBox = function() {
        $('#sidecar_file').trigger('click');
    };
    
    self.showImportIconFile = function(obj, evt) {
        var index = self.entries().indexOf(obj);
        $('#toc-file-' + index).trigger('click');
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
        new Section('Metadata', self.selectedSection, null, self, false),
        new Section('Content Source', self.selectedSection, null, self, true),
        new Section('XML Code', self.selectedSection, self.generateSidecar, self, true)
    ]);

    //inialize to the first section
    self.selectedSection(self.sections()[0]);
    
    self.selectSection = function(section, event) {
        if (!section.isBlocked()) {
            self.selectedSection(section);
        }
    };
    
    //select new section if is not blocked by metada update only mode
    self.setAvailableSection = function() {
        if (self.selectedSection().isBlocked()) {
            ko.utils.arrayForEach(self.sections(), function(section) {
                if (section.isBlocked() === false) {
                    self.selectedSection(section);
                    return;
                }
            });
        }
    };

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

var error = new Error({view: viewModel, delay: 5000});