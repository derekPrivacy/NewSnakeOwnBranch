export function WebsocketAdd(object, msgType, roomNumber, avatarObj) {

    return new Promise(function (resolve, reject) {

        var recordObj = avatarObj

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

            if (msgType == "addPlayer") {

                msg["data"] = object["input"]

                console.log("in this case " + JSON.stringify(msg))
            }

            socket.send(JSON.stringify(msg));
        });

        // Listen for messages
        socket.addEventListener('message', function (event) {
            console.log("message")
            console.log("respoonse back " + JSON.parse(JSON.stringify(event.data)))

            var response = JSON.parse(event.data)

            var check1 = recordObj.direction != null
            var check2 = response["Avatar"] != null

            // update that global var using response
            if (recordObj.direction != null && response["Avatar"] != null) {
                recordObj.direction = response["Avatar"][0]["Direction"]
            }

            resolve(JSON.parse(JSON.stringify(event.data)))
        });
    })
}

