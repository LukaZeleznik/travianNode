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

        let winner;

        let attackerTroops = [];
        let defenderTroops = [];

        let totalInfAttPoints = 0;
        let totalCalAttPoints = 0;
        let totalInfDefPoints = 0;
        let totalCalDefPoints = 0;

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
            if(attacker.tribe == "teuton"){
                if(i >= 4 && i <= 5){
                    totalCalAttPoints += troopInfoLookup["Teuton"][i][1] * attackerTroops[i];
                }
                else{
                    totalInfAttPoints += troopInfoLookup["Teuton"][i][1] * attackerTroops[i];
                }
            }

            if(defender.tribe == "teuton"){
                totalInfDefPoints += troopInfoLookup["Teuton"][i][2] * defenderTroops[i];
                totalCalDefPoints += troopInfoLookup["Teuton"][i][3] * defenderTroops[i];
            }
        }

        let totalAttPoints = totalInfAttPoints + totalCalAttPoints;
        let totalDefPoints = totalInfDefPoints + totalCalDefPoints;

        let attInfRatio = Number((totalInfAttPoints/totalAttPoints).toFixed(2));
        let realDefPoints = Math.round(attInfRatio * totalInfDefPoints + (1 - attInfRatio) * totalCalDefPoints);

        realDefPoints += constants.basicDefense;
        realDefPoints += 2 * Math.pow(constants.palaceLevel, 2);

        if(defender.tribe == "teuton"){
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
            x = 1*Math.pow((realDefPoints/totalAttPoints),constants.troopsNumCoef);
            casualtiesPercentWinner = (x/(1+x));
            casualtiesPercentLoser = 1 - casualtiesPercentWinner;    
        }
        else if(totalAttPoints <= realDefPoints && constants.attackType == "raid"){
            winner = "defender";
            x = 1*Math.pow((totalAttPoints/realDefPoints),constants.troopsNumCoef);
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
        //console.log(totalCalAttPoints);
        //console.log(totalInfDefPoints);
        //console.log(totalCalDefPoints);

        let attackersTroopsAfter = [];
        let defendersTroopsAfter = [];

        if(winner == "attacker"){
            for(i = 0; i < 10; i++){
                attackersTroopsAfter[i] =  Math.round((attackerTroops[i]*(1-casualtiesPercentWinner)));
                defendersTroopsAfter[i] =  Math.round((defenderTroops[i]*(1-casualtiesPercentLoser)));
            }
        }
        else if(winner == "defender"){
            for(i = 0; i < 10; i++){
                attackersTroopsAfter[i] =  Math.round((attackerTroops[i]*(1-casualtiesPercentLoser)));
                defendersTroopsAfter[i] =  Math.round((defenderTroops[i]*(1-casualtiesPercentWinner)));
            }
        }

        //console.log(attackersTroopsAfter);
        //console.log(defendersTroopsAfter);

        return({"winner": winner, "attackersTroopsAfter":attackersTroopsAfter, "defendersTroopsAfter": defendersTroopsAfter});
    }
}