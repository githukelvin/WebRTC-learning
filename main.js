// import agora rtm sdk
// import AgoraRTM from "agora-rtm-sdk";

let APP_ID = "dc61017e010c48a8b4f7c895f47cf241";
// dc61017e010c48a8b4f7c895f47cf241

let token = null;

let uid = String(Math.floor(Math.random()*10000));
let client;
let channel;
 

let localStream;
let remoteStream;
let peerConnection;


const servers = {
  iceServers: [
    {
      urls: ["stun:stun.l.google.com:19302"]
    },
  ],
};

let init = async ()=>{

    client = await AgoraRTM.createInstance(APP_ID);
    await client.login({ uid, token });

    channel = client.createChannel("main");
    await channel.join();

    channel.on("Joined", handleUserJoined);

    client.on("Message From Peer", handleMessageFromPeer);

    localStream = await navigator.mediaDevices.getUserMedia({audio:false, video:true})

    document.getElementById('user-1').srcObject = localStream

}

let handleUserJoined = async (MemberID) => {
  console.log("A new user has joined :", MemberID);
  createOffer(MemberID);

};

let handleMessageFromPeer = async (message, MemberID) => {
  console.log("message:", message.text);
  createOffer(MemberID);
};

// create Offer 
let createOffer = async (MemberID)=>{
    // client instance
    peerConnection = new RTCPeerConnection(servers);
    remoteStream = new MediaStream();
    document.getElementById('user-2').srcObject = remoteStream;

    // add track
    localStream.getTracks().forEach((track)=>{
        peerConnection.addTrack(track, localStream)
    })
    // listen peer
    peerConnection.ontrack = (e)=>{
        e.streams[0].getTracks().forEach((track)=>{
            remoteStream.addTrack()
        })
    }
    // icecandidate
    peerConnection.onicecandidate = async (e)=>{
        if(e.candidate){
            console.log('New candidate :',e.candidate)
        }
    }

    // offer
    let offer = await peerConnection.createOffer()
    await peerConnection.setLocalDescription(offer)

    // offer
    console.log('offer :',offer)
    // send offer to peer

    client.sendMessageToPeer({text:"hey!!"},MemberID)
}


init(); 