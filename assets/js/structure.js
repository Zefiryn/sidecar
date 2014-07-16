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
        toc_image: ko.observable(""),
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
    
    self.updateOnly = ko.observable(false);
    
    self.outputHeaderString = "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\" ?>\r\n\
<!--\r\n\
sidecar.xml generated using http://inplus.io/sidecar-xml\r\n\
Version 0.1 beta\r\n\
To edit this sidecar, import it into the generator again.\r\n\
 -->";

    /**
     * Generate xml code from table data
     */
    self.generateXml = function(rowsCollection) {
        if (self.updateOnly() === true) {
            var sidecarObj = {sidecar: {metadataUpdateOnly: null, entry: []}};
        }
        else {
            var sidecarObj = {sidecar: {entry: []}};
        }
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
        var collection = [];
        var x2js = new X2JS({escapeMode: false});
        var jsonObj = x2js.xml_str2json(xmlstr);
        if (jsonObj === null) {
            var structure = new sidecarStructure();
            collection.push(new SidecarRow(structure.fields));
        }
        else {            
            self.updateOnly(jsonObj.sidecar.hasOwnProperty('metadataUpdateOnly'));
            if (!(jsonObj.sidecar.entry instanceof Array)) {
                //there is only one entry
                jsonObj.sidecar.entry = [jsonObj.sidecar.entry];
            }
            ko.utils.arrayForEach(jsonObj.sidecar.entry, function(item, idx) {
                var rowData = self.importRowDataFromXml(item);
                collection.push(new SidecarRow(rowData));
            });
        }

        return collection;
    };

    /**
     * Convert fields object to structure ready to be xmlized
     */
    self.prepareJsonObject = function(item) {
        var row = item.row();
        var object = {
            contentSource: {
                tocPreview: row.toc_image() ? row.toc_image() : null,
                articleName: "<![CDATA[" + row.article_name() + "]]>",
                sourceFormat: row.source_format(),
                customTocIcon: row.custom_toc_icon() ? "<![CDATA[" + row.custom_toc_icon() + "]]>" : null,
                sourceFile_v: {
                    location: row.vertical_file_location() ? "<![CDATA[" + row.vertical_file_location() + "]]>" : null,
                    layoutName: row.vertical_file_layout_name() ? "<![CDATA[" + row.vertical_file_layout_name() + "]]>" : null
                },
                sourceFile_h: {
                    location: row.horizontal_file_location() ? "<![CDATA[" + row.horizontal_file_location() + "]]>" : null,
                    layoutName: row.horizontal_file_layout_name() ? "<![CDATA[" + row.horizontal_file_layout_name() + "]]>" : null
                }
            },
            articleTitle: row.article_title() ? "<![CDATA[" + row.article_title() + "]]>" : null,
            author: row.author() ? "<![CDATA[" + row.author() + "]]>" : null,
            kicker: row.kicker() ? "<![CDATA[" + row.kicker() + "]]>" : null,
            description: row.description() ? "<![CDATA[" + row.description() + "]]>" : null,
            tags: row.tags() ? "<![CDATA[" + row.tags() + "]]>" : null,
            isAd: row.ads(),
            smoothScrolling: row.smooth_scrolling(),
            isFlattenedStack: row.flattened_stack(),
            articleAccess: row.article_access()
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
        var tocpreview = '';
        if (contentSource.tocPreview !== undefined && contentSource.tocPreview !== "") {
            tocpreview =  "data:image/jpeg;base64," + contentSource.tocPreview;
        }
        
        var rowData = {
            toc_image: ko.observable(tocpreview),
            article_name: ko.observable(contentSource.articleName),
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