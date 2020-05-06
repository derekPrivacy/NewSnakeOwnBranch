// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { Websocket } from './socket/websocket'
import GlobalVars from '../script/global/global'

const { ccclass, property } = cc._decorator;

let score_player1 = 0
let score_player2 = 0

@ccclass
export default class NewClass extends cc.Component {
    @property(cc.Node)
    root: cc.Node = null

    @property(cc.SpriteFrame)
    sprite: cc.SpriteFrame = null

    @property(cc.Label)
    label_player1: cc.Label = null

    @property(cc.Label)
    label_player2: cc.Label = null

    @property(cc.Label)
    labelUser: cc.Label = null

    moveAction: cc.ActionInterval;
    map_player1: any = {}
    map_player2: any = {}
    score_player1: number = 0
    score_player2: number = 0
    size = {
        x: 20,
        y: 20
    }
    food_player1 = {
        x: 0,
        y: 0
    }
    food_player2 = {
        x: 0,
        y: 0
    }
    direction_player1: cc.macro.KEY = cc.macro.KEY.right
    direction_player2: cc.macro.KEY = cc.macro.KEY.left
    timer: any


    up_player1() {
        this.direction_player1 = cc.macro.KEY.up
    }
    down_player1() {
        this.direction_player1 = cc.macro.KEY.down
    }
    left_player1() {
        this.direction_player1 = cc.macro.KEY.left
    }
    right_player1() {
        this.direction_player1 = cc.macro.KEY.right
    }


    up_player2() {
        this.direction_player2 = cc.macro.KEY.up
    }
    down_player2() {
        this.direction_player2 = cc.macro.KEY.down
    }
    left_player2() {
        this.direction_player2 = cc.macro.KEY.left
    }
    right_player2() {
        this.direction_player2 = cc.macro.KEY.right
    }

    getMap_player1(): any {
        return Object
            .keys(this.map_player1)
            .map(item => item.split('_').map(pos => Number(pos)))
    }

    getMap_player2(): any {
        return Object
            .keys(this.map_player2)
            .map(item => item.split('_').map(pos => Number(pos)))
    }

    getMapNumber(x: number, y: number): number {
        return (y - 1) * this.size.x + x
    }

    getNumerMap(num: number): any {
        return {
            x: (num - 1) % this.size.x + 1,
            y: ((num - 1) / this.size.x | 0) + 1
        }
    }



    onKeyDown(event) {
        switch (event.keyCode) {
            case cc.macro.KEY.w:
                this.direction_player1 = cc.macro.KEY.up
                break
            case cc.macro.KEY.s:
                this.direction_player1 = cc.macro.KEY.down
                break
            case cc.macro.KEY.a:
                this.direction_player1 = cc.macro.KEY.left
                break
            case cc.macro.KEY.d:
                this.direction_player1 = cc.macro.KEY.right
                break

            case cc.macro.KEY.up:
                this.direction_player2 = cc.macro.KEY.up
                break
            case cc.macro.KEY.down:
                this.direction_player2 = cc.macro.KEY.down
                break
            case cc.macro.KEY.left:
                this.direction_player2 = cc.macro.KEY.left
                break
            case cc.macro.KEY.right:
                this.direction_player2 = cc.macro.KEY.right
                break
            default:
                break
        }
    }

