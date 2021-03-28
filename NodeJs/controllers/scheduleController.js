const path = require('path');
const schedule = require('node-schedule');
const fetch = require("node-fetch");
const combatScript = require("../helperScripts/combatScript");
var tools = require('../tools/tools');
var config = require('../config.json');

var MARKETPLACE = 15;

let scheduledTasks = [];

exports.new = function (req, res) {
    const taskReqBody = req.body;
    const taskType = taskReqBody.taskType;
    let taskUnixTime = taskReqBody.taskUnixTime;
    const currentUnixTime = Math.round(new Date().getTime()/1000);
    
    if (taskUnixTime - currentUnixTime < 1) taskUnixTime = currentUnixTime + 1; //quick math

    const taskData = taskReqBody.taskData;
    const taskId = taskReqBody.taskData.taskId;
    const taskDateTime = new Date(taskUnixTime * 1000);
    const taskDateTimeString = taskDateTime.toString();

    var newTask = schedule.scheduleJob(taskId, taskDateTime, function(taskReqBody, fireDate){
        var idVillage = taskReqBody.taskData.idVillage;
        var idVillageTo = taskReqBody.taskData.idVillageTo;
        var idVillageFrom = taskReqBody.taskData.idVillageFrom;

        switch(taskReqBody.taskType){
            case "upgradeResField":
                (async () => {  
                    const resFieldId = taskReqBody.taskData.resFieldId;
                    const resFieldUpgradeId = taskReqBody.taskData.resFieldUpgradeId;
                    let villageData = await tools.getVillageData(idVillage);
                    let userData = await tools.getUserDataFromIdVillage(idVillage);

                    let villageResourceFields = await(await(await tools.doApiRequest("villageResourceFields/" + idVillage, "GET", "", false)).json()).data;
                    villageResourceFields['field'+resFieldId+'Level']++;

                    const consumption = tools.resourceInfoLookup[villageResourceFields['field'+resFieldId+'Type']]['consumption'][villageResourceFields['field'+resFieldId+'Level']];
                    villageData['population'] += consumption;
                    userData['population'] += consumption;

                    console.log("userData",userData);

                    await tools.doApiRequest("users/" + userData['_id'], "PATCH", userData, true);
                    await tools.doApiRequest("villages/" + villageData['mapTileId'], "PATCH", villageData, true);
                    await tools.doApiRequest("villageResourceFields/" + idVillage, "PATCH", villageResourceFields, true);
                    await tools.doApiRequest("villageResFieldUpgrade/" + resFieldUpgradeId, "DELETE", "", false);
                })();
                break;
            case "upgradeBuilding":
                (async () => {  
                    const buildingId = taskReqBody.taskData.buildingId;
                    const buildingUpgradeId = taskReqBody.taskData.buildingUpgradeId;
                    let villageData = await tools.getVillageData(idVillage);
                    let userData = await tools.getUserDataFromIdVillage(idVillage);

                    let villageBuildingFields = await(await(await tools.doApiRequest("villageBuildingFields/" + idVillage, "GET", "", false)).json()).data;
                    villageBuildingFields['field'+buildingId+'Level']++;

                    const consumption = tools.buildingInfoLookup[villageBuildingFields['field'+buildingId+'Type']]['consumption'][villageBuildingFields['field'+buildingId+'Level']];
                    villageData['population'] += consumption;
                    userData['population'] += consumption;

                    if (villageBuildingFields['field'+buildingId+'Type'] == MARKETPLACE) { //todo check how many merchants is currently going/coming
                        villageData['merchantsAvailable'] = villageBuildingFields['field'+buildingId+'Level'];
                    }

                    await tools.doApiRequest("users/" + userData['_id'], "PATCH", userData, true);
                    await tools.doApiRequest("villages/" + villageData['mapTileId'], "PATCH", villageData, true);
                    await tools.doApiRequest("villageBuildingFields/" + idVillage, "PATCH", villageBuildingFields, true);
                    await tools.doApiRequest("villageBuildingUpgrade/" + buildingUpgradeId, "DELETE", "", false);
                })();
                break;
            case "attack":
                (async () => {  
                    let defendingVillageOwnTroops = await(await(await tools.doApiRequest("villageOwnTroops/" + idVillageTo, "GET", "", false)).json()).data;
                    const userTribeFrom = await tools.getTribeFromIdVillage(idVillageFrom);

                    let attackingVillageTroops = {};
                    attackingVillageTroops['tribe'] = userTribeFrom;
                    for(let troop of tools.troopInfoLookup[userTribeFrom]){
                        attackingVillageTroops['troop' + troop['id']] = taskReqBody.taskData['troop' + troop['id'] + 'num'];
                    }

                    /* TODO */
                    let constants = {
                        attackType: "full",
                        palaceLevel: 0,
                        wallLevel: 0,
                        basicDefense: 0,
                        troopsNumCoef: 1.5
                    }
                    /* TODO */

                    const combatResult = combatScript.calculateCombat(attackingVillageTroops, defendingVillageOwnTroops, constants);
                    const bounty = await calculateBounty(idVillageTo, combatResult.attackersTroopsAfter, attackingVillageTroops['tribe']);
                    const report = createFullAttackReport(idVillageFrom,
                        idVillageTo,
                        attackingVillageTroops,
                        defendingVillageOwnTroops,
                        combatResult.attackersTroopsAfter,
                        combatResult.defendersTroopsAfter,
                        bounty,
                        taskReqBody.taskUnixTime);
                    
                    await tools.doApiRequest("reports", "POST", report, true);

                    let updateDefenderTroops = false;
                    for(let troop of tools.troopInfoLookup[userTribeFrom]){
                        if (defendingVillageOwnTroops['troop' + troop['id']] != combatResult.defendersTroopsAfter[troop['id']]) updateDefenderTroops = true;

                        defendingVillageOwnTroops['troop' + troop['id']] = combatResult.defendersTroopsAfter[troop['id']];
                        attackingVillageTroops['troop' + troop['id']] = combatResult.attackersTroopsAfter[troop['id']];
                    }

                    if (updateDefenderTroops) await tools.doApiRequest("villageOwnTroops/" + idVillageTo, "PATCH", defendingVillageOwnTroops, true);
                    await tools.doApiRequest("sendTroops/" + taskReqBody.taskData.sendTroopsId, "DELETE", "", false);
                    
                    const totalAttTroopsLeft = combatResult.attackersTroopsAfter.reduce((a, b) => a + b, 0);
                    
                    if (totalAttTroopsLeft > 0){
                        let attackingVillageTroopsReturning = {
                            "sendType": "return",
                            "idVillageFrom": idVillageTo,
                            "idVillageTo": idVillageFrom,
                            "troopTribe": attackingVillageTroops['tribe'],
                            'bountyWood': bounty['wood'],
                            'bountyClay': bounty['clay'],
                            'bountyIron': bounty['iron'],
                            'bountyCrop': bounty['crop']
                        };
                        for (let troop of tools.troopInfoLookup[userTribeFrom]){
                            attackingVillageTroopsReturning['troop' + troop['id'] + 'num'] = attackingVillageTroops['troop' + troop['id']];
                        }
                        await tools.doApiRequest("sendTroops", "POST", attackingVillageTroopsReturning, true);
                    }
                })();
                break;
            case "reinf":
                (async () => {              
                    const userTribeFrom = await tools.getTribeFromIdVillage(idVillageFrom);
                    const userTribeTo = await tools.getTribeFromIdVillage(idVillageTo);

                    let [reinforcementExists, villageReinforcement] = await checkForExistingReinforcements(idVillageFrom, idVillageTo);
                    if (reinforcementExists){
                        if (villageReinforcement.troopTribe==userTribeFrom) {
                            for (let troop of tools.troopInfoLookup[userTribeFrom]){
                                villageReinforcement['troop' + troop['id']] += parseInt(taskReqBody.taskData['troop' + troop['id'] + 'num']);
                            }
                            await tools.doApiRequest("villageReinforcements/" + villageReinforcement._id, "PATCH", villageReinforcement, true);
                        }
                    } else {
                        let villageReinforcement = {};
                        villageReinforcement['idVillage'] = idVillageTo;
                        villageReinforcement['idVillageFrom'] = idVillageFrom;
                        villageReinforcement['troopTribe'] = userTribeFrom;
                        for (let troop of tools.troopInfoLookup[userTribeFrom]){
                            villageReinforcement['troop' + troop['id']] = taskReqBody.taskData['troop' + troop['id'] + 'num'];
                        }
                        await tools.doApiRequest("villageReinforcements", "POST", villageReinforcement, true);
                    }
                    await tools.doApiRequest("sendTroops/" + taskReqBody.taskData.sendTroopsId, "DELETE", "", false);

                    const report = createReinforcementReport(idVillageFrom,
                        idVillageTo,
                        userTribeFrom,
                        userTribeTo,
                        taskReqBody);
                    await tools.doApiRequest("reports", "POST", report, true);
                })();
                break;
            case "return":
                (async () => {  
                    const userTribeFrom = await tools.getTribeFromIdVillage(idVillageFrom);
                    let villageOwnTroops = await(await(await tools.doApiRequest("villageOwnTroops/" + idVillageTo, "GET", "", false)).json()).data;

                    for(let troop of tools.troopInfoLookup[userTribeFrom]){
                        villageOwnTroops['troop' + troop['id']] += Number(taskReqBody.taskData['troop' + troop['id'] + 'num']);
                    }

                    if (taskReqBody.taskData['bountyWood']>0 || taskReqBody.taskData['bountyClay']>0 || taskReqBody.taskData['bountyIron']>0 || taskReqBody.taskData['bountyCrop']>0) {
                        let villageToResources = await(await(await tools.doApiRequest("villageResources/" + idVillageTo, "GET", "", false)).json()).data;
                        villageToResources.currentWood += taskReqBody.taskData['bountyWood'];
                        villageToResources.currentClay += taskReqBody.taskData['bountyClay'];
                        villageToResources.currentIron += taskReqBody.taskData['bountyIron'];
                        villageToResources.currentCrop += taskReqBody.taskData['bountyCrop'];
                        villageToResources.lastUpdate = currentUnixTime;
                        await tools.doApiRequest("villageResources/" + idVillageTo, "PATCH", villageToResources, true);    
                    }
                   
                    await tools.doApiRequest("villageOwnTroops/" + idVillageTo, "PATCH", villageOwnTroops, true);
                    await tools.doApiRequest("sendTroops/" + taskReqBody.taskData.sendTroopsId, "DELETE", "", false);
                })();
                break;
            case "settle":
                (async () => {  
                    const idVillageFrom = taskReqBody.taskData.idVillageFrom;
                    const idVillageTo = taskReqBody.taskData.idVillageTo;
                    const troopTribe = taskReqBody.taskData.troopTribe;
                    const userData = await tools.getUserDataFromIdVillage(idVillageFrom);
                
                    const idVillageToData = await tools.getVillageData(idVillageTo);
                    if (idVillageToData['owner'] != ''){
                        let sendTroopsData = {
                            "sendType": "return",
                            "idVillageFrom": idVillageTo,
                            "idVillageTo": idVillageFrom,
                            "troopTribe": troopTribe,
                            "troop10num": 3,
                        }
                        await tools.doApiRequest('sendTroops', 'POST', sendTroopsData, true);
                    }

                    await createVillage(idVillageToData, userData);
                    await tools.doApiRequest("sendTroops/" + taskReqBody.taskData.sendTroopsId, "DELETE", "", false);
                })();
                break;
            case "troopResearch":
                (async () => {
                    const researchId = taskReqBody.taskData.researchId;
                    const idVillage = taskReqBody.taskData.idVillage;
                    const troopId = taskReqBody.taskData.troopId;
                    
                    let researchesCompleted = await(await(await tools.doApiRequest("researchesCompleted/" + idVillage, "GET", "", false)).json()).data;
                    researchesCompleted['troop' + troopId] = true;

                    await tools.doApiRequest("researchesCompleted/" + idVillage, "PATCH", researchesCompleted, true);
                    await tools.doApiRequest("researches/" + researchId, "DELETE", "", false);
                })();
                break;
            case "troopUpgrade":
                //TODO
                break;
            case "sendResources":
                (async () => {  
                    const idVillageFrom = taskReqBody.taskData.idVillageFrom;
                    const idVillageTo = taskReqBody.taskData.idVillageTo;
                    const userTribe = taskReqBody.taskData.userTribe;
                    const currentUnixTime = Math.round(new Date().getTime()/1000);

                    /* Update resources in destination village */
                    let villageToResources = await(await(await tools.doApiRequest("villageResources/" + idVillageTo, "GET", "", false)).json()).data;

                    villageToResources.currentWood += taskReqBody.taskData.wood;
                    villageToResources.currentClay += taskReqBody.taskData.clay;
                    villageToResources.currentIron += taskReqBody.taskData.iron;
                    villageToResources.currentCrop += taskReqBody.taskData.crop;
                    villageToResources.lastUpdate = currentUnixTime;

                    await tools.doApiRequest("villageResources/" + idVillageTo, "PATCH", villageToResources, true);

                    /* Return merchants */
                    const idVillageToData = await tools.getVillageData(idVillageTo);
                    if (idVillageToData['owner'] != ''){
                        const sendResourcesData = {
                            "sendType": "sendResourcesReturn",
                            "idVillageFrom": idVillageTo,
                            "idVillageTo": idVillageFrom,
                            "userTribe": userTribe,
                            "wood": taskReqBody.taskData.wood,
                            "clay": taskReqBody.taskData.clay,
                            "iron": taskReqBody.taskData.iron, 
                            "crop": taskReqBody.taskData.crop,
                        }
                        await tools.doApiRequest('sendResources', 'POST', sendResourcesData, true);
                    }
                    await tools.doApiRequest("sendResources/" + taskReqBody.taskData.sendResourcesId, "DELETE", "", false);
                })();
                break;
            case "sendResourcesReturn":
                (async () => {  
                    const idVillageTo = taskReqBody.taskData.idVillageTo;
                    let villageToData = await tools.getVillageData(idVillageTo);

                    villageToData.merchantsAvailable += taskReqBody.taskData.merchantAmount;

                    await tools.doApiRequest("villages/" + villageToData['mapTileId'], "PATCH", villageToData, true);
                    await tools.doApiRequest("sendResources/" + taskReqBody.taskData.sendResourcesId, "DELETE", "", false);
                })();
                break;
        }
    }.bind(null, taskReqBody));

    scheduledTasks.push(newTask);
    console.log(newTask);
    console.log(newTask.job);

    return res.json({
        status: 'New task scheduled',
        data: {
            idVillage: taskData.idVillage,
            taskId: taskId,
            taskType: taskType,
            taskUnixTime: taskUnixTime,
            taskDateTime: taskDateTimeString
        }
    });
};

