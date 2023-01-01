require('dotenv').config();

const express = require('express');
const app = express();
const PORT = 8080;
app.use(express.json());
app.listen(
    PORT,
    () => console.log(`live on http://localhost:${PORT}`)
);

const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true});
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to Database'));

const Player = require('./player');
const SeasonAvg = require('./seasonAvg');

const teamIdsObj = {
    AND:"Anderson Packers",
    ATL:"Atlanta Hawks",
    BAL:"Baltimore Bullets (1963-1973)",
    BLB:"Baltimore Bullets (1947-1955)",
    BOS:"Boston Celtics",
    BRK:"Brooklyn Nets",
    BUF:"Buffalo Braves",
    CAP:"Capital Bullets",
    CHA:"Charlotte Bobcats",
    CHH:"Charlotte Hornets (1989-2002)",
    CHI:"Chicago Bulls",
    CHO:"Charlotte Hornets (2014-2022)",
    CHP:"Chicago Packers",
    CHS:"Chicago Stags",
    CHZ:"Chicago Zephyrs",
    CIN:"Cincinnati Royals",
    CLE:"Cleveland Cavaliers",
    DAL:"Dallas Mavericks",
    DEN:"Denver Nuggets (1976-2022)",
    DET:"Detroit Pistons",
    DNN:"Denver Nuggets (1949-1950)",
    FTW:"Fort Wayne Pistons",
    GSW:"Golden State Warriors",
    HOU:"Houston Rockets",
    IND:"Indiana Pacers",
    INO:"Indianapolis Olympians",
    KCK:"Kansas City Kings",
    KCO:"Kansas City-Omaha Kings",
    LAC:"Los Angeles Clippers",
    LAL:"Los Angeles Lakers",
    MEM:"Memphis Grizzlies",
    MIA:"Miami Heat",
    MIL:"Milwaukee Bucks",
    MIN:"Minnesota Timberwolves",
    MLH:"Milwaukee Hawks",
    MNL:"Minneapolis Lakers",
    NJN:"New Jersey Nets",
    NOH:"New Orleans Hornets",
    NOJ:"New Orleans Jazz",
    NOK:"NO/Ok. City Hornets",
    NOP:"New Orleans Pelicans",
    NYK:"New York Knicks",
    NYN:"New York Nets",
    OKC:"Oklahoma City Thunder",
    ORL:"Orlando Magic",
    PHI:"Philadelphia 76ers",
    PHO:"Phoenix Suns",
    PHW:"Philadelphia Warriors",
    POR:"Portland Trail Blazers",
    ROC:"Rochester Royals",
    SAC:"Sacramento Kings",
    SAS:"San Antonio Spurs",
    SDC:"San Diego Clippers",
    SDR:"San Diego Rockets",
    SEA:"Seattle SuperSonics",
    SFW:"San Francisco Warriors",
    SHE:"Sheboygan Red Skins",
    STB:"St. Louis Bombers",
    STL:"St. Louis Hawks",
    SYR:"Syracuse Nationals",
    TOR:"Toronto Raptors",
    TRI:"Tri-Cities Blackhawks",
    UTA:"Utah Jazz",
    VAN:"Vancouver Grizzlies",
    WAS:"Washington Wizards",
    WAT:"Waterloo Hawks",
    WSB:"Washington Bullets",
    WSC:"Washington Capitols",
};
const teamsYears = {
    AND:'1949-1949',
    ATL:'1968-2021',
    BAL:'1963-1972',
    BLB:'1949-1954',
    BOS:'1949-2021',
    BRK:'2012-2021',
    BUF:'1970-1977',
    CAP:'1949-1950',
    CHA:'2004-2013',
    CHH:'1988-2001',
    CHI:'1966-2021',
    CHO:'2014-2021',
    CHP:'1961-1961',
    CHS:'1949-1949',
    CHZ:'1962-1962',
    CIN:'1957-1971',
    CLE:'1970-2021',
    DAL:'1980-2021',
    DEN:'1976-2021',
    DET:'1957-2021',
    DNN:'1949-1949',
    FTW:'1949-1956',
    GSW:'1971-2021',
    HOU:'1971-2021',
    IND:'1976-2021',
    INO:'1949-1952',
    KCK:'1975-1984',
    KCO:'1972-1974',
    LAC:'1984-2021',
    LAL:'1960-2021',
    MEM:'2001-2021',
    MIA:'1988-2021',
    MIL:'1968-2021',
    MIN:'1989-2021',
    MLH:'1951-1954',
    MNL:'1949-1959',
    NJN:'1977-2011',
    NOH:'2002-2012',
    NOJ:'1974-1978',
    NOK:'2005-2006',
    NOP:'2013-2021',
    NYK:'1949-2021',
    NYN:'1976-1976',
    OKC:'2008-2021',
    ORL:'1989-2021',
    PHI:'1963-2021',
    PHO:'1968-2021',
    PHW:'1949-1961',
    POR:'1970-2021',
    ROC:'1949-1956',
    SAC:'1985-2021',
    SAS:'1976-2021',
    SDC:'1978-1983',
    SDR:'1967-1970',
    SEA:'1967-2007',
    SFW:'1962-1970',
    SHE:'1949-1949',
    STB:'1949-1949',
    STL:'1955-1967',
    SYR:'1949-1962',
    TOR:'1995-2021',
    TRI:'1949-1950',
    UTA:'1979-2021',
    VAN:'1995-2000',
    WAS:'1997-2021',
    WAT:'1949-1949',
    WSB:'1974-1996',
    WSC:'1973-1973',
};

