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
    const taskName = `${taskType}_${taskData.idVillage}_${taskUnixTime}`;
    const taskDateTime = new Date(taskUnixTime * 1000);
    const taskDateTimeString = taskDateTime.toString();

    var newTask = schedule.scheduleJob(taskName, taskDateTime, async function(taskReqBody, fireDate){
        const idVillage = taskReqBody.taskData.idVillage;
        const idVillageFrom = taskReqBody.taskData.idVillageFrom;
        const idVillageTo = taskReqBody.taskData.idVillageTo;
        const userTribe = await tools.getTribeFromIdVillage(idVillage);

        switch(taskReqBody.taskType){
            case "upgradeResField":
                (async () => {
                    const resFieldId = taskReqBody.taskData.resFieldId;
                    const resFieldUpgradeId = taskReqBody.taskData.resFieldUpgradeId;
                    let villageResourceFields = await(await(await tools.doApiRequest("villageResourceFields/" + idVillage, "GET", "", false)).json()).data;

                    villageResourceFields["field"+resFieldId+"Level"]++;
                    
                    await tools.doApiRequest("villageResourceFields/" + idVillage, "PATCH", villageResourceFields, true);
                    await tools.doApiRequest("villageResFieldUpgrade/" + resFieldUpgradeId, "DELETE", "", false);
                })();                
                break;

            case "upgradeBuilding":
                (async () => {
                    const buildingId = taskReqBody.taskData.buildingId;
                    const buildingUpgradeId = taskReqBody.taskData.buildingUpgradeId;

                    let villageBuildingFields = await(await(await tools.doApiRequest("villageBuildingFields/" + idVillage, "GET", "", false)).json()).data;

                    const buildingLevel = Number(villageBuildingFields["field"+buildingId+"Level"]);
                    villageBuildingFields["field"+buildingId+"Level"] = buildingLevel + 1;
                    
                    await tools.doApiRequest("villageBuildingFields/" + idVillage, "PATCH", villageBuildingFields, true);
                    await tools.doApiRequest("villageBuildingUpgrade/" + buildingUpgradeId, "DELETE", "", false);
                })();                
                break;

            case "attack":
                (async () => {
                    let defendingVillageOwnTroops = await(await(await tools.doApiRequest("villageOwnTroops/" + idVillageTo, "GET", "", false)).json()).data;

                    let attackingVillageTroops = {};
                    attackingVillageTroops['tribe'] = userTribe;
                    for(let troop of tools.troopInfoLookup[userTribe]){
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

                    for(let troop of tools.troopInfoLookup[userTribe]){
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
                        for(let troop of tools.troopInfoLookup[userTribe]){
                            attackingVillageTroopsReturning['troop' + troop['id'] + 'num'] = attackingVillageTroops['troop' + troop['id']];
                        }
                        await tools.doApiRequest("sendTroops", "POST", sendTroopsPostApiUrl, true);
                    }
                    return;
                })();
                break;
            case "reinforcement":
                (async () => {
                    
                })();                
                break;

            case "return":
                (async () => {
                    let villageOwnTroops = await(await(await tools.doApiRequest("villageOwnTroops/" + idVillageTo, "GET", "", false)).json()).data;

                    for(let troop of tools.troopInfoLookup[userTribe]){
                        villageOwnTroops['troop' + troop['id']] += Number(taskReqBody.taskData['troop' + troop['id'] + 'num']);
                    }

                    await tools.doApiRequest("villageOwnTroops/" + idVillageTo, "PATCH", villageOwnTroops, true);
                    await tools.doApiRequest("sendTroops/" + taskReqBody.taskData.sendTroopsId, "DELETE", "", false);
                })();
                break;
        }
        //console.log(JSON.stringify(taskReqBody) + ' successfully ran at ' + new Date() + ' (was scheduled to run at '+ fireDate + ')');
    }.bind(null, taskReqBody));

    scheduledTasks.push(newTask);
    //console.log(scheduledTasks);

    return res.json({
        status: 'New task scheduled',
        data: {
            idVillage: taskData.idVillage,
            taskName: taskName,
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