exports.view = function (req, res) {
    res.json({
        message: 'Loading tasks..',
        data: scheduledTasks
    });
};

async function createVillage(villageData,userData){
    const currentUnixTime = Math.round(new Date().getTime()/1000);
    let villageBuildingFieldsData = {};
    let villageResFieldsData = {};
    let villageOwnTroopsData = {};
    let wallType = 0;

    /* Update Village with userId */
    villageData['owner'] = userData['_id'];
    villageData['name']  = userData['nickname'] + "'s new village";
    await tools.doApiRequest("villages/" + villageData['mapTileId'],"PATCH",villageData,true);

    /* CREATE: villageBuildingFields */
    for(let l = 1; l < 20; l++){
        villageBuildingFieldsData['field'+l+'Type'] = 0;
        villageBuildingFieldsData['field'+l+'Level'] = 0;
    }
    switch (userData['tribe']) {
        case "teuton":  wallType = 5; break;
        case "roman":   wallType = 6; break;
        case "gaul":    wallType = 7; break;
    }
    villageBuildingFieldsData['field19Type'] = wallType;
    villageBuildingFieldsData['idVillage'] = villageData['_id'];
    await tools.doApiRequest("villageBuildingFields","POST",villageBuildingFieldsData,true);

    /* CREATE: villageResourceFields */
    for(let l = 1; l < 19; l++){
        villageResFieldsData['field'+l+'Type'] = tools.resFieldVariationsInfoLookup[villageData['fieldVariation']]['variation'][l-1];
        villageResFieldsData['field'+l+'Level'] = 0;
    }
    villageResFieldsData['idVillage'] = villageData['_id'];
    await tools.doApiRequest("villageResourceFields","POST",villageResFieldsData,true);

    /* CREATE: villageMaxResources */
    let villageMaxResourcesData = {
        "idVillage": villageData['_id'],
        "maxWood": 800,
        "maxClay": 800,
        "maxIron": 800,
        "maxCrop": 800
    }
    await tools.doApiRequest("villageMaxResources","POST",villageMaxResourcesData,true);

    /* CREATE: villageOwnTroops */
    for(let l = 0; l < tools.troopInfoLookup[userData['tribe']].length; l++){
        villageOwnTroopsData['troop' + (l+1)] = 0;
    }
    villageOwnTroopsData['idVillage'] = villageData['_id'];
    villageOwnTroopsData['tribe'] = userData['tribe'];
    await tools.doApiRequest("villageOwnTroops","POST",villageOwnTroopsData,true);

    /* CREATE: villageProductions */
    let villageProductionsData = {
        "idVillage": villageData['_id'],
        "productionWood": 0,
        "productionClay": 0,
        "productionIron": 0,
        "productionCrop": 0
    }
    await tools.doApiRequest("villageProductions","POST",villageProductionsData,true);

    /* CREATE: villageResources */
    let villageResourcesData = {
        "idVillage": villageData['_id'],
        "currentWood": 750,
        "currentClay": 750,
        "currentIron": 750,
        "currentCrop": 750,
        "lastUpdate": currentUnixTime
    }
    await tools.doApiRequest("villageResources","POST",villageResourcesData,true);
}

