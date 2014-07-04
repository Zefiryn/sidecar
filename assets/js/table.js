// Class to represent a row in the sidecar xml file
function SidecarRow(row) {
    var self = this;    
    self.row = ko.observable(row);
}

// Overall viewmodel for this screen, along with the initial state
function SidecarViewModel() {
    var self = this;
    
    self.sourceFormats = ko.observableArray([
            {value: 'indd', label: 'InDesign'},
            {value: 'html', label: 'HTML'}
        ]);

    // Empty row with default data
    self.fileRows = [
        {
          article_name: "",
          source_format : ['indd'],
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
      var newViewModel = new SidecarViewModel();
      self.rowsCollection.push(new SidecarRow(newViewModel.fileRows[0]));
    };
    
    self.removeRow = function(row) {
      self.rowsCollection.remove(row);
    };
    
    // Generate xml file
    self.generateSidecar = function() {
      var sidecarObj = {sidecar: {entry: []}};
      var x2js = new X2JS({escapeMode: false});
      ko.utils.arrayForEach(self.rowsCollection(), function(item, idx) {
        var row = {
          contentSource: {
            articleName: item.row().article_name,
            sourceFormat: item.row().source_format,
            customTocIcon: item.row().custom_toc_icon,
            sourceFile_v: {
              location: item.row().vertical_file_location,
              layoutName: item.row().vertical_file_layout_name
            },
            sourceFile_h: {
              location: item.row().horizontal_file_location,
              layoutName: item.row().horizontal_file_layout_name
            }
          },
          articleTitle: item.row().article_title,
          author: item.row().author,
          kicker: item.row().kicker,
          description: item.row().description,
          tags: item.row().tags,
          isAd: item.row().ads,
          smoothScrolling: item.row().smooth_scrolling,
          isFlattenedStack: item.row().flattened_stack,
          articleAccess: item.row().article_access
        };
        sidecarObj.sidecar.entry.push(row);
      });
      
      var sidecarXmlString = x2js.json2xml_str(sidecarObj);      
      self.generatedXML(formatXml(sidecarXmlString));
    };
    
    self.importSidecarData = function(xmlstr) {
        var x2js = new X2JS({escapeMode: false});
        var jsonObj = x2js.xml_str2json(xmlstr);
        
        self.rowsCollection.removeAll();
        ko.utils.arrayForEach(jsonObj.sidecar.entry, function(item, idx) {
            var contentSource = item.contentSource;
            var sourceFile = {  v: contentSource.sourceFile_v !== undefined ? contentSource.sourceFile_v : {},
                                h: contentSource.sourceFile_h !== undefined ? contentSource.sourceFile_h : {}};
            var rowData = {article_name: contentSource.articleName,
                            source_format : [contentSource.sourceFormat],
                            custom_toc_icon : contentSource.customTocIcon,
                            vertical_file_location : sourceFile.v.hasOwnProperty('location') ? sourceFile.v.location : '',
                            vertical_file_layout_name : sourceFile.v.hasOwnProperty('layoutName') ? sourceFile.v.layoutName : '',
                            horizontal_file_location : sourceFile.h.hasOwnProperty('location') ? sourceFile.h.location : '',
                            horizontal_file_layout_name : sourceFile.h.hasOwnProperty('layoutName') ? sourceFile.h.layoutName : '',
                            article_title : item.articleTitle,
                            author : item.author,
                            kicker : item.kicker,
                            description : item.description,
                            tags : item.tags,
                            ads : item.isAd === 'true',
                            smooth_scrolling : item.smoothScrolling,
                            flattened_stack : item.isFlattenedStack === 'true',
                            article_access : item.articleAccess
                          };
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