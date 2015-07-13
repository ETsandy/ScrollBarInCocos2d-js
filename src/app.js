
var HelloWorldLayer = cc.LayerColor.extend({
    sprite:null,
    ctor:function () {
        this._super(cc.color(255,243,0,255));
        cc.spriteFrameCache.addSpriteFrames('res/plist/scrollbar.plist');

        this.list_view_h_counter = 0;
        this.list_view_v_counter = 0;

        this._init_list_view();
        this._init_page_view();
        this._init_scrollbar();
        this._init_button();
    },

    _init_list_view : function() {
        this.list_view = new ccui.ListView();
        this.list_view.setDirection(ccui.ScrollView.DIR_HORIZONTAL);
        this.list_view.setBounceEnabled(false);
        this.list_view.setInertiaScrollEnabled(false);
        this.list_view.setTouchEnabled(true);
        this.list_view.addTouchEventListener(this._list_view_touch, this);
        this.list_view.setBackGroundColorType(ccui.Layout.BG_COLOR_SOLID);
        this.list_view.setBackGroundColor(cc.color(91, 0, 255, 255));
        this.list_view.setItemsMargin(5);
        this.list_view.setContentSize(cc.size(300, 100));
        this.list_view.setPosition(480, 130);
        this.addChild(this.list_view);
        for (var i = 0; i < 5; i++) {
            this.list_view_h_counter ++;
            var item = new Custom.Item(this.list_view_h_counter);
            this.list_view.pushBackCustomItem(item);
        }

        this.list_view_vertical = new ccui.ListView();
        this.list_view_vertical.setDirection(ccui.ScrollView.DIR_VERTICAL);
        this.list_view_vertical.setBounceEnabled(false);
        this.list_view_vertical.setInertiaScrollEnabled(false);
        this.list_view_vertical.setTouchEnabled(true);
        this.list_view_vertical.addTouchEventListener(this._list_view_touch, this);
        this.list_view_vertical.setBackGroundColorType(ccui.Layout.BG_COLOR_SOLID);
        this.list_view_vertical.setBackGroundColor(cc.color(91, 0, 255, 255));
        this.list_view_vertical.setItemsMargin(5);
        this.list_view_vertical.setContentSize(cc.size(150, 200));
        this.list_view_vertical.setPosition(30, 70);
        this.addChild(this.list_view_vertical);
        this.list_view_vertical.setInnerContainerSize(cc.size(150, -5));
        cc.log('list_view_vertical: '+this.list_view_vertical.getInnerContainerSize().height);
        this.scheduleOnce(function() {
            this.list_view_vertical.setInnerContainerSize(cc.size(150, -5));
            cc.log(this.list_view_vertical.getInnerContainerSize().height);
        }.bind(this));
    },

    _init_page_view : function() {
        this.page_view = new ccui.PageView();
        this.page_view.setTouchEnabled(true);
        this.page_view.setContentSize(240,130);
        this.page_view.setPosition(220, 70);
        this.addChild(this.page_view);

        for (var i = 0; i < 3; ++i) {
            var layout = new ccui.Layout();
            layout.setContentSize(cc.size(240, 130));
            var layoutRect = layout.getContentSize();

            var imageView = new ccui.ImageView();
            imageView.setTouchEnabled(true);
            imageView.setScale9Enabled(true);
            imageView.loadTexture("res/scrollviewbg.png");
            imageView.setContentSize(cc.size(240, 130));
            imageView.x = layoutRect.width / 2;
            imageView.y = layoutRect.height / 2;
            layout.addChild(imageView);

            var text = new ccui.Text();
            text.string = "page" + (i + 1);
            text.font = "30px 'Marker Felt'";
            text.color = cc.color(192, 192, 192);
            text.x = layoutRect.width / 2;
            text.y = layoutRect.height / 2;
            layout.addChild(text);

            this.page_view.addPage(layout);
        }
    },

    _init_scrollbar : function() {
        this.sb = new Custom.ScrollBar(300, 20, ccui.ScrollView.DIR_HORIZONTAL, this.list_view);
//      this.sb.setRotation(90);
        this.sb.setPosition(480, 100);
        this.addChild(this.sb);

        this.sb_v = new Custom.ScrollBar(20, 200, ccui.ScrollView.DIR_VERTICAL, this.list_view_vertical);
        this.sb_v.setPosition(180, 70);
        this.addChild(this.sb_v);
    },

    _init_button : function() {
        this.l_v_h_add = new Custom.Item('add item');
        this.l_v_h_add.setPosition(480, 300);
        this.l_v_h_add_b = this.l_v_h_add.custom_button;
        this.l_v_h_add_b.addTouchEventListener(this._button_h_touch, this);
        this.addChild(this.l_v_h_add);

        this.l_v_h_sub = new Custom.Item('sub item');
        this.l_v_h_sub.setPosition(660, 300);
        this.l_v_h_sub_b = this.l_v_h_sub.custom_button;
        this.l_v_h_sub_b.addTouchEventListener(this._button_h_touch, this);
        this.addChild(this.l_v_h_sub);

        this.l_v_v_add = new Custom.Item('add item');
        this.l_v_v_add.setPosition(0, 300);
        this.l_v_v_add_b = this.l_v_v_add.custom_button;
        this.l_v_v_add_b.addTouchEventListener(this._button_v_touch, this);
        this.addChild(this.l_v_v_add);

        this.l_v_v_sub = new Custom.Item('sub item');
        this.l_v_v_sub.setPosition(100, 300);
        this.l_v_v_sub_b = this.l_v_v_sub.custom_button;
        this.l_v_v_sub_b.addTouchEventListener(this._button_v_touch, this);
        this.addChild(this.l_v_v_sub);
    },

    _list_view_touch : function(sender, type) {
        if (sender == this.list_view) {
            if (type == ccui.Widget.TOUCH_MOVED) {
//                this.sb.update_scroll_bar();
            }
        }
    },

    _button_h_touch : function(sender, type) {
        if (sender == this.l_v_h_add_b) {
            if (type == ccui.Widget.TOUCH_BEGAN) {
                this.list_view_h_counter ++;
                var item = new Custom.Item(this.list_view_h_counter);
                this.list_view.pushBackCustomItem(item);
                cc.log('h : '+item.getContentSize().height);
                item.setTouchEnabled(false);
                this.scheduleOnce(function() {
//                    this.sb.update_scroll_bar();
                }.bind(this));
            }

        } else if (sender == this.l_v_h_sub_b) {
            if (type == ccui.Widget.TOUCH_BEGAN) {
                if (this.list_view_h_counter > 0) {
                    this.list_view_h_counter --;
                    this.list_view.removeLastItem();
                    if (this.list_view_h_counter > 0) {
                        this.scheduleOnce(function() {
//                            this.sb.update_scroll_bar();
                        }.bind(this));
                    }
                }
                if (this.list_view_h_counter == 0) {
//                    this.sb.update_scroll_bar();
                }
            }
        }
    },

    _button_v_touch : function(sender, type) {
        if (sender == this.l_v_v_add_b) {
            if (type == ccui.Widget.TOUCH_BEGAN) {
                this.list_view_v_counter ++;
                var item = new Custom.Item(this.list_view_v_counter);
                this.list_view_vertical.pushBackCustomItem(item);
                item.setTouchEnabled(false);
                this.scheduleOnce(function() {
//                  this.sb.update_scroll_bar();
                }.bind(this));
            }

        } else if (sender == this.l_v_v_sub_b) {
            if (type == ccui.Widget.TOUCH_BEGAN) {
                if (this.list_view_v_counter > 0) {
                    this.list_view_v_counter --;
                    this.list_view_vertical.removeLastItem();
                    if (this.list_view_v_counter > 0) {
                        this.scheduleOnce(function() {
//                          this.sb.update_scroll_bar();
                        }.bind(this));
                    }
                }
                if (this.list_view_v_counter == 0) {
//                  this.sb.update_scroll_bar();
                }
            }
        }
    }
});

var HelloWorldScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new HelloWorldLayer();
        this.addChild(layer);

        cc.eventManager.addListener({
            event : cc.EventListener.KEYBOARD,
            onKeyReleased : function(keyCode,event) {
                if (keyCode == cc.KEY.back) {
                    cc.director.popScene();
                }
            }
        }, this);
    }
});

