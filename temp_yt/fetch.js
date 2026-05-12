const yt = require('youtube-transcript').YoutubeTranscript; yt.fetchTranscript('qPSjbzNomgk').then(res => { console.log(res.map(i => i.text).join(' ')); }).catch(console.error);
