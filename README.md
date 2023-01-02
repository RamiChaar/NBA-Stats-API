# NBA-Stats-API

A RESTful API which retrieves data on NBA player statistics. Data includes general player information, as well as season statistical averages for each season every player has played in. Data can be queried from all NBA seasons (1949-50 season the 2021-22) and from all NBA teams that exist and have existed in the past (68 total).

Data does not include statistics from the ABA or BAA.

## Sending API Requests and Response Examples

#### Definitions

player id: The first five letters of their first name followed by the first two letters of their last name.
<br>
team id: The three character abbreviation used to identify each team, a list can be found [here](#team-list).
<br>
year: The year in any given query is the year a chosen season begins, ex: 2003-2004 -> 2003

### To request all data on a player:

Use the end point '/api/v1/player' with an id parameter as their player id.

ex: Anthony Edwards

Request:

```url
https://baseurl.com/api/v1/player?id=edwaran
```

Response (200):

```
{
  "playerId": "edwaran01",
  "name": "Anthony Edwards",
  "birthDate": "August 5 2001",
  "colleges": "Georgia",
  "position": "G",
  "playedFrom": 2021,
  "playedTo": 2023,
  "weight": 225,
  "height": {
    "feet": 6,
    "inches": 4
  },
  "seasonAverages": [
    {
      "season": "2020-2021",
      "team": "MIN",
      "position": "SG",
      "age": 19,
      "gamesPlayed": 72,
      "gamesStarted": 55,
      "avgMinutes": 32.1,
      "avgFG": 7,
      "avgFGA": 16.8,
      "FGpercentage": 0.417,
      "avgTwoPointFG": 4.6,
      "avgTwoPointFGA": 9.6,
      "twoPointFGpercentage": 0.483,
      "avgThreePointFG": 2.4,
      "avgThreePointFGA": 7.2,
      "threePointFGpercentage": 0.329,
      "eFGpercentage": 0.488,
      "avgFT": 2.9,
      "avgFTA": 3.8,
      "FTpercentage": 0.776,
      "avgPTS": 19.3,
      "avgAST": 2.9,
      "avgRB": 4.7,
      "avgORB": 0.8,
      "avgDRB": 3.8,
      "avgSTL": 1.1,
      "avgBLK": 0.5,
      "avgTOV": 2.2,
      "avgPF": 1.8
    },
    {
      "season": "2021-2022",
      "team": "MIN",
      "position": "SG",
      "age": 20,
      "gamesPlayed": 72,
      "gamesStarted": 72,
      "avgMinutes": 34.3,
      "avgFG": 7.6,
      "avgFGA": 17.3,
      "FGpercentage": 0.441,
      "avgTwoPointFG": 4.6,
      "avgTwoPointFGA": 8.9,
      "twoPointFGpercentage": 0.519,
      "avgThreePointFG": 3,
      "avgThreePointFGA": 8.4,
      "threePointFGpercentage": 0.357,
      "eFGpercentage": 0.527,
      "avgFT": 3.1,
      "avgFTA": 3.9,
      "FTpercentage": 0.786,
      "avgPTS": 21.3,
      "avgAST": 3.8,
      "avgRB": 4.8,
      "avgORB": 0.9,
      "avgDRB": 3.9,
      "avgSTL": 1.5,
      "avgBLK": 0.6,
      "avgTOV": 2.6,
      "avgPF": 2.3
    }
  ]
}
```

### To request data on a players single season:

Use the end point '/api/v1/player' with an id parameter as their player id, and a year parameter to select the season.

ex: Michael Jordan 1996-1997

Request:

```url
https://baseurl.com/api/v1/player?id=jordami&year=1996
```

Response (200):

```
{
  "playerId": "jordami01",
  "name": "Michael Jordan",
  "birthDate": "February 17 1963",
  "colleges": "UNC",
  "position": "G-F",
  "playedFrom": 1985,
  "playedTo": 2003,
  "weight": 198,
  "height": {
    "feet": 6,
    "inches": 6
  },
  "1996-1997": [
    {
      "season": "1996-1997",
      "team": "CHI",
      "position": "SG",
      "age": 33,
      "gamesPlayed": 82,
      "gamesStarted": 82,
      "avgMinutes": 37.9,
      "avgFG": 11.2,
      "avgFGA": 23.1,
      "FGpercentage": 0.486,
      "avgTwoPointFG": 9.9,
      "avgTwoPointFGA": 19.5,
      "twoPointFGpercentage": 0.507,
      "avgThreePointFG": 1.4,
      "avgThreePointFGA": 3.6,
      "threePointFGpercentage": 0.374,
      "eFGpercentage": 0.516,
      "avgFT": 5.9,
      "avgFTA": 7,
      "FTpercentage": 0.833,
      "avgPTS": 29.6,
      "avgAST": 4.3,
      "avgRB": 5.9,
      "avgORB": 1.4,
      "avgDRB": 4.5,
      "avgSTL": 1.7,
      "avgBLK": 0.5,
      "avgTOV": 2,
      "avgPF": 1.9
    }
  ]
}
```

### To request data on all players in a team over a selected season:

Use the end point '/api/v1/team' with an id parameter as the team id, and a year parameter to select the season.

ex: 2000-2001 Los Angeles Lakers

Request:

```url
https://baseurl.com/api/v1/team?id=LAL&year=2000
```

Response (200):

```
{
  "teamId": "LAL",
  "team": "Los Angeles Lakers",
  "season": "2000-2001",
  "playerAverages": [
    {
      "playerId": "bryanko01",
      "name": "Kobe Bryant",
      "position": "SG",
      "age": 22,
      "gamesPlayed": 68,
      "gamesStarted": 68,
      "avgMinutes": 40.9,
      "avgFG": 10.3,
      "avgFGA": 22.2,
      "FGpercentage": 0.464,
      "avgTwoPointFG": 9.4,
      "avgTwoPointFGA": 19.3,
      "twoPointFGpercentage": 0.489,
      "avgThreePointFG": 0.9,
      "avgThreePointFGA": 2.9,
      "threePointFGpercentage": 0.305,
      "eFGpercentage": 0.484,
      "avgFT": 7,
      "avgFTA": 8.2,
      "FTpercentage": 0.853,
      "avgPTS": 28.5,
      "avgAST": 5,
      "avgRB": 5.9,
      "avgORB": 1.5,
      "avgDRB": 4.3,
      "avgSTL": 1.7,
      "avgBLK": 0.6,
      "avgTOV": 3.2,
      "avgPF": 3.3
    },
    {
      "playerId": "fishede01",
      "name": "Derek Fisher",
      "position": "PG",
      "age": 26,
      "gamesPlayed": 20,
      "gamesStarted": 20,
      "avgMinutes": 35.5,
      "avgFG": 3.9,
      "avgFGA": 9.4,
      "FGpercentage": 0.412,
      "avgTwoPointFG": 2.6,
      "avgTwoPointFGA": 6.2,
      "twoPointFGpercentage": 0.419,
      "avgThreePointFG": 1.3,
      "avgThreePointFGA": 3.2,
      "threePointFGpercentage": 0.397,
      "eFGpercentage": 0.479,
      "avgFT": 2.5,
      "avgFTA": 3.1,
      "FTpercentage": 0.806,
      "avgPTS": 11.5,
      "avgAST": 4.4,
      "avgRB": 3,
      "avgORB": 0.3,
      "avgDRB": 2.7,
      "avgSTL": 2,
      "avgBLK": 0.1,
      "avgTOV": 1.5,
      "avgPF": 2.5
    },
    ...
  ]
}
```

### Additional Information

Conflicting player ID's: Some players have the same player id, in which case a 409 error will be caught and you will be provided multiple different ids to select from.

ex: Damian Jones

request:

```url
https://baseurl.com/api/v1/player?id=jonesda
```

Response (409):

```
{
  "error": "3 player matches for 'jonesda'.",
  "response": "please resend request with specific PlayerId.",
  "matches": [
    {
      "playerId": "jonesda01",
      "name": "Damon Jones",
      "playedFrom": 1999,
      "playedTo": 2009
    },
    {
      "playerId": "jonesda02",
      "name": "Dahntay Jones",
      "playedFrom": 2004,
      "playedTo": 2017
    },
    {
      "playerId": "jonesda03",
      "name": "Damian Jones",
      "playedFrom": 2017,
      "playedTo": 2023
    }
  ]
}
```

In this case you must 'id=jonesda03' to query Damian Jones

\*_Players with the same id have a numerical extension based on the order they played their first season_\*

## Tools Used

- VS Code
- Node.js
- Express.js
- MongoDB
- Testing: Insomnia, MongoDB Compass

## References

Basketball Reference - https://www.basketball-reference.com

## Team List:

    AND: Anderson Packers
    ATL: Atlanta Hawks
    BAL: Baltimore Bullets (1963-1973)
    BLB: Baltimore Bullets (1947-1955)
    BOS: Boston Celtics
    BRK: Brooklyn Nets
    BUF: Buffalo Braves
    CAP: Capital Bullets
    CHA: Charlotte Bobcats
    CHH: Charlotte Hornets (1989-2002)
    CHI: Chicago Bulls
    CHO: Charlotte Hornets (2014-2022)
    CHP: Chicago Packers
    CHS: Chicago Stags
    CHZ: Chicago Zephyrs
    CIN: Cincinnati Royals
    CLE: Cleveland Cavaliers
    DAL: Dallas Mavericks
    DEN: Denver Nuggets (1976-2022)
    DET: Detroit Pistons
    DNN: Denver Nuggets (1949-1950)
    FTW: Fort Wayne Pistons
    GSW: Golden State Warriors
    HOU: Houston Rockets
    IND: Indiana Pacers
    INO: Indianapolis Olympians
    KCK: Kansas City Kings
    KCO: Kansas City-Omaha Kings
    LAC: Los Angeles Clippers
    LAL: Los Angeles Lakers
    MEM: Memphis Grizzlies
    MIA: Miami Heat
    MIL: Milwaukee Bucks
    MIN: Minnesota Timberwolves
    MLH: Milwaukee Hawks
    MNL: Minneapolis Lakers
    NJN: New Jersey Nets
    NOH: New Orleans Hornets
    NOJ: New Orleans Jazz
    NOK: NO/Ok. City Hornets
    NOP: New Orleans Pelicans
    NYK: New York Knicks
    NYN: New York Nets
    OKC: Oklahoma City Thunder
    ORL: Orlando Magic
    PHI: Philadelphia 76ers
    PHO: Phoenix Suns
    PHW: Philadelphia Warriors
    POR: Portland Trail Blazers
    ROC: Rochester Royals
    SAC: Sacramento Kings
    SAS: San Antonio Spurs
    SDC: San Diego Clippers
    SDR: San Diego Rockets
    SEA: Seattle SuperSonics
    SFW: San Francisco Warriors
    SHE: Sheboygan Red Skins
    STB: St. Louis Bombers
    STL: St. Louis Hawks
    SYR: Syracuse Nationals
    TOR: Toronto Raptors
    TRI: Tri-Cities Blackhawks
    UTA: Utah Jazz
    VAN: Vancouver Grizzlies
    WAS: Washington Wizards
    WAT: Waterloo Hawks
    WSB: Washington Bullets
    WSC: Washington Capitols
