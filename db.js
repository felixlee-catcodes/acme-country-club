const Sequelize = require('sequelize');
const { UUID, UUIDV4, STRING } = Sequelize;
const db = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost/acme-country-club-db');

const Member = db.define('member', {
    id: {
        type: UUID, 
        primaryKey: true,
        defaultValue: UUIDV4
    }, 
    name: {
        type: STRING(20), 
        allowNull: false, 
        unique: true
    }
});
//why use UUID?: makes all IDs in database unique ("if you have an integer ID, there are tons of repeats in the database. there will be items whose ids are 1, 2, 3 in table A and also in table B")
const Facility = db.define('facility', {
    id: {
        type: UUID, 
        primaryKey: true,
        defaultValue: UUIDV4
    }, 
    name: {
        type: STRING(20), 
        allowNull: false
    }
});

const Booking = db.define('booking', {
    id: {
        type: UUID, 
        primaryKey: true,
        defaultValue: UUIDV4
    }
})

Booking.belongsTo(Facility);
Facility.hasMany(Booking);

Booking.belongsTo(Member, {as: 'booker'})

Member.belongsTo(Member, {as: 'sponsor'});
Member.hasMany(Member, {as: 'sponsored', foreignKey: 'sponsorId'});

module.exports = {
    db, 
    Member, 
    Facility, 
    Booking
}

