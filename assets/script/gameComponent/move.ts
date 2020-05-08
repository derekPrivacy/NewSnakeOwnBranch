export default function move() {
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


    // Collition logic
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


    // get points logic
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