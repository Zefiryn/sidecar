//Class that handles reading files
function fileReader() {
    var self = this;
    
    self.readXmlFile = function(obj, evt, callback) {
        var file = evt.target.files[0]; 
        if (file.type.match('text.*')) {
            var reader = new FileReader();
            reader.onloadend = (function(f){
                return function(e) {
                    callback(e.target.result);
                };
            })(file);
            reader.readAsText(file);
        }
        else {
            alert('Incorrect file type');
        }
    };

}