    onLoad() {
        console.log("on load here")
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown.bind(this))
    }

    async start() {
        console.log("on keydown here")
        this.labelUser.string = GlobalVars.gusername
        var result = await Websocket({ "data": GlobalVars.gusername }, "addPlayer", 281)
        console.log("result is " + result)


        this.addPoint_player1(1, 1)
        this.addPoint_player1(2, 1)
        this.addPoint_player1(3, 1)
        this.addFood_player1()
        this.score_player1 = 10


        // this.addPoint_player2(20, 20)
        // this.addPoint_player2(19, 20)
        // this.addPoint_player2(18, 20)
        // this.addFood_player2()
        // this.score_player2 = 0

        // this.timer = setInterval(this.move.bind(this), 1000)
    }

    move() {
        const map_player1 = this.getMap_player1()
        const first_player1 = map_player1[0]
        const lastSecond_player1 = map_player1[map_player1.length - 2]
        const last_player1 = map_player1[map_player1.length - 1]
        const point_player1 = { x: last_player1[0], y: last_player1[1] }

        const map_player2 = this.getMap_player2()
        const first_player2 = map_player2[0]
        const lastSecond_player2 = map_player2[map_player2.length - 2]
        const last_player2 = map_player2[map_player2.length - 1]
        const point_player2 = { x: last_player2[0], y: last_player2[1] }

        let type_player1
        if (lastSecond_player1[0] === last_player1[0]) {
            // 竖着排列
            if (lastSecond_player1[1] > last_player1[1]) {
                // 向上
                type_player1 = cc.macro.KEY.up
            } else {
                // 向下
                type_player1 = cc.macro.KEY.down
            }
        } else {
            // 横着着排列
            if (lastSecond_player1[0] > last_player1[0]) {
                // 向左
                type_player1 = cc.macro.KEY.left
            } else {
                // 向右
                type_player1 = cc.macro.KEY.right
            }
        }
        const direction = [
            [cc.macro.KEY.left, cc.macro.KEY.right],
            [cc.macro.KEY.up, cc.macro.KEY.down]
        ]
        // 判断转向
        if (
            (direction[0].indexOf(type_player1) !== -1 && direction[1].indexOf(this.direction_player1) !== -1)
            ||
            direction[1].indexOf(type_player1) !== -1 && direction[0].indexOf(this.direction_player1) !== -1
        ) {
            type_player1 = this.direction_player1
        }
        switch (type_player1) {
            case cc.macro.KEY.up:
                point_player1.y--
                break
            case cc.macro.KEY.down:
                point_player1.y++
                break
            case cc.macro.KEY.left:
                point_player1.x--
                break
            case cc.macro.KEY.right:
                point_player1.x++
                break
        }

        let type_player2
        if (lastSecond_player2[0] === last_player2[0]) {
            // 竖着排列
            if (lastSecond_player2[1] > last_player2[1]) {
                // 向上
                type_player2 = cc.macro.KEY.up
            } else {
                // 向下
                type_player2 = cc.macro.KEY.down
            }
        } else {
            // 横着着排列
            if (lastSecond_player2[0] > last_player2[0]) {
                // 向左
                type_player2 = cc.macro.KEY.left
            } else {
                // 向右
                type_player2 = cc.macro.KEY.right
            }
        }
        // 判断转向
        if (
            (direction[0].indexOf(type_player2) !== -1 && direction[1].indexOf(this.direction_player2) !== -1)
            ||
            direction[1].indexOf(type_player2) !== -1 && direction[0].indexOf(this.direction_player2) !== -1
        ) {
            type_player2 = this.direction_player2
        }
        switch (type_player2) {
            case cc.macro.KEY.up:
                point_player2.y--
                break
            case cc.macro.KEY.down:
                point_player2.y++
                break
            case cc.macro.KEY.left:
                point_player2.x--
                break
            case cc.macro.KEY.right:
                point_player2.x++
                break
        }

        if (point_player1.x < 1 || point_player1.y < 1 || point_player1.x > this.size.x || point_player1.y > this.size.y) {
            window.alert("PLAYER 1 - GAME OVER / COLLIDE WITH WALL")
            this.over()
            return
        }
        if (point_player2.x < 1 || point_player2.y < 1 || point_player2.x > this.size.x || point_player2.y > this.size.y) {
            window.alert("PLAYER 2 - GAME OVER / COLLIDE WITH WALL")
            this.over()
            return
        }
        for (let i = 0; i < map_player1.length; i++) {
            if (point_player1.x === map_player1[i][0] && point_player1.y === map_player1[i][1]) {
                window.alert("PLAYER 1 - GAME OVER / COLLIDE WITH SELF")
                this.over()
                return
            }

            if (point_player2.x === map_player1[i][0] && point_player2.y === map_player1[i][1]) {
                window.alert("PLAYER 2 - GAME OVER / COLLIDE WITH PLAYER 1")
                this.over()
                return
            }
        }

        for (let i = 0; i < map_player2.length; i++) {
            if (point_player2.x === map_player2[i][0] && point_player2.y === map_player2[i][1]) {
                window.alert("PLAYER 2 - GAME OVER / COLLIDE WITH SELF")
                this.over()
                return
            }

            if (point_player1.x === map_player2[i][0] && point_player1.y === map_player2[i][1]) {
                window.alert("PLAYER 1 - GAME OVER / COLLIDE WITH PLAYER 2")
                this.over()
                return
            }
        }

        if (point_player1.x === this.food_player2.x && point_player1.y === this.food_player2.y) {
            this.score_player1--
            this.label_player1.string = `PLAYER 1 \n 得分：${this.score_player1}`
            this.addFood_player2()
        }

        if (point_player2.x === this.food_player1.x && point_player2.y === this.food_player1.y) {
            this.score_player2--
            this.label_player2.string = `PLAYER 2 \n 得分：${this.score_player2}`
            this.addFood_player1()
        }

        if (point_player1.x === this.food_player1.x && point_player1.y === this.food_player1.y) {
            this.score_player1++
            this.label_player1.string = `PLAYER 1 \n 得分：${this.score_player1}`
            this.addFood_player1()
        } else {
            this.delPoint_player1(first_player1[0], first_player1[1])
        }

        if (point_player2.x === this.food_player2.x && point_player2.y === this.food_player2.y) {
            this.score_player2++
            this.label_player2.string = `PLAYER 2 \n 得分： ${this.score_player2}`
            this.addFood_player2()
        } else {
            this.delPoint_player2(first_player2[0], first_player2[1])
        }

        this.addPoint_player1(point_player1.x, point_player1.y)
        this.addPoint_player2(point_player2.x, point_player2.y)
    }

    over() {
        clearInterval(this.timer)
    }

    addFood_player1() {
        this.delFood_player1()
        //websocket delete food
        const map = this.getMap_player1().sort((a: number, b: number) => this.getMapNumber(a[0], a[1]) - this.getMapNumber(b[0], b[1]))
        const random = this.randomNum(1, this.size.x * this.size.y - map.length)
        for (let i = 0; i < map.length; i++) {
            const num = this.getMapNumber(map[i][0], map[i][1])
            if (random < num) {
                const point = this.getNumerMap(random + i)
                this.food_player1 = point
                this.addPoint_player1(point.x, point.y, cc.Color.BLUE)
                return
            }
        }
        const pointLast = this.getNumerMap(random + map.length)
        this.food_player1 = pointLast
        this.addPoint_player1(pointLast.x, pointLast.y, cc.Color.BLUE)
        //return new food to websocket
    }

    delFood_player1() {
        const name = this.food_player1.x + '_' + this.food_player1.y
        const item = this.root.getChildByName(name)
        if (item) {
            item.destroy()
        }
    }

    addPoint_player1(x: number, y: number, color: cc.Color = new cc.Color(0, 0, 255)) {
        const baseWidth = 720
        const name = x + '_' + y
        const nameFood = this.food_player1.x + '_' + this.food_player1.y
        const baseX = baseWidth / this.size.x
        const baseY = baseWidth / this.size.y
        if (this.map_player1[name]) {
            return
        }
        if (nameFood !== name) {
            this.map_player1[name] = true
        }
        const node = new cc.Node()
        const sp = node.addComponent(cc.Sprite)
        sp.spriteFrame = this.sprite
        sp.type = cc.Sprite.Type.SLICED
        node.parent = this.root
        node.name = name
        node.width = baseX - 4
        node.height = baseY - 4
        node.anchorX = 0
        node.anchorY = 1
        node.x = baseX * (x - 1) - baseWidth / 2 + 2
        node.y = baseWidth / 2 - baseY * (y - 1) - 2
        node.color = color
    }

    delPoint_player1(x: number, y: number) {
        const name = x + '_' + y
        if (!this.map_player1[name]) {
            return
        }
        const item = this.root.getChildByName(name)
        if (item) {
            item.destroy()
        }
        delete this.map_player1[name]
    }

    addFood_player2() {
        this.delFood_player2()
        const map = this.getMap_player2().sort((a: number, b: number) => this.getMapNumber(a[0], a[1]) - this.getMapNumber(b[0], b[1]))
        const random = this.randomNum(1, this.size.x * this.size.y - map.length)
        for (let i = 0; i < map.length; i++) {
            const num = this.getMapNumber(map[i][0], map[i][1])
            if (random < num) {
                const point = this.getNumerMap(random + i)
                this.food_player2 = point
                this.addPoint_player2(point.x, point.y, cc.Color.RED)
                return
            }
        }
        const pointLast = this.getNumerMap(random + map.length)
        this.food_player2 = pointLast
        this.addPoint_player2(pointLast.x, pointLast.y, cc.Color.RED)
    }

    delFood_player2() {
        const name = this.food_player2.x + '_' + this.food_player2.y
        const item = this.root.getChildByName(name)
        if (item) {
            item.destroy()
        }
    }

    addPoint_player2(x: number, y: number, color: cc.Color = new cc.Color(255, 0, 0)) {
        const baseWidth = 720
        const name = x + '_' + y
        const nameFood = this.food_player2.x + '_' + this.food_player2.y
        const baseX = baseWidth / this.size.x
        const baseY = baseWidth / this.size.y
        if (this.map_player2[name]) {
            return
        }
        if (nameFood !== name) {
            this.map_player2[name] = true
        }
        const node = new cc.Node()
        const sp = node.addComponent(cc.Sprite)
        sp.spriteFrame = this.sprite
        sp.type = cc.Sprite.Type.SLICED
        node.parent = this.root
        node.name = name
        node.width = baseX - 4
        node.height = baseY - 4
        node.anchorX = 0
        node.anchorY = 1
        node.x = baseX * (x - 1) - baseWidth / 2 + 2
        node.y = baseWidth / 2 - baseY * (y - 1) - 2
        node.color = color
    }

    delPoint_player2(x: number, y: number) {
        const name = x + '_' + y
        if (!this.map_player2[name]) {
            return
        }
        const item = this.root.getChildByName(name)
        if (item) {
            item.destroy()
        }
        delete this.map_player2[name]
    }

    delPointAll() {
        this.getMap_player1().map(item => this.delPoint_player1(item[0], item[1]))
        this.getMap_player2().map(item => this.delPoint_player2(item[0], item[1]))
    }

    randomNum(minNum: number, maxNum: number): number {
        return parseInt((Math.random() * (maxNum - minNum + 1) + minNum) + '', 10)
    }

    // update (dt) {}
}
