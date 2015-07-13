var Custom = Custom || {};

Custom.foldable_button_bg_texture_name = 'res/backtotoppressed.png';
Custom.foldable_button_font_size = 20;

Custom.Item = ccui.Layout.extend({
    ctor : function(name) {
        this._super();
        this._init_item();
        this.custom_button.setTitleText(name);
    },

    _init_item : function() {
        this.custom_button = new ccui.Button();
        this.custom_button.setTouchEnabled(true);
        this.custom_button.setTitleFontSize(Custom.foldable_button_font_size);
        this.custom_button.loadTextureNormal(Custom.foldable_button_bg_texture_name);
        this.custom_button.setAnchorPoint(0,0);

        var custom_button_bounding_box = this.custom_button.getBoundingBox();
        var bounding_box_width = custom_button_bounding_box.width;
        var bounding_box_height = custom_button_bounding_box.height;
        cc.log('bounding_box_height : '+bounding_box_height);
//        this.half_width = bounding_box_width >> 1;
        this.setTouchEnabled(true);
        this.setContentSize(this.custom_button.getContentSize());
        this.addChild(this.custom_button);
//        this.custom_button.y = bounding_box_height >> 1;
//        this.retain();
    },
});