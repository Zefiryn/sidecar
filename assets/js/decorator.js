//Class that hanldes different decorating functions
function Decorator() {
  
  var self = this;
  
  //default height of textarea and input elements
  self.defaultInputHeight = 40;

  /**
   * Add line numbers and colorize xml code output
   */
  self.outputCodeDecoration = function() {
      //self.addCodeLines($('.output'));
      self.colorize($('.output code')[0]);
  };
  
  self.addCodeLines = function(element) {
      element.find('.line-number, .cl').remove();
      var codeElement = element.find('pre code');
      codeElement.before('<span class="line-number"></span>');
      codeElement.after('<span class="cl"></span>');
      var rows = codeElement.text().split(/\n/).length;
                  
      var line_num = $('span.line-number')[0];
      var lines = '';
      for (var j = 0; j < rows; j++) {          
          lines += '<span>' + (j + 1) + '</span>';
      }
      line_num.innerHTML = lines;
  };
  
  self.colorize = function(elem) {
      if (hljs !== undefined) {
          hljs.highlightBlock(elem);
      }
  };
  
  /**
   * Synbc height of all textarea and input fields in the same row when typing
   */
  self.inputHeightMatch = function(event) {
      var element = event.target;
      var maxElemHeight = 0;
      var row = $('#' + $(element).closest('tr').attr('id'));
      row.find('textarea, input[type="check"]').outerHeight(self.defaultInputHeight);
      row.find('textarea, input[type="check"]').each(function(){        
        if (this.scrollHeight > maxElemHeight) {
          maxElemHeight = this.scrollHeight;
        }
      });
      //match height of all elements in this row
      row.find('textarea, input[type="check"]').outerHeight(maxElemHeight);
      
  }
}