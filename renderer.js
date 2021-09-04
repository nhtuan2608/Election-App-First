// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.

const axios = require('axios');
const { ipcRenderer, remote } = require( "electron" );

const NOTIFICATION_TITLE = 'SIMBA ALERT';
const CLICK_MESSAGE = 'Notification clicked';
const TOADDRESS = '0x9aA2F05b70386fFe0A273C757fE02C21da021d62';

var info = {
    blockNumber: '',
    time: '',
    getCurrentBlock: function() {
        var currentTime = (this.time != '') ? (this.time) : '';
        return 'Block: ' + this.blockNumber + '\tTime: ' + currentTime;
    },
    setNewBlock: function(blockNumber, timeStamp) {
        this.blockNumber = blockNumber;

        if(timeStamp != '') {
            // Create a new JavaScript Date object based on the timestamp
            // multiplied by 1000 so that the argument is in milliseconds, not seconds.
            var date = new Date(timeStamp * 1000);
            // Hours part from the timestamp
            var hours = date.getHours();
            // Minutes part from the timestamp
            var minutes = "0" + date.getMinutes();
            // Seconds part from the timestamp
            var seconds = "0" + date.getSeconds();

            // Will display time in 10:30:23 format
            var formattedTime = hours + 'h:' + minutes.substr(-2) + 'm:' + seconds.substr(-2) + 's';
            this.time = formattedTime;
        } else {
            this.time = timeStamp;
        }
    }
};

const cpuContent = document.querySelector('.cpu')
const ramContent = document.querySelector('.ram')
const currentBlockContent = document.querySelector('.info')

function getInfo() {
    const memory = process.getSystemMemoryInfo();
    const freeRam = memory.free / memory.total * 100;

    ramContent.textContent = `${freeRam.toFixed(2)}%`

    const cpuUsage = process.getCPUUsage().percentCPUUsage * 100;
    cpuContent.textContent = `${cpuUsage.toFixed(2)}%`
}

function getAccount() {
    console.log(window.myAPI.blockNumber);
    var globalCurrentBlock = window.myAPI.blockNumber;
    axios.get('https://api.polygonscan.com/api?module=account&action=tokentx&address=0x8e1D09ADA96729e5048027EB98FF37c2213C96a1&page=1&offset=100&sort=dsc&apikey=68J69RQ5NKHV81GZRTNID733HP4ZEG8AJ2')
    // axios.get('https://api.polygonscan.com/api?module=account&action=txlist&address=0x0000000000000000000000000000000000001010&page=1&offset=100&sort=dsc&apikey=68J69RQ5NKHV81GZRTNID733HP4ZEG8AJ2')
    .then(function (response) {
        // handle success
        // console.log(response.data);
        if(response.data.status == '1') {
            var arrayData = response.data.result;
            var currentBlock = arrayData[arrayData.length - 1].blockNumber;
            var timeStamp = arrayData[arrayData.length - 1].timeStamp;
            var toAddress = arrayData[arrayData.length - 1].to;

            // if(toAddress == TOADDRESS) {
                if(globalCurrentBlock == '') {
                    window.myAPI.setNewBlock(currentBlock, timeStamp);
                    currentBlockContent.textContent = window.myAPI.getCurrentBlock();
                    console.log('Init');
                    return;
                }
                if(globalCurrentBlock != '' || globalCurrentBlock != null) {
                    if(currentBlock != globalCurrentBlock) {
                        // info.setNewBlock(currentBlock, timeStamp);
                        // currentBlockContent.textContent = info.getCurrentBlock();
                        window.myAPI.setNewBlock(currentBlock, timeStamp);
                        currentBlockContent.textContent = window.myAPI.getCurrentBlock();
                        console.log('New: ' + window.myAPI.blockNumber);
                        new Notification(NOTIFICATION_TITLE, { body: info.getCurrentBlock() })
                                .onclick = () => console.log(CLICK_MESSAGE)
                    } else {
                        console.log('Still Old: ' + currentBlock);
                        currentBlockContent.textContent = window.myAPI.getCurrentBlock();
                    }
                }
            // }
        }
    })
    .catch(function (error) {
        // handle error
        console.log(error);
    })
    .then(function () {
        // always executed
    });
}

setInterval(getInfo, 1000)
setInterval(getAccount, 500)
// getAccount();