function createFullAttackReport(idVillageFrom, idVillageTo, attackingVillageTroops, defendingVillageOwnTroops, attackersTroopsAfter, defendersTroopsAfter, bounty, timeArrived){
    let report = {};
    report['time'] = timeArrived;
    report['type'] = "attack";
    report['idVillageAttacker'] = idVillageFrom;
    report['idVillageDefender'] = idVillageTo;
    report['tribeAttacker'] = attackingVillageTroops.tribe;
    report['tribeDefender'] = defendingVillageOwnTroops.tribe;
    report['bountyWood'] = bounty['wood'];
    report['bountyClay'] = bounty['clay'];
    report['bountyIron'] = bounty['iron'];
    report['bountyCrop'] = bounty['crop'];
    report['bountyTotal'] = report['bountyWood'] + report['bountyClay'] + report['bountyIron'] + report['bountyCrop'];
    report['bountyMax'] = 0;

    for(let troop of tools.troopInfoLookup[report['tribeAttacker']]){
        report['attTroop'+troop['id']] = attackingVillageTroops['troop'+troop['id']];
        report['attTroop'+troop['id']+'Casualty'] = attackingVillageTroops['troop'+troop['id']] - attackersTroopsAfter[troop['id']];
        if (attackersTroopsAfter[troop['id']]>0) {
            report['bountyMax'] += attackersTroopsAfter[troop['id']] * tools.troopInfoLookup[attackingVillageTroops.tribe][troop['id']]['capacity'];
        } 

    }
    for(let troop of tools.troopInfoLookup[report['tribeDefender']]){
        report['defTroop'+troop['id']] = defendingVillageOwnTroops['troop'+troop['id']];
        report['defTroop'+troop['id']+'Casualty'] = defendingVillageOwnTroops['troop'+troop['id']] - defendersTroopsAfter[troop['id']];
    }


    return report;
}

