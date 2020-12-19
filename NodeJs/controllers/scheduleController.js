const path = require('path');
const schedule = require('node-schedule');
const fetch = require("node-fetch");
const combatScript = require("../helperScripts/combatScript");
var tools = require('../tools/tools');
var config = require('../config.json');

let scheduledTasks = [];

exports.new = function (req, res) {
    const taskReqBody = req.body;
    const taskType = taskReqBody.taskType;
    const taskUnixTime = taskReqBody.taskUnixTime;
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
                    villageResourceFields["field"+resFieldId+"Level"]++;

                    const consumption = tools.resourceInfoLookup[villageResourceFields["field"+resFieldId+"Type"]]['consumption'][villageResourceFields["field"+resFieldId+"Level"]];
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
                    villageBuildingFields["field"+buildingId+"Level"]++;

                    const consumption = tools.buildingInfoLookup[villageBuildingFields["field"+buildingId+"Type"]]['consumption'][villageBuildingFields["field"+buildingId+"Level"]];
                    villageData['population'] += consumption;
                    userData['population'] += consumption;

                    await tools.doApiRequest("users/" + userData['_id'], "PATCH", userData, true);
                    await tools.doApiRequest("villages/" + villageData['mapTileId'], "PATCH", villageData, true);
                    await tools.doApiRequest("villageBuildingFields/" + idVillage, "PATCH", villageBuildingFields, true);
                    await tools.doApiRequest("villageBuildingUpgrade/" + buildingUpgradeId, "DELETE", "", false);
                })();
                break;
            case "attack":
                //TODO FIX SCHEDULER
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

                    const combatResult = combatScript.calculateCombat(attackingVillageTroops,defendingVillageOwnTroops,constants);

                    for(let troop of tools.troopInfoLookup[userTribeFrom]){
                        defendingVillageOwnTroops['troop' + troop['id']] = combatResult.defendersTroopsAfter[troop['id']-1];
                        attackingVillageTroops['troop' + troop['id']] = combatResult.attackersTroopsAfter[troop['id']-1];
                    }

                    await tools.doApiRequest("villageOwnTroops/" + idVillageTo, "PATCH", defendingVillageOwnTroops, true);
                    await tools.doApiRequest("sendTroops/" + taskReqBody.taskData.sendTroopsId, "DELETE", "", false);
                    
                    const totalAttTroopsLeft = combatResult.attackersTroopsAfter.reduce((a, b) => a + b, 0);

                    if(totalAttTroopsLeft > 0){
                        let attackingVillageTroopsReturning = {};
                        attackingVillageTroopsReturning["sendType"] = "return";
                        attackingVillageTroopsReturning["idVillageFrom"] = idVillageTo;
                        attackingVillageTroopsReturning["idVillageTo"] = idVillageFrom;
                        attackingVillageTroopsReturning["troopTribe"] = attackingVillageTroops["tribe"];
                        for(let troop of tools.troopInfoLookup[userTribeFrom]){
                            attackingVillageTroopsReturning['troop' + troop['id'] + 'num'] = attackingVillageTroops['troop' + troop['id']];
                        }
                        await tools.doApiRequest("sendTroops", "POST", sendTroopsPostApiUrl, true);
                    }
                })();
                break;
            case "reinforcement":
                (async () => {  
                })();
                break;
            case "return":
                //TODO FIX SCHEDULER
                (async () => {  
                    const userTribeFrom = await tools.getTribeFromIdVillage(idVillageFrom);
                    let villageOwnTroops = await(await(await tools.doApiRequest("villageOwnTroops/" + idVillageTo, "GET", "", false)).json()).data;

                    for(let troop of tools.troopInfoLookup[userTribeFrom]){
                        villageOwnTroops['troop' + troop['id']] += Number(taskReqBody.taskData['troop' + troop['id'] + 'num']);
                    }

                    await tools.doApiRequest("villageOwnTroops/" + idVillageTo, "PATCH", villageOwnTroops, true);
                    await tools.doApiRequest("sendTroops/" + taskReqBody.taskData.sendTroopsId, "DELETE", "", false);
                })();
                break;
            case "settle":
                //TODO FIX SCHEDULER
                (async () => {  
                    const idVillageFrom = taskReqBody.taskData.idVillageFrom;
                    const idVillageTo = taskReqBody.taskData.idVillageTo;
                    const troopTribe = taskReqBody.taskData.troopTribe;
                
                    const idVillageToData = await tools.getVillageData(idVillageTo);
                    if (idVillageToData['owner'] != ''){
                        let sendTroopsData = {
                            "sendType": "return",
                            "idVillageFrom": idVillageTo,
                            "idVillageTo": idVillageFrom,
                            "troopTribe": troopTribe,
                            "troop10num": 3
                        }
                        await tools.doApiRequest('sendTroops', 'POST', sendTroopsData, true);
                        return;
                    }

                    await createVillage(idVillageToData,userData);
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
        }
    }.bind(null, taskReqBody));

    scheduledTasks.push(newTask);
    console.log(newTask);

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