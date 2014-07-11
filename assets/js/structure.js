//Class that fold sidecar file structure and manipulation
function sidecarStructure() {
    // Empty row with default data
    var self = this;
    
    self.sourceFormats = [
        {value: 'indd', label: 'InDesign'},
        {value: 'html', label: 'HTML'}
    ];
    
    self.fields = [
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
    
    /**
     * Convert fields object to structure ready to be xmlized
     */
    self.convert = function(item) {
        var object = {
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
        
        return object;
    };
    
    /**
     * Convert xml json object to flat fields object
     */
    self.importFromXmlObject = function(item) {
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
                      
        return rowData;
    };
}