app.get('/api/player', (req, res) => {

    const queryId = req.query.id;
    const year = parseInt(req.query.year);
    
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

    getPlayers(req, res);
});

app.get('/api/team', (req, res) => {
    const team = req.query.id;
    const year = parseInt(req.query.year);

    if (team === undefined){
        res.status(200).send({
            error: `must provide a team id. ex: 2000-2001 Los Angeles Lakers -> ?id=LAL&year=2000`,
            response: "The following object provides the team id's for every queryable team:",
            ids: teamIdsObj
        })
        return;
    }

    if(!teamIdsObj.hasOwnProperty(team.toUpperCase())){
        res.status(200).send({
            error: `${team} is not a valid team id`,
            response: "The following object provides the team id's for every queryable team:",
            ids: teamIdsObj
        })
        return;
    }

    if(req.query.year === undefined){
        res.status(200).send({
            error: `no year provided`,
            response: "must provide a year to query, year must be a number between 1949 and 2021 inclusive. ex: 2000-2001 Los Angeles Lakers -> ?id=LAL&year=2000",
        })
        return;
    }
    
    if(req.query.year !== undefined && ( isNaN(year) || (1949 > year || year > 2021) )){
        res.status(200).send({
            error: `${req.query.year} is an invalid year`,
            response: "year must be a number between 1949 and 2021 inclusive. ex: 2000-2001 Los Angeles Lakers -> ?id=LAL&year=2000"
        })
        return;
    }

    getTeam(req, res);
})

