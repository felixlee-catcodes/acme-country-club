const Sequelize = require('sequelize');
const db = new Sequelize('postgres://localhost/acme-country-club-db');

const Member = db.define('member', {
    id: {
        type: Sequelize.UUID, 
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4
    }, 
    name: {
        type: Sequelize.STRING(20)
    }
});

const Facility = db.define('facility', {
    id: {
        type: Sequelize.UUID, 
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4
    }, 
    name: {
        type: Sequelize.STRING(20)
    }
});

const Booking = db.define('booking', {
    id: {
        type: Sequelize.UUID, 
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4
    }
})

Booking.belongsTo(Facility);
Facility.hasMany(Booking);


Booking.belongsTo(Member, {as: 'booker'})

Member.belongsTo(Member, {as: 'sponsor'});
Member.hasMany(Member, {as: 'sponsee', foreignKey: 'sponsorId'});

const start = async()=> {
   try{
    await db.sync({force: true});

    const [ el, mike, nancy, pool, tennis, squash] = await Promise.all([
        Member.create({name: 'el'}), 
        Member.create({name: 'mike'}),
        Member.create({name: 'nancy'}), 
        Facility.create({name: 'pool'}),
        Facility.create({name: 'tennis'}),
        Facility.create({name: 'squash'})
    ]);
    await Promise.all([
        Booking.create({bookerId: el.id, facilityId: pool.id})
    ])
    console.log(await Member.findAll());
    console.log(await Booker.findAll());

}
catch(ex){
    console.log(ex);
}
}

start();