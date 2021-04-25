const AppDAO = require('../sqlite/dao')
const LevelSystemRepository = require('./level-system-repository')

/**
 * Class for managing the level-system
 */
class LevelSystem {

    constructor() {
        // Create data access object for connection to database
        const dao = new AppDAO('./level-system-database.sqlite3');
        this.repo = new LevelSystemRepository(dao);
        // Create tables in database for the leve-system
        this.repo.createTable().then((result) => {
            console.log('created level-system-db! \n');
        });

    }

    /**
     * Handle commands from users
     * @param message
     * @param args
     */
    handleCommand(message, args) {

        if (args.length < 1) {
            this.sendLevelInfo(message);
        }

    }

    /**
     * Handle normal messages from users
     * @param message
     */
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

    /**
     * Send level information about the author of the message
     * @param message
     */
    sendLevelInfo(message) {
        let tag = message.author.tag;

        this.repo.getExperience(tag).then((exp) => {

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

    /**
     * Calculate the  current level from total exp
     * @param exp
     * @returns {number}
     */
    static calcLevel(exp) {
        return Math.floor(Math.sqrt( (2 * exp) / 25 + 25 / 4 ) - 5 / 2);
    }

    /**
     * Calculate the current exp in current level from total exp
     * @param exp
     * @returns {number}
     */
    static calcCurrentExp(exp) {
        return exp - ( ( 25 * Math.pow(LevelSystem.calcLevel(exp), 2) + 125 * LevelSystem.calcLevel(exp) ) / 2 );
    }

    /**
     * Calculate the missing exp to level up from total exp
     * @param exp
     * @returns {number}
     */
    static calcMissingExp(exp) {
        return ( (LevelSystem.calcLevel(exp) + 1) * 25 + 50 ) - LevelSystem.calcCurrentExp(exp);
    }
}

module.exports = LevelSystem;