var Custom = Custom || {};

Custom.normal_button_bg_texture_name = '2014-1-26 11-42-09.png';
Custom.bar_texture_name = '2014-1-26 11-43-52.png';


// make sure (target inner content size) > (two target.item content size)
Custom.ScrollBar = ccui.Layout.extend({
    ctor : function(relative_width, relative_height, direction, target) {
        this._super();
        this.bar_width = relative_width;
        this.bar_height = relative_height;
        this.direction = direction;
        this.target = target;

        this._init_bar_slider();
        this._init_status();
        this.scheduleUpdate();
    },

    _init_bar_slider : function() {
        this.custom_slider = new ccui.Button();
        this.custom_slider.setTouchEnabled(true);
        this.custom_slider.addTouchEventListener(this._scrollbar_touch, this);
        this.custom_slider.setScale9Enabled(true);
        this.custom_slider.loadTextureNormal(Custom.normal_button_bg_texture_name,ccui.Widget.PLIST_TEXTURE);
        this.custom_slider.setAnchorPoint(0,0);
        if (this.direction == ccui.ScrollView.DIR_HORIZONTAL) {
            this.custom_slider.setContentSize(this.bar_width * 0.1, this.bar_height);

        } else if (this.direction == ccui.ScrollView.DIR_VERTICAL) {
            this.custom_slider.setContentSize(this.bar_width, this.bar_height * 0.1);
        }

        this.custom_bar = new ccui.ImageView();
        this.custom_bar.setTouchEnabled(true);
        this.custom_bar.addTouchEventListener(this._scrollbar_touch, this);
        this.custom_bar.setScale9Enabled(true);
        this.custom_bar.loadTexture(Custom.bar_texture_name, ccui.Widget.PLIST_TEXTURE);
        this.custom_bar.setContentSize(this.bar_width, this.bar_height);
        this.custom_bar.setAnchorPoint(0,0);

        this.setContentSize(this.bar_width, this.bar_height);
        this.addChild(this.custom_bar);
        this.addChild(this.custom_slider);
    },

    _init_status : function() {
        this.current_percent = 0;
        this.slider_touch_begin_pos = cc.p(0, 0);// to ndoe space
        this.slider_touch_move_pos = cc.p(0, 0);
        this.slider_touch_end_pos = cc.p(0, 0);
        this.slider_size = this.custom_slider.getContentSize();
        this.slider_move_max_width = 0;
        this.slider_move_max_height = 0;
        this.target_inner_size = cc.size(0, 0);
        if (this.direction == ccui.ScrollView.DIR_VERTICAL) {
            this.set_percent(0);
        }
    },

    _scrollbar_touch : function(sender, type) {
        if (sender == this.custom_slider) {
            if (type == ccui.Widget.TOUCH_BEGAN) {
                this.slider_touch_begin_pos = cc.pSub(this.custom_slider.getTouchBeganPosition(),
                        this.custom_slider.getWorldPosition());

            } else if (type == ccui.Widget.TOUCH_MOVED) {
                var move_pos = this.custom_slider.getTouchMovePosition();
                move_pos.x -= this.slider_touch_begin_pos.x;
                move_pos.y -= this.slider_touch_begin_pos.y;
                this.slider_touch_move_pos = this.convertToNodeSpace(move_pos);
                if (this.direction == ccui.ScrollView.DIR_HORIZONTAL) {
                    var move_length = this.slider_touch_move_pos.x
                    this.slider_move_max_width = this.bar_width - this.custom_slider.getContentSize().width;
                    if (move_length > this.slider_move_max_width) {
                        move_length = this.slider_move_max_width;
                    } else if (move_length < 0) {
                        move_length = 0;
                    }
                    this.custom_slider.x = move_length;

                } else if (this.direction == ccui.ScrollView.DIR_VERTICAL) {
                    var move_height = this.slider_touch_move_pos.y;
                    this.slider_move_max_height = this.bar_height - this.custom_slider.getContentSize().height;
                    if (move_height > this.slider_move_max_height) {
                        move_height = this.slider_move_max_height;
                    } else if (move_height < 0) {
                        move_height = 0;
                    }
                    this.custom_slider.y = move_height;
                }
                this._update_percent();
            }

        } else {// sender == this.custom_bar
            if (type == ccui.Widget.TOUCH_BEGAN) {
                var bar_touch_pos = this.convertToNodeSpace(this.custom_bar.getTouchBeganPosition());
                if (this.direction == ccui.ScrollView.DIR_HORIZONTAL) {
                    var offset_x = bar_touch_pos.x;
                    if (offset_x > this.custom_slider.x) {
                        // because stop to slider's edge is engough and slider.anchorX = 0 so unnecessary to add width
                        offset_x -= this.custom_slider.getContentSize().width;
                    }
                    this.custom_slider.x = offset_x;

                } else if (this.direction == ccui.ScrollView.DIR_VERTICAL) {
                    var offset_y = bar_touch_pos.y;
                    if (offset_y > this.custom_slider.y) {
                        offset_y -= this.custom_slider.getContentSize().height;
                    }
                    this.custom_slider.y = offset_y;
                }
                this._update_percent();
            }
        }
    },

    _update_percent : function() {
        if (this.direction == ccui.ScrollView.DIR_HORIZONTAL) {
            var calculate_width = this.bar_width - this.custom_slider.getContentSize().width;
            this.current_percent = this.custom_slider.x / calculate_width;
            this.target.scrollToPercentHorizontal(this.current_percent * 100, 0.001, false);

        } else if (this.direction == ccui.ScrollView.DIR_VERTICAL) {
            var calculate_height = this.bar_height - this.custom_slider.getContentSize().height;
            this.current_percent = 1 - this.custom_slider.y / calculate_height;
            this.target.scrollToPercentVertical(this.current_percent * 100, 0.001, false);
        }
    },

    update_scroll_bar : function() {
        if (this.target.getItems().length > 1) {
            if (this.direction == ccui.ScrollView.DIR_HORIZONTAL && (this.target_inner_size.width != this.target.getInnerContainerSize().width)) {
                this.target_inner_size.width = this.target.getInnerContainerSize().width;
                var ratio_width = this.target.getContentSize().width / this.target.getInnerContainerSize().width;
                if (ratio_width >= 1) {
                    ratio_width = 1;
                    this.setVisible(false);
                } else {
                    this.setVisible(true);
                    this.custom_slider.setContentSize(this.bar_width * ratio_width, this.bar_height);
                }

            } else if (this.direction == ccui.ScrollView.DIR_VERTICAL && (this.target_inner_size.height != this.target.getInnerContainerSize().height)) {
                this.target_inner_size.height = this.target.getInnerContainerSize().height;
                var ratio_height = this.target.getContentSize().height / this.target.getInnerContainerSize().height;
                if (ratio_height >= 1) {
                    ratio_height = 1;
                    this.setVisible(false);
                } else {
                    this.setVisible(true);
                    this.custom_slider.setContentSize(this.bar_width, this.bar_height * ratio_height);
                }
            }
            this.set_percent(this.get_target_percent());

        } else {
            this.setVisible(false);
            this.custom_slider.setContentSize(this.bar_width, this.bar_height);
            this.set_percent(100);
        }
    },

    // also use for scroll view and extend scroll view, because they have not get percent function
    get_target_percent : function() {
        var percent = 100;
        if (this.direction == ccui.ScrollView.DIR_HORIZONTAL) {
            var w = this.target.getInnerContainerSize().width - this.target.getContentSize().width;
            var inner_pos_x = Math.abs(this.target.getInnerContainer().getPositionX());
            if (w != 0) {
                percent = inner_pos_x / w * 100;
            }

        } else if (this.direction == ccui.ScrollView.DIR_VERTICAL) {
            var h = this.target.getInnerContainerSize().height - this.target.getContentSize().height;
            var inner_pos_y = Math.abs(this.target.getInnerContainer().getPositionY());
            if (h != 0) {
                percent = (1 - inner_pos_y / h) * 100;
            }
        }
        return percent;
    },

    update : function() {
        this.update_scroll_bar();
    },

    set_custom_update : function() {
        this.unscheduleUpdate();
    },

    get_percent : function() {
        return this.current_percent * 100;
    },

    set_percent : function(percent) {
        var p = percent;
        if (percent > 100) {
            p = 100;
        } else if (percent < 0) {
            p = 0;
        }
        this.current_percent = p / 100.0;
        if (this.direction == ccui.ScrollView.DIR_HORIZONTAL) {
            var offset_x = (this.bar_width - this.custom_slider.getContentSize().width) * this.current_percent;
            this.custom_slider.x = offset_x;

        } else if (this.direction == ccui.ScrollView.DIR_VERTICAL) {
            var offset_y = (this.bar_height - this.custom_slider.getContentSize().height) * (1 - this.current_percent);
            this.custom_slider.y = offset_y;
        }
    },
});