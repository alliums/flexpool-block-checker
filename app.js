const https = require("https");
const nodifier = require("node-notifier");
const path = require('path');
process.title = "flexpool US block checker"

var gBlocks;
var lastBlock;
var lastNotifTime = 0;
function getBlocks() {
  var blocks;
  https.get('https://flexpool.io/api/v1/pool/blocks/?page=0', (resp) => {
    let data = '';
    resp.on('data', (chunk) =>{
      data+=chunk;

    });
    resp.on('end', () =>{
      let json = JSON.parse(data);
      gBlocks = json.result.data;
      for (var i=0;i<10;){
        if (gBlocks[i].server_name!="us"){
          i++;
        } else if (gBlocks[i].server_name=="us"){
          lastBlock = gBlocks[i];
          console.log(gBlocks[i]);
          notify();

          break;
        }
      }
      blocks = json;
    });
  }).on('error', (err)=>{
    console.log("Error: " + err.message);
  });
  return blocks;
}


function UnixToUTC(unix) {
  var date = new Date(unix * 1000);
  var hours = date.getHours();
  var minutes = "0" + date.getMinutes();
  var seconds = "0" + date.getSeconds();
  var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
  return formattedTime;

}

var count=0;

function notify() {
  if (lastBlock.timestamp != lastNotifTime) {
    nodifier.notify({
      icon: path.join(__dirname, 'shibes.ico'),
      title: "new block",
      message: "mined: block #" + lastBlock.number + " at " + UnixToUTC(lastBlock.timestamp),
      wait:true
    }
    );}lastNotifTime = lastBlock.timestamp;
  return 0;
}

var seconds = 5, interval = seconds * 1000;
setInterval(function() {
    let blockList= getBlocks();

  }
, interval);
