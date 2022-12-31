require('dotenv').config();
const { response } = require('express');
const express = require('express');
const app = express();
const PORT = 8080;
app.use(express.json());

app.listen(
    PORT,
    () => console.log(`live on http://localhost:${PORT}`)
);

//mongoose
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true});
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to Database'));

const Player = require('./player');
const SeasonAvg = require('./seasonAvg');

app.get('/api/player', (req, res) => {

    const queryId = req.query.id;
    const year = parseInt(req.query.year);
    console.log(year)
    
    if(queryId === undefined){
        res.status(200).send({
            error: "no query id",
            response: "must provide query id in url, composed of first 5 letters of last name followed by first 2 letters of first name. ex: Michael Jordan -> ?id=jordami"
        })
        return;
    }

    if( req.query.year !== undefined && ( isNaN(year) || (1949 > year || year > 2021) )){
        res.status(200).send({
            error: `${req.query.year} is an invalid year`,
            response: "year must be a number between 1949 and 2021 inclusive. ex: Larry Bird's 1981-1982 season -> ?id=birdla&year=1981"
        })
        return;
    }

    getPlayers();
    async function getPlayers(){
        try {

            const queriedPlayers = await Player.find({ PlayerAdditional : new RegExp( queryId + '.*', 'i')});

            if(queriedPlayers.length === 0) {

                res.status(200).send({
                    error: `no matches for ${queryId}`,
                    response: "query id composed of first 5 letters of last name followed by first 2 letters of first name. ex: Michael Jordan -> ?id=jordami"
                })

                return;

            }
            
            if(queriedPlayers.length === 1) {

                let playerObj = {
                    PlayerId : queriedPlayers[0].PlayerAdditional,
                    name : queriedPlayers[0].Player,
                    BirthDate : queriedPlayers[0].BirthDate,
                    position : queriedPlayers[0].Pos,
                    playedFrom : queriedPlayers[0].From,
                    playedTo : queriedPlayers[0].To,
                    Weight : queriedPlayers[0].Weight,
                    height : {
                        feet : queriedPlayers[0].Feet,
                        inches : queriedPlayers[0].Inches
                    },
                    Colleges : queriedPlayers[0].Colleges,
                }

                let seasonAverages = [];

                if(req.query.year !== undefined){

                    seasonAverages = await SeasonAvg.find({ PlayerAdditional : queriedPlayers[0].PlayerAdditional, Year : new RegExp( year + '-.*')});

                    if(seasonAverages.length === 0){
                        res.status(200).send({
                            error: `${playerObj.name} has no record during the ${year}-${(year+1)} season`,
                            response: `${playerObj.name} played between the seasons of ${queriedPlayers[0].From-1}-${queriedPlayers[0].From} and ${queriedPlayers[0].To-1}-${queriedPlayers[0].To}`,
                        })
                        return;
                    }

                } else {

                    seasonAverages = await SeasonAvg.find({ PlayerAdditional : queriedPlayers[0].PlayerAdditional}).sort({Age : 1});

                }
                    
                let seasonsArr = [];
                seasonAverages.forEach((season) => {
                    let seasonObj = {
                        season : season.Year,
                        team : season.Tm,
                        position : season.Pos,
                        age : season.Age,
                        gamesPlayed : season.G,
                        gamesStarted : season.GS,
                        avgMinutes :season.MP,

                        avgFG : season.FG,
                        avgFGA : season.FGA,
                        FGpercentage : season.FGPer,

                        avgTwoPointFG : season.TwoPoint,
                        avgTwoPointFGA : season.TwoPointAtt,
                        TwoPointFGpercentage : season.TwoPointPer,

                        avgThreePointFG : season.ThreePoint,
                        avgThreePointFGA : season.ThreePointAtt,
                        ThreePointFGpercentage : season.ThreePointPer,

                        eFGpercentage : season.EffFGPer,

                        avgFT : season.FT,
                        avgFTA : season.FTA,
                        FTpercentage : season.FTPer,

                        avgPTS : season.PTS,
                        avgAST : season.AST,
                        avgRB : season.TRB,
                        avgORB : season.ORB,
                        avgDRB : season.DRB,
                        avgSTL : season.STL,
                        avgBLK : season.BLK,
                        avgTOV : season.TOV,
                        avgPF : season.PF,
                    };
                    seasonsArr.push(seasonObj);
                })
                
                if(req.query.year !== undefined){
                    playerObj[year + '-' + (year+1)] = seasonsArr;
                } else {
                    playerObj["seasonAverages"] = seasonsArr;
                }

                res.status(200).send(playerObj)

                return;

            }
            
            if(queriedPlayers.length > 1) {
                let playerArr = [];
                queriedPlayers.forEach((player) => {
                    playerObj = {
                        PlayerId : player.PlayerAdditional,
                        name : player.Player,
                        playedFrom : player.From,
                        playedTo : player.To,
                    }
                    playerArr.push(playerObj)
                })

                res.status(200).send({
                    error: `multiple matches for ${queryId}`,
                    matches: playerArr,
                    response: "please resend request with specific PayerId"
                })
                return;
            }

        } catch(e) {
            console.log(e);
        }
    }
});