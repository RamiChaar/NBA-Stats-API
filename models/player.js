const mongoose = require('mongoose');

const playerSchema = mongoose.Schema({
    Player : String,
    From : Number,
    To : Number,
    Pos : String,
    Feet : Number,
    Inches : Number,
    Weight : Number,
    Colleges : String,
    BirthDate : String,
    PlayerAdditional : String
});

module.exports = mongoose.model("player", playerSchema);