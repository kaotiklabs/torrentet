import UploadActions from "../actions/UploadActions";
import alt from "../alt";
import socket from "filepizza-socket";
import { getClient } from "../wt";

const TRACKERS = [
  ["wss://tracker.btorrent.xyz"],
  ["wss://tracker.openwebtorrent.com"],
  ["wss://tracker.fastcast.nz"]
];

  function showPeerAddress(addr){
    console.log('1 New connection to peer: ' + addr)

    // UploadStore.swarm.push(addr);
    // console.log('2 New connection to peer: ' + UploadStore.swarm[UploadStore.swarm.length])
  }


const SPEED_REFRESH_TIME = 2000;

export default alt.createStore(
  class UploadStore {
    constructor() {
      this.bindActions(UploadActions);

      this.fileName = "";
      this.fileSize = 0;
      this.fileType = "";
      this.infoHash = null;
      this.peers = 0;
      this.speedUp = 0;
      this.status = "ready";
      this.token = null;
      this.swarm = [];
    }




    onUploadFile(file) {
      if (this.status !== "ready") return;
      this.status = "processing";

      getClient().then(client => {
        client.seed(file, { announce: TRACKERS }, torrent => {
          const updateSpeed = () => {
            this.setState({
              speedUp: torrent.uploadSpeed,
              peers: torrent.numPeers
            });
          };

          torrent.on("upload", updateSpeed);
          torrent.on("download", updateSpeed);
          setInterval(updateSpeed, SPEED_REFRESH_TIME);

          //! if new peer detected, show address
          torrent.on('wire', function (wire, addr) {
            showPeerAddress(addr)            
          })          

          socket.emit(
            "upload",
            {
              fileName: file.name,
              fileSize: file.size,
              fileType: file.type,
              infoHash: torrent.magnetURI
            },
            token => {
              this.setState({
                status: "uploading",
                token: token,
                fileName: file.name,
                fileSize: file.size,
                fileType: file.type,
                infoHash: torrent.magnetURI
              });
            }
          );
        });
      });
    }
  },
  "UploadStore"
);
