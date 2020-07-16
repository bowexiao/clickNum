
const {ccclass, property} = cc._decorator;

@ccclass
export default class Gird extends cc.Component {

    @property({
        type:cc.Sprite,
        tooltip:'纹理'
    })
    icon:cc.Sprite = null;

    @property({
        type:cc.SpriteFrame,
        tooltip:'纹理'
    })
    spriteFrames:cc.SpriteFrame [] = [];

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}
    x = 0;
    y = 0;
    type = null;

    start () {

    }

    init(x,y,type){
        this.x = x;
        this.y = y;
        this.type = type;

        this.icon.spriteFrame = this.spriteFrames[type - 1];
    }

    // update (dt) {}
}
