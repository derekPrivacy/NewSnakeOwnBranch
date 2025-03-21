export function websocketGame(
    object, msgType, roomNumber, avatarObjOne, avatarObjTwo,
    shldFrameUpdate, foodObj, shldFoodUpdate
) {

    return new Promise(function (resolve, reject) {

        console.log("ws passed room number " + roomNumber)
        console.log("type message " + msgType)

        var socket = new WebSocket('ws://18.219.41.101:8081/api/socketAdd');

        // on websocket error
        socket.addEventListener('error', function (event) {
            console.log("websocket add error")
            console.log(event);
        });

        // Connection opened
        socket.addEventListener('open', function (event) {
            console.log("connected")

            var msg = { "type": msgType, "RoomID": parseInt(roomNumber) }

            switch (msgType) {
                case "hello":

                    break

                case "addPlayer":
                    msg["data"] = object["input"]

                    console.log("in this case " + JSON.stringify(msg))
                    break

                case "spawnFood":
                    msg["player1Food"] = object["player1Food"]

                case "gameOver":

                    break
            }

            socket.send(JSON.stringify(msg));
        });

        // Listen for messages
        socket.addEventListener('message', function (event) {
            console.log("message")
            console.log("respoonse back " + JSON.parse(JSON.stringify(event.data)))

            var response = JSON.parse(event.data)


            if (response["Avatar"] != null) {
                for (var i = 0; i < response["Avatar"].length; i++) {

                    if (response["Avatar"][i]["ID"] == 1) {
                        avatarObjOne.direction = response["Avatar"][i]["Direction"]
                    } else if (response["Avatar"][i]["ID"] == 2) {
                        avatarObjTwo.direction = response["Avatar"][i]["Direction"]
                    }
                }
                shldFrameUpdate.update = true
            }


            if (response["Food"] != null && response["Food"]["FoodType"] == "1") {
                console.log("refeshing the food now ")
                foodObj.foodOneX = response["Food"]["FoodOneX"]
                foodObj.foodOneY = response["Food"]["FoodOneY"]

                shldFoodUpdate.foodOneUpdate = true
            }

            // if response["foodType"]=="1"    
            // newFood= response["food..."]
            // shldFoodOneUpdate=true

            resolve(JSON.parse(JSON.stringify(event.data)))
        });
    })
}

