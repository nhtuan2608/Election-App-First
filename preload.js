// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.

window.myAPI = {
  blockNumber: '',
  time: '',
  setNewBlock: function(blockNumber, timeStamp) {
      this.blockNumber = blockNumber;

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
      var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
      this.time = formattedTime;
      console.log('AAAAAA: ' + this.blockNumber + this.time)
  },
  getCurrentBlock: function() {
      var currentTime = (this.time != '') ? (this.time) : '';
      return 'SIMBA EMPIRE Block: ' + this.blockNumber + '\tTime: ' + currentTime;
  },
}

window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  for (const type of ['chrome', 'node', 'electron']) {
    replaceText(`${type}-version`, process.versions[type])
  }
})
