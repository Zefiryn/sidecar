//Class that hanldes different decorating functions
function Decorator() {
	
	var self = this;
	self.defaultInputHeight = 45;

	self.outputCodeDecoration = function(codeText) {
			$('.output .line-number, .output .cl').remove();
			$('pre code').before('<span class="line-number"></span>');
			$('pre code').after('<span class="cl"></span>');
			var num = codeText.split(/\n/).length;
			for (var j = 0; j < num; j++) {
					var line_num = $('span.line-number')[0];
					line_num.innerHTML += '<span>' + (j + 1) + '</span>';
			}
	};
	
	self.inputHeightMatch = function(event) {
			var element = event.target;
			var elemHeight = element.scrollHeight;
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