function createReinforcementReport(idVillageFrom, idVillageTo, userTribeFrom, userTribeTo, taskReqBody){
    let report = {};
    report['time'] = taskReqBody.taskUnixTime;
    report['type'] = "reinf";
    report['idVillageAttacker'] = idVillageFrom;
    report['idVillageDefender'] = idVillageTo;
    report['tribeAttacker'] = userTribeFrom;
    report['tribeDefender'] = userTribeTo;
    report['bountyWood'] = 0;
    report['bountyClay'] = 0;
    report['bountyIron'] = 0;
    report['bountyCrop'] = 0;
    report['bountyTotal'] = 0;
    report['bountyMax'] = 0;

    for(let troop of tools.troopInfoLookup[userTribeFrom]){
        report['attTroop'+troop['id']] = taskReqBody.taskData['troop' + troop['id'] + 'num'];
        report['attTroop'+troop['id']+'Casualty'] = 0;
    }
    for(let troop of tools.troopInfoLookup[report['tribeDefender']]){
        report['defTroop'+troop['id']] = 0;
        report['defTroop'+troop['id']+'Casualty'] = 0;
    }

    return report;
}

async function calculateBounty(idVillageTo, attackersTroopsAfter, tribe){
    let maxBounty = 0;
    let bounty = {};
    const currentUnixTime = Math.round(new Date().getTime()/1000);
    
    bounty['wood'] = 0;
    bounty['clay'] = 0;
    bounty['iron'] = 0;
    bounty['crop'] = 0;
    
    for (let i = 0; i < 10; i++){
        if (attackersTroopsAfter[i]>0) {
            maxBounty += attackersTroopsAfter[i] * tools.troopInfoLookup[tribe][i]['capacity'];
        }        
    }

    // Return bounty = 0 if units are not able to carry anything
    if (maxBounty==0) return bounty;

    let villageToResources = await(await(await tools.doApiRequest("villageResources/" + idVillageTo, "GET", "", false)).json()).data;
    currentWood = Math.floor(villageToResources.currentWood);
    currentClay = Math.floor(villageToResources.currentClay);
    currentIron = Math.floor(villageToResources.currentIron);
    currentCrop = Math.floor(villageToResources.currentCrop);
    
    bounty['wood'] = bounty['clay'] = bounty['iron'] = bounty['crop'] = Math.floor(maxBounty/4);

    if (bounty['wood']>currentWood) {
        bounty['clay'] += bounty['wood'] - currentWood;
        bounty['wood'] = currentWood;
    };
    if (bounty['clay']>currentClay) {
        bounty['iron'] += bounty['clay'] - currentClay;
        bounty['clay'] = currentClay;
    };
    if (bounty['iron']>currentIron) {
        bounty['crop'] += bounty['iron'] - currentIron;
        bounty['iron'] = currentIron;
    };
    if (bounty['crop']>currentCrop) {
        bounty['crop'] = currentCrop;
    };

    //TODO should split evenly not like this
    /*
    for($i = 0; $i<5; $i++)
        {
            for($j=0;$j<4;$j++)
            {
                if(isset($avtotal[$j]))
                {
                    if($avtotal[$j]<1)
                        unset($avtotal[$j]);
                }
            }
            if(!$avtotal)
            {
                // echo 'array empty'; *no resources left to take.
                break;
            }
            if($btotal <1 && $bmod <1)
                break;
            if($btotal<1)
            {
                while($bmod)
                {
                    //random select
                    $rs = array_rand($avtotal);
                    if(isset($avtotal[$rs]))
                    {
                        $avtotal[$rs] -= 1;
                        $steal[$rs] += 1;
                        $bmod -= 1;
                    }
                }
            }
            
            // handle unballanced amounts.
            $btotal +=$bmod;
            $bmod = $btotal%count($avtotal);
            $btotal -=$bmod;
            $bsplit = $btotal/count($avtotal);
    
            $max_steal = (min($avtotal) < $bsplit)? min($avtotal): $bsplit;
        
            for($j=0;$j<4;$j++)
            {
                if(isset($avtotal[$j]))
                {
                    $avtotal[$j] -= $max_steal;
                    $steal[$j] += $max_steal;
                    $btotal -= $max_steal;
                }
            }
        }
    */

    villageToResources.currentWood -= bounty['wood'];
    villageToResources.currentClay -= bounty['clay'];
    villageToResources.currentIron -= bounty['iron'];
    villageToResources.currentCrop -= bounty['crop'];
    villageToResources.lastUpdate = currentUnixTime;
    await tools.doApiRequest("villageResources/" + idVillageTo, "PATCH", villageToResources, true);

    return bounty;
}

async function checkForExistingReinforcements(idVillageFrom, idVillageTo) {  
    const villageReinforcements = await(await(await tools.doApiRequest("villageReinforcements/from/" + idVillageFrom + "/" + idVillageTo, "GET", "", false)).json()).data;
    console.log(villageReinforcements);
    let exists = false;
    if (villageReinforcements!=null) {
        exists = true;
    }
    return [exists, villageReinforcements]
};