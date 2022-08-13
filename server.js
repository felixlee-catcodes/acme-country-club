const Sequelize = require('sequelize');
const { UUID, UUIDV4, STRING } = Sequelize;
const { db, Member, Facility, Booking } = require('./db')

const express = require('express');
const app = express();


app.get('/api/facilities', async(req, res, next)=>{
    try{
        const facilities = await Facility.findAll({
            include: [ 
                { model: Booking, 
                    include: [
                        { model: Member, as: 'booker'}
                    ]
                } 
            ]
        });
        res.send(facilities)
    }
    catch(ex){
        next(ex)
    }
});

app.get('/api/bookings', async(req, res, next)=>{
    try{
        const bookings = await Booking.findAll({
            include: [
                {model: Member}
            ]
        });
        res.send(bookings)
    }
    catch(ex){
        next(ex)
    }
});

app.get('/api/members', async(req, res, next)=>{
    try{
        const members = await Member.findAll({
            include: [ 
                {model: Member, as: 'sponsor'}, 
                {model: Member, as: 'sponsored'}
        ]
        });
        res.send(members)
    }
    catch(ex){
        next(ex)
    }
})

const start = async()=> {
   try{
    await db.sync({force: true});
    
    const [ el, mike, nancy, lucas, pool, tennis, squash] = await Promise.all([
        //creating members
        //const [moe, lucy, joe] = await Promise.all(['moe', 'lucy', 'joe'].map(name => Member.create({ name })))
        Member.create({name: 'el'}), 
        Member.create({name: 'mike'}),
        Member.create({name: 'nancy'}),
        Member.create({name: 'lucas'}),
        //creating facilities 
        Facility.create({name: 'pool'}),
        Facility.create({name: 'tennis'}),
        Facility.create({name: 'squash'})
    ]);
    //creating bookings
    await Promise.all([
        Booking.create({bookerId: el.id, facilityId: pool.id}),
        Booking.create({bookerId: lucas.id, facilityId: tennis.id}),
        Booking.create({bookerId: el.id, facilityId: pool.id}),
        Booking.create({bookerId: nancy.id, facilityId: tennis.id})
        
    ])
    el.sponsorId = mike.id;
    lucas.sponsorId = mike.id;
    nancy.sponsorId = lucas.id;
    await el.save();
    await lucas.save();
    await nancy.save();
    console.log(await Member.findAll());
    console.log(await Booking.findAll());

    const port = 3000;
    app.listen(port, ()=> console.log(`listening on port ${port}`))

}
catch(ex){
    console.log(ex);
}
}

start();