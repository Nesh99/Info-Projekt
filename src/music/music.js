const ytdl = require('ytdl-core')

class Music {


    constructor() {
        this.queue = new Map();
    }



    async execute(message, args){

        const serverQueue = this.queue.get(message.guild.id);
        const url = args[0];

        const voiceChannel= message.member.voice.channel;
        if(!voiceChannel)
            return message.channel.send("You have to be in that voice channel to play music!");

        const permissions = voiceChannel.permissionsFor(message.client.user);
        if (!permissions.has("CONNECT") || !permissions.has("SPEAK")){
            return message.channel.send("I need the permissions to join and speak in your voice channel!");
        }

        const songInfo = await ytdl.getInfo(url);
        const song = {
            title: songInfo.videoDetails.title,
            url: songInfo.videoDetails.video_url,
        };

        if (!serverQueue) {
        }
        else {
            serverQueue.songs.push(song);
            console.log(serverQueue.songs);
            return message.channel.send(`${song.title} has been added to the queue!`);
        }

        const queueContruct = {
            textChannel: message.channel,
            voiceChannel: voiceChannel,
            connection: null,
            songs: [],
            volume: 5,
            playing: true,
        };
        // Setting the queue using our contract
        this.queue.set(message.guild.id, queueContruct);
        // Pushing the song to our songs array
        queueContruct.songs.push(song);

        try {
            // Here we try to join the voicechat and save our connection into our object.
            queueContruct.connection = await voiceChannel.join();
            // Calling the play function to start a song
            this.play(message, queueContruct.songs[0]);
        } catch (err) {
            // Printing the error message if the bot fails to join the voicechat
            console.log(err);
            this.queue.delete(message.guild.id);
            return message.channel.send(err);
        }


    }

    play(message, song) {
        // const queue = message.client.queue;
        const guild = message.guild;
        const serverQueue = this.queue.get(message.guild.id);

        if (!song) {
            serverQueue.voiceChannel.leave();
            this.queue.delete(guild.id);
            return;
        }

        const dispatcher = serverQueue.connection
            .play(ytdl(song.url))
            .on("finish", () => {
                serverQueue.songs.shift();
                this.play(message, serverQueue.songs[0]);
            })
            .on("error", error => console.error(error));
        dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
        serverQueue.textChannel.send(`Start playing: **${song.title}**`);
    }

    skip(message) {
        const serverQueue = this.queue.get(message.guild.id);
        if (!message.member.voice.channel)
            return message.channel.send("You have to be in a voice channel to stop the music!");
        if (!serverQueue)
            return message.channel.send("There is no song that I could skip!");
        serverQueue.connection.dispatcher.end();
    }

    stop(message) {
        const serverQueue = this.queue.get(message.guild.id);
        if (!message.member.voice.channel)
            return message.channel.send("You have to be in a voice channel to stop the music!");

        if (!serverQueue)
            return message.channel.send("There is no song that I could stop!");

        serverQueue.songs = [];
        serverQueue.connection.dispatcher.end();
    }

}

module.exports = Music;