export const handleTerminalCreation = (container, ws) => {
    container.exec({
        Cmd: ["/bin/bash"],
        AttachStdin: true,
        AttachStdout: true,
        AttachStderr: true,
        Tty: true,
        User: "code",
    }, (err, exec) => {
        if(err) {
            console.log("Error while creating exec", err);
            return;
        }

        exec.start({ hijack: true }, (err, stream) => {
            if(err) {
                console.log("Error while starting the exec.", err);
                return;
            }

            // STEP:1 Parse/Process the stream
            processStreamOutput(stream, ws);

            // STEP:2 Stream Writing
            ws.on("message", (data) => {
                if(data === "getPort") {
                    container.inspect((err, data) => {
                        const port = data.NetworkSettings;
                        console.log(port);
                    });
                    return;
                }
                stream.write(data);
            });
        });
    });
}

function processStreamOutput(stream, ws) {
    let nextDataType = null; // Stores the type of the next message
    let nextDataLength = null; // Stores the length of the next message
    let buffer = Buffer.from(""); // Buffere object in which we will process the data and keep it.

    // We will call this function as soon some data comes into our stream.
    function processStreamData(data) {
        // This is a helper function to process incoming data chunks
        if(data) {
            buffer = Buffer.concat([buffer, data]);
        }

        if(!nextDataType) {
            // If the next data type is not known, then we need to read the next 8 bytes to determine the type and length of the message..
            if(buffer.length >=8) {
                const header = bufferSlicer(8);
                nextDataType = header.readUint32BE(0); // the first 4 byte represent the type of message.
                nextDataLength = header.readUint32BE(4); // the next 4 byte represent the length of the message.
            
                processStreamData(); // Recursively call the function to process the message.
            } 
        } else {
            if(buffer.length >= nextDataLength) {
                const content = bufferSlicer(nextDataLength);
                ws.send(content); // send the message to the client
                nextDataType = null; // Reset the type and length of the next message.
                nextDataLength = null;
                processStreamData(); // Recursively call the function to process the next message.
            }
        }
    }

    function bufferSlicer(end) {
        // This function slices the buffer and returns the  sliced after and the remaining buffer.
        const output = buffer.slice(0, end); // header of the chunk.
        buffer = Buffer.from(buffer.slice(end, buffer.length)); // Remaining part of the chuk
    
        return output;
    }

    stream.on("data", processStreamData)
}