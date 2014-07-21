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
        article_access: ko.observable(['free']),
        hide: ko.observable(false)
    };
    
    self.exportUpdateOnly = ko.observable(false);
    self.editUpdateOnly = ko.observable(false);
    self.importIsLocked = ko.observable(false);
    self.lockInfoText = ko.observable("");
    
    self.outputHeaderString = "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\" ?>\r\n\
<!--\r\n\
sidecar.xml generated using http://inplus.io/sidecar-xml\r\n\
Version 0.1 beta\r\n\
To edit this sidecar, import it into the generator again.\r\n\
 -->";

    /**
     * Generate xml code from table data
     */
    self.generateXml = function(entries, withToc) {
        if (self.exportUpdateOnly() === true) {
            var sidecarObj = {sidecar: {metadataUpdateOnly: null, entry: []}};
        }
        else {
            var sidecarObj = {sidecar: {entry: []}};
        }
        var x2js = new X2JS({escapeMode: false});
        ko.utils.arrayForEach(entries, function(item, idx) {
            var entry = self.prepareJsonObject(item, withToc);
            sidecarObj.sidecar.entry.push(entry);
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
            var locked = jsonObj.sidecar.hasOwnProperty('metadataUpdateOnly');
            self.exportUpdateOnly(locked);
            self.editUpdateOnly(locked);
            self.importIsLocked(locked);
            self.lockInfoText('This file has been set in Update Metatada Only mode. You cannot add, delete and sort articles or edit Content Source section.');
            if (!(jsonObj.sidecar.entry instanceof Array)) {
                //there is only one entry
                jsonObj.sidecar.entry = [jsonObj.sidecar.entry];
            }
            ko.utils.arrayForEach(jsonObj.sidecar.entry, function(item, idx) {
                var rowData = self.importEntriesDataFromXml(item);
                collection.push(new SidecarRow(rowData));
            });
        }

        return collection;
    };

    /**
     * Convert fields object to structure ready to be xmlized
     */
    self.prepareJsonObject = function(item, withToc) {
        var entry = item.entry();
        var tocNodeContent = entry.toc_image() != "" ? entry.toc_image() : null;
        if (withToc === false && tocNodeContent !== null) {
            tocNodeContent = tocNodeContent.substr(0, tocNodeContent.indexOf(';'));
        }
        var object = {
            contentSource: {
                tocPreview: tocNodeContent,
                articleName: "<![CDATA[" + entry.article_name() + "]]>",
                sourceFormat: entry.source_format(),
                customTocIcon: entry.custom_toc_icon() != "" ? "<![CDATA[" + entry.custom_toc_icon() + "]]>" : null,
                sourceFile_v: {
                    location: entry.vertical_file_location() != "" ? "<![CDATA[" + entry.vertical_file_location() + "]]>" : null,
                    layoutName: entry.vertical_file_layout_name() != "" ? "<![CDATA[" + entry.vertical_file_layout_name() + "]]>" : null
                },
                sourceFile_h: {
                    location: entry.horizontal_file_location() != "" ? "<![CDATA[" + entry.horizontal_file_location() + "]]>" : null,
                    layoutName: entry.horizontal_file_layout_name() != "" ? "<![CDATA[" + entry.horizontal_file_layout_name() + "]]>" : null
                }
            },
            articleTitle: entry.article_title() != "" ? "<![CDATA[" + entry.article_title() + "]]>" : null,
            author: entry.author() != "" ? "<![CDATA[" + entry.author() + "]]>" : null,
            kicker: entry.kicker() != "" ? "<![CDATA[" + entry.kicker() + "]]>" : null,
            description: entry.description() != "" ? "<![CDATA[" + entry.description() + "]]>" : null,
            tags: entry.tags() != "" ? "<![CDATA[" + entry.tags() + "]]>" : null,
            isAd: entry.ads(),
            smoothScrolling: entry.smooth_scrolling(),
            isFlattenedStack: entry.flattened_stack(),
            articleAccess: entry.article_access(),
            hideFromTOC: entry.hide()
        };

        return object;
    };

    /**
     * Convert xml json object to flat fields object
     */
    self.importEntriesDataFromXml = function(item) {
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
            article_access: ko.observable([item.articleAccess]),
            hide: ko.observable(item.hideFromTOC === 'true')
        };

        return rowData;
    };
}