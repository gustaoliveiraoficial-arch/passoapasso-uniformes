import {YoutubeTranscript} from 'youtube-transcript'; YoutubeTranscript.fetchTranscript('qPSjbzNomgk').then(res => { console.log(res.map(i => i.text).join(' ')); }).catch(console.error);
