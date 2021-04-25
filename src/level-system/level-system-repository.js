const userLevelTable = 'user_level';

/**
 * Repository for the level-system to access the database
 */
class LevelSystemRepository {

    constructor(dao) {
        this.dao = dao;
    }

    /**
     * Create the required Table in the database
     * @returns {Promise<*>}
     */
    async createTable() {
        const sql = `
            CREATE TABLE IF NOT EXISTS ${userLevelTable} (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_tag TEXT UNIQUE,
                experience INTEGER
            )`;

        return this.dao.run(sql);
    }

    /**
     * Returns user info and creates user if not exist
     * @param userTag
     * @returns {Promise<*>}
     */
    async getUser(userTag) {
        let user = await this.dao.get(`SELECT * FROM ${userLevelTable} WHERE user_tag = ?`, [userTag]);
        if (!user) {
            await this.dao.run(
                `INSERT INTO ${userLevelTable} (user_tag, experience)
                    VALUES (?, ?)`,
                [userTag, 0]
            );
            user = await this.dao.get(`SELECT * FROM ${userLevelTable} WHERE user_tag = ?`, [userTag]);
        }
        return user;
    }

    /**
     * Get the total exp of a user
     * @param userTag
     * @returns {Promise<*>}
     */
    async getExperience(userTag) {
        let user = await this.getUser(userTag);
        return user['experience'];
    }

    /**
     * Add exp to a user
     * @param userTag
     * @param exp
     * @returns {Promise<*>}
     */
    async addExperience(userTag, exp) {
        let user = await this.getUser(userTag);
        let newExp = user['experience'] + exp;

        this.dao.run(
            `UPDATE ${userLevelTable} SET experience = ? WHERE id = ?`,
            [newExp, user['id']]
        )

        return newExp;
    }
}

module.exports = LevelSystemRepository;