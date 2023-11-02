# WRTC-dev

Branch for developing real-time interfaces for integration within NankuruChat

## Utils

### Generate SSL .pems for voice chat before testing
    npm run dev-setup

### Message models:

For DMs

    {
        type: "message",
        pfp: File,
        target: string (UUID),
        timeStamp: string,
        content: string,
        files: File/s | undefined
    }

For Server/channel

    {
        type: "message", 
        pfp: File,
        server: int,
        channel: int,
        timeStamp: string,
        content: string,
        files: File/s : undefined
    }

## Done
- Drop SIO in favor of WS.
- Signal server for messaging.
- Signal Server for Voice chat.
- Handling of P2P connections & VOIP chat.

## TO DO
- Signal Server for Video chat.
- ~~Self hosted STUN & TURN server via [coturn](https://github.com/coturn/coturn)~~ Temporarily dropped in favor of public google turn servers.
- Docker Images.

<br>

### My brain on WebSockets:

![Jinx, keeper of knowledge](/public/README_data/my_brain_on_ws.jpeg)

<br>

### My sanity on MediaStreams:

![Jinx, guardian of portals](/public/README_data/my_sanity_on_mediastreams.jpeg)