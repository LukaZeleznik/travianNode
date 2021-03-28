/*
let constants = {
    attackType: "full",
    palaceLevel: 0,
    wallLevel: 0,
    basicDefense: 0,
    troopsNumCoef: 1.5
}

let attacker = {
    "_id": "5f12fcf478e7450012cee9c3",
    "idVillage": 1,
    "tribe": "teuton",
    "troop1": 100,
    "troop2": 0,
    "troop3": 0,
    "troop4": 0,
    "troop5": 0,
    "troop6": 50,
    "troop7": 0,
    "troop8": 0,
    "troop9": 0,
    "troop10": 0,
    "__v": 0
}


let defender = {
    "_id": "5f12fcf478e7450012cee9c3",
    "idVillage": 2,
    "tribe": "teuton",
    "troop1": 100,
    "troop2": 0,
    "troop3": 0,
    "troop4": 0,
    "troop5": 0,
    "troop6": 500,
    "troop7": 0,
    "troop8": 0,
    "troop9": 0,
    "troop10": 0,
    "__v": 0
}

calculateCombat(attacker, defender, constants);
*/


const troopInfoLookup = require('../infoTables/troopInfoLookup.json');
module.exports = {
    calculateCombat: function calculateCombat(attacker, defender, constants){
        const infantryType = "infantry";
        const cavalryType = "cavalry";

        let winner;

        let attackerTroops = [];
        let defenderTroops = [];

        let totalInfAttPoints = 0;
        let totalCavAttPoints = 0;
        let totalInfDefPoints = 0;
        let totalCavDefPoints = 0;

        let casualtiesPercentWinner = 0;
        let casualtiesPercentLoser = 0;


        for(let i = 1; i < 11; i++){
            attackerTroops.push(attacker["troop"+i]);
            defenderTroops.push(defender["troop"+i]);
        }

        let totalAttTroops = attackerTroops.reduce((a, b) => a + b, 0);
        let totalDefTroops = defenderTroops.reduce((a, b) => a + b, 0);
        let totalTroops = totalAttTroops + totalDefTroops;

        if(totalTroops > 1000 && totalTroops < 1000000000){
            constants.troopsNumCoef = 2 * (1.8592 - Math.pow(totalTroops, 0.015));
        }
        else if(totalTroops > 1000000000){
            constants.troopsNumCoef = 1.2578;
        }

        for(let i = 0; i < 10; i++){
            if(troopInfoLookup[attacker.tribe][i]['type'] == cavalryType){
                totalCavAttPoints += troopInfoLookup[attacker.tribe][i]['attack'] * attackerTroops[i];
            }
            else{
                totalInfAttPoints += troopInfoLookup[attacker.tribe][i]['attack'] * attackerTroops[i];
            }
            totalInfDefPoints += troopInfoLookup[defender.tribe][i][infantryType + 'Defense'] * defenderTroops[i];
            totalCavDefPoints += troopInfoLookup[defender.tribe][i][cavalryType + 'Defense'] * defenderTroops[i];
        }

        let totalAttPoints = totalInfAttPoints + totalCavAttPoints;
        let totalDefPoints = totalInfDefPoints + totalCavDefPoints;

        let attInfRatio = Number((totalInfAttPoints/totalAttPoints).toFixed(2));
        let realDefPoints = Math.round(attInfRatio * totalInfDefPoints + (1 - attInfRatio) * totalCavDefPoints);

        realDefPoints += constants.basicDefense;
        realDefPoints += 2 * Math.pow(constants.palaceLevel, 2);

        if(defender.tribe == "teuton"){ // ???
            realDefPoints *= Math.round(Math.pow(1.020,constants.wallLevel));
        }

        if(totalAttPoints > realDefPoints && constants.attackType == "full"){
            winner = "attacker";
            casualtiesPercentWinner = 1 * Math.pow((realDefPoints/totalAttPoints),constants.troopsNumCoef);
            casualtiesPercentLoser = 1;    
        }
        else if(totalAttPoints <= realDefPoints && constants.attackType == "full"){
            winner = "defender";
            casualtiesPercentWinner = 1 * Math.pow((totalAttPoints/realDefPoints),constants.troopsNumCoef);
            casualtiesPercentLoser = 1;
        }
        
        if(totalAttPoints > realDefPoints && constants.attackType == "raid"){
            winner = "attacker";
            let x = 1*Math.pow((realDefPoints/totalAttPoints),constants.troopsNumCoef);
            casualtiesPercentWinner = (x/(1+x));
            casualtiesPercentLoser = 1 - casualtiesPercentWinner;    
        }
        else if(totalAttPoints <= realDefPoints && constants.attackType == "raid"){
            winner = "defender";
            let x = 1*Math.pow((totalAttPoints/realDefPoints),constants.troopsNumCoef);
            casualtiesPercentWinner =  (x/(1+x));
            casualtiesPercentLoser = 1 - casualtiesPercentWinner;
        }


        //console.log(totalAttPoints);
        //console.log(totalDefPoints);
        //console.log(realDefPoints);
        //console.log("winner: " + winner);
        //console.log(casualtiesPercentWinner);
        //console.log(casualtiesPercentLoser);
        //console.log(totalInfAttPoints);
        //console.log(totalCavAttPoints);
        //console.log(totalInfDefPoints);
        //console.log(totalCavDefPoints);

        let attackersTroopsAfter = [];
        let defendersTroopsAfter = [];

        if(winner == "attacker"){
            for(let i = 0; i < 10; i++){
                attackersTroopsAfter[i] =  Math.round((attackerTroops[i]*(1-casualtiesPercentWinner)));
                defendersTroopsAfter[i] =  Math.round((defenderTroops[i]*(1-casualtiesPercentLoser)));
            }
        }
        else if(winner == "defender"){
            for(let i = 0; i < 10; i++){
                attackersTroopsAfter[i] =  Math.round((attackerTroops[i]*(1-casualtiesPercentLoser)));
                defendersTroopsAfter[i] =  Math.round((defenderTroops[i]*(1-casualtiesPercentWinner)));
            }
        }

        //console.log(attackersTroopsAfter);
        //console.log(defendersTroopsAfter);

        return({"winner": winner, "attackersTroopsAfter":attackersTroopsAfter, "defendersTroopsAfter": defendersTroopsAfter});
    }
}