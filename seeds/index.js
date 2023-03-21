const mongoose = require('mongoose');
const Card = require('../models/card');

mongoose.connect('mongodb://localhost:27017/LawStudyApp')
    .then(() => {
        console.log("Connected to MongoDB to seed!")
    })
    .catch(err => {
        console.log("Oh no, error connecting to MongoDB to seed")
        console.log(err)
    })

    const seedDB = async () => { 
        await Card.deleteMany({});
        for( i = 1; i < 5; i++){
            const author = `Jakub ${i}`
            const card = new Card({
                topic: 'trestnipravo',
                pageA: 'Dělení trestných činů',
                pageB: 'Přečiny a zločiny',
                author
            })
            await card.save()
        }
        for( i = 1; i < 5; i++){
            const author = `Jakub ${i}`
            const card = new Card({
                topic: 'obcanskepravo',
                pageA: 'Dělení věcí',
                pageB: 'Hmotné a nehmotné, <b>movité a nemovité</b>',
                author
            })
            await card.save()
        }
    }

    seedDB().then(() => {
        mongoose.connection.close();
    })