async function getPlayers(req, res){
    const queryId = req.query.id;
    const year = parseInt(req.query.year);
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

            let playerObj = createPlayerObj(queriedPlayers[0]);

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
                let seasonObj = createSeasonObj(season, "player");
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
                    playerId : player.PlayerAdditional,
                    name : player.Player,
                    playedFrom : player.From,
                    playedTo : player.To,
                }
                playerArr.push(playerObj)
            })

            res.status(200).send({
                error: `${[playerArr.length]} player matches for \'${queryId}\'.`,
                response: "please resend request with specific PayerId.",
                matches: playerArr,
            })
            return;
        }

    } catch(e) {
        console.log(e);
    }
}
async function getTeam(req, res) {
    const team = req.query.id;
    const year = parseInt(req.query.year);
    try{
        const teamSeasonAvgs = await SeasonAvg.find({ Tm : team.toUpperCase(), Year : new RegExp( year + '-.*')});

        if(teamSeasonAvgs.length === 0) {
            res.status(200).send({
                error: `invalid year for ${teamIdsObj[team.toUpperCase()]}`,
                response: `${teamIdsObj[team.toUpperCase()]} have no record during the ${year}-${(year+1)} season, please try a year between ${teamsYears[team.toUpperCase()]}`
            })
            return;
        }

        let playersAvgs = [];
        teamSeasonAvgs.forEach( (playerAvg) => {
            let playerObj = createSeasonObj(playerAvg, "team");
            playersAvgs.push(playerObj);
        })

        sortPlayersByLastName(playersAvgs);

        res.status(200).send({
            teamId: team.toUpperCase(),
            team: teamIdsObj[team.toUpperCase()],
            season: `${year}-${(year+1)}`,
            playerAverages: playersAvgs
        })
        return;

        
    } catch(e) {
        console.log(e);
    }
}
function createPlayerObj(player) {
    let playerObj = {
        playerId : player.PlayerAdditional,
        name : player.Player,
        birthDate : player.BirthDate,
        colleges : player.Colleges,
        position : player.Pos,
        playedFrom : player.From,
        playedTo : player.To,
        weight : player.Weight,
        height : {
            feet : player.Feet,
            inches : player.Inches
        },
    }
    return playerObj;
}
function createSeasonObj(season, type) {
    let seasonObj = {};
    let year = parseInt(season.Year.substring(0, 4));
    if(type === "player"){
        seasonObj["season"] = season.Year;
        seasonObj["team"] = season.Tm;
    } else if(type === "team"){
        seasonObj["playerId"] = season.PlayerAdditional;
        seasonObj["name"] = season.Player;
    } else {
        return {error: "incorrect type"}
    }

    let limit1980 = {};
    let limit1979 = {};
    let limit1976 = {}; 
    let limit1972 = {}; 
    let limit1950 = {};
    let limit1949 = {};

    if(year >1980){
        limit1980 = {
            gamesStarted : season.GS,
        }
    }
    if(year > 1979){
        limit1979 = {
            avgThreePointFG : season.ThreePoint,
            avgThreePointFGA : season.ThreePointAtt,
            threePointFGpercentage : season.ThreePointPer,
        };
    }
    if(year >1976){
        limit1976 = {
            avgTOV : season.TOV,
        }; 
    }
    if(year >1972){
        limit1972 = {
            avgORB : season.ORB,
            avgDRB : season.DRB,
            avgSTL : season.STL,
            avgBLK : season.BLK,
        }; 
    }
    if(year >1950){
        limit1950 = {
            avgMinutes :season.MP,
        };
    }
    if(year >1949){
        limit1949 = {
            avgRB : season.TRB,
        };
    }

    let seasonObjFinal = {
        ...seasonObj,
        position : season.Pos,
        age : season.Age,
        gamesPlayed : season.G,
        ...limit1980,
        ...limit1950,

        avgFG : season.FG,
        avgFGA : season.FGA,
        FGpercentage : season.FGPer,

        avgTwoPointFG : season.TwoPoint,
        avgTwoPointFGA : season.TwoPointAtt,
        twoPointFGpercentage : season.TwoPointPer,

        ...limit1979,

        eFGpercentage : season.EffFGPer,

        avgFT : season.FT,
        avgFTA : season.FTA,
        FTpercentage : season.FTPer,

        avgPTS : season.PTS,
        avgAST : season.AST,
        ...limit1949,
        ...limit1972,
        ...limit1976,
        avgPF : season.PF,
    };
    
    return seasonObjFinal;
}
function sortPlayersByLastName(playersAvgs) {
    playersAvgs.forEach((playerAvg) => {
        let lastName = playerAvg.name.split(' ').slice(1)[0];
        playerAvg['lastName'] = lastName;
    })
    playersAvgs.sort((player1, player2) => {
        if ( player1.lastName < player2.lastName ){
            return -1;
        }
        if ( player1.lastName > player2.lastName ){
            return 1;
        }
        return 0;
    });
    playersAvgs.forEach((playerAvg) => {
        delete playerAvg.lastName;
    })
}