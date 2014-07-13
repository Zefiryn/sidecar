//Class that fold sidecar file structure and manipulation
function sidecarStructure() {
    var self = this;

    self.sourceFormats = [
        {value: 'indd', label: 'InDesign'},
        {value: 'html', label: 'HTML'}
    ];

    self.accessOptions = [
        {value: 'free', label: 'Free'},
        {value: 'metered', label: 'Metered'},
        {value: 'protected', label: 'Protected'}
    ];

    self.fields = {
        article_name: ko.observable(""),
        source_format: ko.observable(['indd']),
        custom_toc_icon: ko.observable(""),
        vertical_file_location: ko.observable(""),
        vertical_file_layout_name: ko.observable(""),
        horizontal_file_location: ko.observable(""),
        horizontal_file_layout_name: ko.observable(""),
        article_title: ko.observable(""),
        author: ko.observable(""),
        kicker: ko.observable(""),
        description: ko.observable(""),
        tags: ko.observable(""),
        ads: ko.observable(true),
        smooth_scrolling: ko.observable('never'),
        flattened_stack: ko.observable(false),
        article_access: ko.observable(['free'])
    };
    
    self.outputHeaderString = "<!--\r\n\
sidecar.xml generated using http://inplus.io/sidecar-xml\r\n\
Version 0.1 beta\r\n\
To edit this sidecar, import it into the generator again.\r\n\
 -->\r\n\
<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"true\" ?>";

    /**
     * Generate xml code from table data
     */
    self.generateXml = function(rowsCollection) {
        var sidecarObj = {sidecar: {entry: []}};
        var x2js = new X2JS({escapeMode: false});
        ko.utils.arrayForEach(rowsCollection, function(item, idx) {
            var row = self.prepareJsonObject(item);
            sidecarObj.sidecar.entry.push(row);
        });

        var sidecarXmlString = x2js.json2xml_str(sidecarObj);
        return $.trim(formatXml(self.outputHeaderString + "\r\n" + sidecarXmlString));
    };

    /**
     * Read xml string and convert it into collection of elements
     */
    self.importFromXml = function(xmlstr) {
        var x2js = new X2JS({escapeMode: false});
        var jsonObj = x2js.xml_str2json(xmlstr);
        var collection = [];

        ko.utils.arrayForEach(jsonObj.sidecar.entry, function(item, idx) {
            var rowData = self.importRowDataFromXml(item);
            collection.push(new SidecarRow(rowData));
        });

        return collection;
    };

    /**
     * Convert fields object to structure ready to be xmlized
     */
    self.prepareJsonObject = function(item) {
        var object = {
            contentSource: {
                articleName: item.row().article_name(),
                sourceFormat: item.row().source_format(),
                customTocIcon: item.row().custom_toc_icon(),
                sourceFile_v: {
                    location: item.row().vertical_file_location(),
                    layoutName: item.row().vertical_file_layout_name()
                },
                sourceFile_h: {
                    location: item.row().horizontal_file_location(),
                    layoutName: item.row().horizontal_file_layout_name()
                }
            },
            articleTitle: item.row().article_title(),
            author: item.row().author(),
            kicker: item.row().kicker(),
            description: item.row().description(),
            tags: item.row().tags(),
            isAd: item.row().ads(),
            smoothScrolling: item.row().smooth_scrolling(),
            isFlattenedStack: item.row().flattened_stack(),
            articleAccess: item.row().article_access()
        };

        return object;
    };

    /**
     * Convert xml json object to flat fields object
     */
    self.importRowDataFromXml = function(item) {
        var contentSource = item.contentSource;
        var sourceFile = {v: contentSource.sourceFile_v !== undefined ? contentSource.sourceFile_v : {},
            h: contentSource.sourceFile_h !== undefined ? contentSource.sourceFile_h : {}};
        var rowData = {article_name: ko.observable(contentSource.articleName),
            source_format: ko.observable([contentSource.sourceFormat]),
            custom_toc_icon: ko.observable(contentSource.customTocIcon),
            vertical_file_location: ko.observable(sourceFile.v.hasOwnProperty('location') ? sourceFile.v.location : ''),
            vertical_file_layout_name: ko.observable(sourceFile.v.hasOwnProperty('layoutName') ? sourceFile.v.layoutName : ''),
            horizontal_file_location: ko.observable(sourceFile.h.hasOwnProperty('location') ? sourceFile.h.location : ''),
            horizontal_file_layout_name: ko.observable(sourceFile.h.hasOwnProperty('layoutName') ? sourceFile.h.layoutName : ''),
            article_title: ko.observable(item.articleTitle),
            author: ko.observable(item.author),
            kicker: ko.observable(item.kicker),
            description: ko.observable(item.description),
            tags: ko.observable(item.tags),
            ads: ko.observable(item.isAd === 'true'),
            smooth_scrolling: ko.observable(item.smoothScrolling),
            flattened_stack: ko.observable(item.isFlattenedStack === 'true'),
            article_access: ko.observable([item.articleAccess])
        };

        return rowData;
    };
}