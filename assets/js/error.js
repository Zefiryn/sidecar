var Error = function Error(args){
    this.initialize(args);
    return this;
};    

Error.prototype = {
    initialize: function(args) {
        this.viewModel = args.view;
        this.messageDelay = args.delay;
        this.timer = null;
        this.startingPadding = parseInt($('.container').css('paddingTop').replace('px',''));
    },
    
    addMessage: function(message, type) {
        this.viewModel.message(message);
        this.viewModel.messageType(type);
        this.setDisplay();
        this.setTimer();
    },
    
    hideMessage: function() {
        this.viewModel.message('');
        this.viewModel.messageType('');
        this.setDisplay();
    },
    
    setTimer: function() {
        if (this.timer !== null) {
            clearTimeout(this.timer);
        }
        this.timer = setTimeout($.proxy(this.hideMessage, this), this.messageDelay);
    },
    
    setDisplay: function() {
        var height = $('ul.messages:nth-child(3)').is(':visible') ? $('ul.messages').height() : 0;
        $('section.container').css('paddingTop', this.startingPadding + height + 'px');
    }
};