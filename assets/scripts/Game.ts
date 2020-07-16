import { Global } from "./Global";
import { Utils } from "./common/Utils";
import Gird from "./Gird";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Game extends cc.Component {


    @property({
        type: cc.Label,
        tooltip: '时间'
    })
    time: cc.Label = null;

    @property({
        type: cc.Prefab,
        tooltip: '格子预制体'
    })
    gird: cc.Prefab = null;

    @property({
        type: cc.Node,
        tooltip: '背景'
    })
    girdBg: cc.Node = null;

    @property({
        type: cc.Label,
        tooltip: '关卡'
    })
    LVLebel: cc.Label = null;

    @property({
        type: cc.Graphics,
        tooltip: '画布'
    })
    graphicsBg: cc.Graphics = null;




    private combo = 0;
    private num = 0;
    private score = 0;
    private gameTime = 0;
    private isGameVoer = false;
    private girds = [];
    private titleWidth = 0;
    private titleHeight = 0;
    private gap = 5;

    private startX = 0;
    private startY = 0;
    private boardWidth = 0;
    private boardHeight = 0;
    private click = true;

    onLoad() {
        this.num = Math.min(Math.max(Global.gameData.LV / 2, 1), Global.gameData.MAX_NUM);

        this.gameTime = Global.gameData.GAME_TIME + Global.gameData.addtime;

        Global.gameData.addtime = 0;

        this.LVLebel.string = 'LV.' + Global.gameData.LV;

        this.titleWidth = (this.girdBg.width - Global.gameData.COL_NUM * this.gap) / Global.gameData.COL_NUM;
        this.titleHeight = (this.girdBg.height - Global.gameData.ROW_NUM * this.gap) / Global.gameData.ROW_NUM;

        for (let x = 0; x < Global.gameData.COL_NUM; x++) {
            this.girds[x] = [];

            for (let y = 0; y < Global.gameData.ROW_NUM; y++) {
                this.girds[x][y] = null;
            }

        };
        //初始化格子
        this.initBoard();
        //最大数量的小方块
        let max = Math.floor(Global.gameData.COL_NUM * Global.gameData.ROW_NUM * 0.9);
        //初始化格子数量
        let initNum = Global.gameData.COL_NUM * Global.gameData.ROW_NUM * 0.1 + Global.gameData.LV * 0.25;
        this.addGirds(Math.floor(Math.min(initNum, max)));

        //检查
        this.check();
    }

    //检测格子
    check(){
        let types = {};
        let live = false;
        for (let x = 0; x < Global.gameData.COL_NUM; x++) {
            if(live){
                break;
            }

            for (let y = 0; y < Global.gameData.ROW_NUM; y++) {
                let gird = this.girds[x][y];
                
                if(gird != null){
                    let num = types[gird.type];
                    if(num == null){
                        num = 0;
                    }

                    num++;
                    types[gird.type] = num;

                    if(num >= 2){
                        live = true;
                        break;
                    };
                }
            }
        }

        //游戏结束了
        if(!live){
            this.gamePass();
            return;
        }

        for (let x = 0; x < Global.gameData.COL_NUM; x++) {
            for (let y = 0; y < Global.gameData.ROW_NUM; y++) {
                let pos = cc.v2(x,y);
                let canMove = this.cilcked(pos ,true);

                if(canMove){
                    return true;
                };
            }
        }
    }

    //过关
    private gamePass(){
        this.isGameVoer = true;
        cc.log('Global.gameData.initUser.lv--------->',Global.gameData) ;

        Global.gameData.LV ++;

        cc.director.loadScene('Game')


    }

    //点击操作
    private cilcked(pos:cc.Vec2,test){

        let face = [1,-1];
        let tempGird = this.girds[pos.x][pos.y];
        let map = {};

        if(tempGird != null){
            if(map[tempGird.type] == null){
                map[tempGird.type] = [];
            }
            let arr = map[tempGird.type];
            arr.push(tempGird);
        };

        //横向搜索
        let c = false;

        for (let i in face) {
            let tempx = pos.x;
            let tempy = pos.y;

            let a = face[i];

            for (let k = 0; k < Global.gameData.COL_NUM; k++) {
                if(tempx < 0 || tempx >= Global.gameData.COL_NUM){
                    break;
                };

                let gird = this.girds[tempx][tempy];

                if(gird != null){
                    if(gird == tempGird){
                        tempx += a;
                        continue;
                    }

                    if(tempGird != null && gird.type != tempGird.type){
                        break;
                    }

                    if(map[gird.type] == null){
                        map[gird.type] = [];
                    }

                    let arr = map[gird.type];
                    let f = false;
                    for (let key in arr) {
                        let tarGird = arr[key];
                        if(tarGird == tempGird){
                            continue;
                        }

                        if(tarGird == gird){
                            f = true;
                            break;
                        }
                    }

                    if(f){
                        continue;
                    }

                    map[gird.type].push(gird);
                    break;
                }
                tempx += a;
            }
        }

        //纵向搜索
        c = false;
        for (let i in face) {
            let tempx = pos.x;
            let tempy = pos.y;

            let a = face[i];
            for (let k = 0; k < Global.gameData.ROW_NUM; k++) {
                if(tempy < 0 || tempy >= Global.gameData.ROW_NUM){
                    break;
                }
                
                let gird = this.girds[tempx][tempy];

                if(gird != null){
                    if(gird == tempGird){
                        tempy += a;
                        continue;
                    };

                    if(tempGird != null && gird.type != tempGird.type){
                        break;
                    }
    
                    if(map[gird.type] == null){
                        map[gird.type] = [];
                    }
    
                    let arr = map[gird.type];
                    let f = false;
    
                    for (let key in arr) {
                        let tarGird = arr[key];
    
                        if(tarGird == gird){
                            f = true;
                            break;
                        }
                    }
    
                    if(f){
                        continue;
                    }
    
                    map[gird.type].push(gird);
                    break;
                }
                tempy += a;
            }
        }

        let right = false;
        let moveTime = 0.3;
        let speed = 0;

        for (let key in map) {
            let arr = map[key];

            if(arr.length >= 2){
                if(test){
                    return true;
                }

                right = true;
                this.click = false;

                for (let j in arr) {
                    let gird = arr[j];
                    this.girds[gird.x][gird.y] = null; //清空

                    let moveTo = cc.moveTo(moveTime,cc.v2(pos.x * (this.titleWidth + this.gap),pos.y * (this.titleHeight + this.gap)));
                    let callFun = cc.callFunc(()=>{
                        gird.parent = null;
                        Utils.putPoolType('Gird',gird.node);
                    });
                    cc.log('gird---------->',typeof(gird) )
                    let seq = cc.sequence(moveTo,callFun).easing(cc.easeCubicActionIn());
                    gird.node.runAction(seq);
                }
                speed += arr.length;
            }

        }

        if(test){
            return false;
        }

        if(speed > 0){
            this.check();
        }

        if(!right && tempGird == null){
            this.addGirds(2);
            this.check();
        }
        
    }

    //增加格子
    private addGirds(num) {
        let arr = [];
        for (let x = 0; x < Global.gameData.COL_NUM; x++) {
            for (let y = 0; y < Global.gameData.ROW_NUM; y++) {
                let js = this.girds[x][y];
                if (js == null) {
                    arr.push({
                        x: x,
                        y: y
                    });
                }
            }
        }

        let arrX = Utils.shuffule(arr);

        for (let k = 0; k < num; k += 1) {
            let p1 = arrX[k];
            let type = Math.floor(Math.random() * this.num) + 1;
            this.creatGirds(type, p1.x, p1.y);
        }
    }

    //实例化格子
    private creatGirds(type, x, y) {
        let node: cc.Node = Utils.getPoolType('Gird');

        if (node == null) {
            node = cc.instantiate(this.gird);
        }
        
        let gird = node.getComponent(Gird);
        gird.init(x, y, type);

        node.setPosition(x * (this.titleWidth + this.gap), y * (this.titleHeight + this.gap));
        node.parent = this.girdBg;

        this.girds[x][y] = gird;

        node.width = this.titleWidth;
        node.height = this.titleHeight;
    }

    private initBoard() {
        this.startX = -this.gap / 2;
        this.startY = -this.gap / 2;

        this.boardWidth = this.girdBg.width;
        this.boardHeight = this.girdBg.height;

        this.graphicsBg.clear();

        for (let x = 0; x < (Global.gameData.COL_NUM + 1); x++) {
            this.graphicsBg.moveTo(this.startX + x * (this.titleWidth + this.gap), this.startY);
            this.graphicsBg.lineTo(this.startX + x * (this.titleWidth + this.gap), this.startY + this.boardHeight);
            this.graphicsBg.stroke();
        }

        for (let y = 0; y < (Global.gameData.ROW_NUM + 1); y++) {
            this.graphicsBg.moveTo(this.startX, this.startY + y * (this.titleHeight + this.gap));
            this.graphicsBg.lineTo(this.startX + this.boardWidth, this.startY + y * (this.titleHeight + this.gap));
            this.graphicsBg.stroke();
        }
    }

    start() {
        this.init();
    }

    private init(){
        this.click = true;

        this.girdBg.on(cc.Node.EventType.TOUCH_START,(touch)=>{
            let touchLoc = this.girdBg.convertToNodeSpaceAR(touch.getLocation());

            let pos = cc.v2(Math.floor(touchLoc.x / (this.titleWidth + this.gap)),Math.floor(touchLoc.y / (this.titleHeight + this.gap)));

            this.cilcked(pos,false);
        })

    }

    gameOver() {

    }

    upDateTime() {
        this.time.string = Math.round(this.gameTime) + '';
    }

    update(dt) {

        if (this.isGameVoer) {
            return;
        }

        this.gameTime -= dt;

        if (this.gameTime <= 0) {
            this.gameOver();
            this.isGameVoer = true;
            return;
        } else {
            this.upDateTime();
        }
    }
}
