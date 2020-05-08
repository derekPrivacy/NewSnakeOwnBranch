export function WebsocketAdd(object, msgType, roomNumber, avatarObjOne, avatarObjTwo) {

    return new Promise(function (resolve, reject) {



        console.log("ws passed room number " + roomNumber)
        console.log("type message " + msgType)

        var socket = new WebSocket('ws://localhost:8081/api/socketAdd');

        // on websocket error
        socket.addEventListener('error', function (event) {
            console.log("error")
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
            }

            resolve(JSON.parse(JSON.stringify(event.data)))
        });
    })
}

