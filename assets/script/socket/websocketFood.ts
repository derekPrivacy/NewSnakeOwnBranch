export function websocketFood(object, msgType, roomNumber) {

    return new Promise(function (resolve, reject) {

        console.log("ws passed room number " + roomNumber)
        console.log("type message " + msgType)

        var socket = new WebSocket('ws://localhost:8081/api/socketAdd');

        // on websocket error
        socket.addEventListener('error', function (event) {
            console.log("websocket add error")
            console.log(event);
        });

        // Connection opened
        socket.addEventListener('open', function (event) {
            console.log("food route connected")

            var msg = { "type": msgType, "RoomID": parseInt(roomNumber) }

            switch (msgType) {
                case "spawnFood":
                    msg["foodType"] = object["foodType"]

                    if (msg["foodType"] == "1") {
                        msg["FoodOneX"] = object["foodOneX"]
                        msg["FoodOneY"] = object["foodOneY"]
                    } else if (msg["foodType"] == "2") {
                        msg["FoodTwoX"] = object["foodTwoX"]
                        msg["FoodTwoY"] = object["foodTwoY"]
                    }

            }

            socket.send(JSON.stringify(msg));
        });

        // Listen for messages
        socket.addEventListener('message', function (event) {
            console.log("food food food back " + JSON.parse(JSON.stringify(event.data)))

            var response = JSON.parse(event.data)



            resolve(JSON.parse(JSON.stringify(event.data)))
        });
    })
}

