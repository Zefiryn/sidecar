//Class that handles reading files
function fileReader() {
    var self = this;
    
    /**
     * Read selected file and call provided callback function on the result
     */
    self.readXmlFile = function(obj, evt, callback) {
        var file = evt.target.files[0]; 
        if (file.type.match('text.*')) {
            var reader = self.createReader(obj, callback, file);
            reader.readAsText(file);
        }
        else {
            error.addMessage('Incorrect file type', 'error');
        }
    };
    
    self.readIconFile = function(obj, evt, callback) {
        var file = evt.target.files[0]; 
        if (file.type.match('image.*')) {
            var reader = self.createReader(obj, callback, file);
            reader.readAsBinaryString(file);
        }
        else {
            error.addMessage('Incorrect file type', 'error');
        }
    };
    
    self.createReader = function(obj, callback, file) {
        var reader = new FileReader();
        reader.onloadend = (function(f){
            return function(e) {
                callback(e.target.result, obj);
            };
        })(file);        
        return reader;
    };

}