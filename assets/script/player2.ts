const { ccclass, property } = cc._decorator;

let score_player2 = 0

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Node)
    root: cc.Node = null

    @property(cc.Label)
    label_player2: cc.Label = null

    @property(cc.SpriteFrame)
    sprite: cc.SpriteFrame = null

    // 得分
    score_player2: number = 0

    // 地图尺寸
    size = {
        x: 20,
        y: 20
    }

    // 地图数据
    map: any = {}

    // 定义下一步的方向
    direction_player2: cc.macro.KEY = cc.macro.KEY.left

    // 速度定时器
    timer: any

    // 食物所在位置
    food ={ 
        x: 0,
        y: 0
    }

    up() {
        this.direction_player2 = cc.macro.KEY.up
    }

    down() {
        this.direction_player2 = cc.macro.KEY.down
    }

    left() {
        this.direction_player2 = cc.macro.KEY.left
    }

    right() {
        this.direction_player2 = cc.macro.KEY.right
    }

    start() {
        // const anim = this.root.getComponent(cc.Animation)
        // anim.play('test')
        Object.defineProperty(this, 'score_player2', {
            get: () => score_player2,
            set: value => {
                score_player2 = value
                this.label_player2.string = `PLAYER 2 \n 得分：${score_player2}`
            }
        })

        this.init()
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown_player2.bind(this))
    }

    onKeyDown_player2(event) {
        switch (event.keyCode) {
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

    onEnd(test) {
        console.log(test)
    }

    getMap(): any {
        return Object
            .keys(this.map)
            .map(item => item.split('_').map(pos => Number(pos)))
    }

    // 地图转数字
    getMapNumber(x: number, y: number): number {
        return (y - 1) * this.size.x + x
    }

    // 数字转地图
    getNumerMap(num: number): any {
        return {
            x: (num - 1) % this.size.x + 1,
            y: ((num - 1) / this.size.x | 0) + 1
        }
    }

    init() {
        this.delPointAll()
        this.addPoint(20, 20)
        this.addPoint(19, 20)
        this.addPoint(18, 20)
        this.addFood()
        this.score_player2 = 0
        this.timer = setInterval(this.move.bind(this), 300)
    }

    // 定时移动
    move() {
        const map = this.getMap()
        const first = map[0]
        const lastSecond = map[map.length - 2]
        const last = map[map.length - 1]
        const point_player2 = { x: last[0], y: last[1] }
        let type
        if (lastSecond[0] === last[0]) {
            // 竖着排列
            if (lastSecond[1] > last[1]) {
                // 向上
                type = cc.macro.KEY.up
            } else {
                // 向下
                type = cc.macro.KEY.down
            }
        } else {
            // 横着着排列
            if (lastSecond[0] > last[0]) {
                // 向左
                type = cc.macro.KEY.left
            } else {
                // 向右
                type = cc.macro.KEY.right
            }
        }
        const direction= [
            [cc.macro.KEY.left, cc.macro.KEY.right],
            [cc.macro.KEY.up, cc.macro.KEY.down]
        ]
        // 判断转向
        if (
            (direction[0].indexOf(type) !== -1 && direction[1].indexOf(this.direction_player2) !== -1)
            ||
            direction[1].indexOf(type) !== -1 && direction[0].indexOf(this.direction_player2) !== -1
        ) {
            type = this.direction_player2
        }
        switch (type) {
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
        // 撞墙
        if (point_player2.x < 1 || point_player2.y < 1 || point_player2.x > this.size.x || point_player2.y > this.size.y) {
            window.alert("PLAYER 2 - GAME OVER / COLLIDE WITH WALL")
            this.over()
            return
        }
        // 撞到自己
        for (let i = 0; i < map.length; i++) {
            if (point_player2.x === map[i][0] && point_player2.y === map[i][1]) {
                window.alert("PLAYER 2 - GAME OVER / COLLIDE WITH SELF")
                this.over()
                return
            }
        }
        // 吃到食物
        if (point_player2.x === this.food.x && point_player2.y === this.food.y) {
            this.score_player2++
            this.addFood()
        } else {
            this.delPoint(first[0], first[1])
        }
        this.addPoint(point_player2.x, point_player2.y)
    }

    // 添加食物
    addFood() {
        this.delFood()
        const map = this.getMap().sort((a: number, b: number) => this.getMapNumber(a[0], a[1]) - this.getMapNumber(b[0], b[1]))
        const random = this.randomNum(1, this.size.x * this.size.y - map.length)
        for (let i = 0; i < map.length; i++) {
            const num = this.getMapNumber(map[i][0], map[i][1])
            if (random < num) {
                const point = this.getNumerMap(random + i)
                this.food = point
                this.addPoint(point.x, point.y, cc.Color.RED)
                return
            }
        }
        const pointLast = this.getNumerMap(random + map.length)
        this.food = pointLast
        this.addPoint(pointLast.x, pointLast.y, cc.Color.RED)
    }

    delFood() {
        const name = this.food.x + '_' + this.food.y
        const item = this.root.getChildByName(name)
        if (item) {
            item.destroy()
        }
    }

    // 结束
    over() {
        clearInterval(this.timer)
    }

    // 插入点
    addPoint(x: number, y: number, color: cc.Color = new cc.Color(255, 0, 0)) {
        const baseWidth = 720
        const name = x + '_' + y
        const nameFood = this.food.x + '_' + this.food.y
        const baseX = baseWidth / this.size.x
        const baseY = baseWidth / this.size.y
        if (this.map[name]) {
            return
        }
        if (nameFood !== name) {
            this.map[name] = true
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

    // 删除点
    delPoint(x: number, y: number) {
        const name = x + '_' + y
        if (!this.map[name]) {
            return
        }
        const item = this.root.getChildByName(name)
        if (item) {
            item.destroy()
        }
        delete this.map[name]
    }

    // 删除所有点
    delPointAll() {
        this.getMap().map(item => this.delPoint(item[0], item[1]))
    }

    //生成从minNum到maxNum的随机数
    randomNum(minNum: number, maxNum: number): number {
        return parseInt((Math.random() * (maxNum - minNum + 1) + minNum) + '', 10)
    }
}
