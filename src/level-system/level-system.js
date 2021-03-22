const AppDAO = require('../sqlite/dao')
const LevelSystemRepository = require('./level-system-repository')

class LevelSystem {

    constructor() {
        const dao = new AppDAO('./level-system-database.sqlite3');
        this.repo = new LevelSystemRepository(dao);
        this.repo.createTable().then((result) => {
            console.log('created level-system-db');
        });

    }

    handleCommand(message, args) {

        if (args.length < 1) {
            this.sendLevelInfo(message);
        }

    }

    handleMessage(message) {
        let tag = message.author.tag;

        this.repo.addExperience(tag, 10).then((newExp) => {
            if (LevelSystem.calcLevel(newExp) > LevelSystem.calcLevel(newExp - 10)) {
                message.channel.send(
                    `${message.author}
                    *** LEVEL UP ***
                    Your new level is ${LevelSystem.calcLevel(newExp)}!`
                );
            }
        });
    }

    sendLevelInfo(message) {
        let tag = message.author.tag;

        this.repo.getExperience(tag).then((exp) => {

            // calculate level
            message.channel.send(
                `${message.author} your current level is ${LevelSystem.calcLevel(exp)}
                Current exp: ${LevelSystem.calcCurrentExp(exp)}
                Exp for level up: ${LevelSystem.calcMissingExp(exp)}
                Total exp: ${exp}
                `
            );
        });
    }

    // level-tools:
    static calcLevel(exp) {
        return Math.floor(Math.sqrt( (2 * exp) / 25 + 25 / 4 ) - 5 / 2);
    }

    static calcCurrentExp(exp) {
        return exp - ( ( 25 * Math.pow(LevelSystem.calcLevel(exp), 2) + 125 * LevelSystem.calcLevel(exp) ) / 2 );
    }

    static calcMissingExp(exp) {
        return ( (LevelSystem.calcLevel(exp) + 1) * 25 + 50 ) - LevelSystem.calcCurrentExp(exp);
    }
}

module.exports = LevelSystem;