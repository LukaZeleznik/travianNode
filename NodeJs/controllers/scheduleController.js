const path = require('path');
const schedule = require('node-schedule');
const fetch = require("node-fetch");

let scheduledTasks = [];

exports.new = function (req, res) {
    let taskReqBody = req.body;
    let taskType = taskReqBody.taskType;
    let taskUnixTime = taskReqBody.taskUnixTime;
    let taskData = taskReqBody.taskData;

    let taskName = `${taskType}_${taskData.idVillage}_${taskUnixTime}`;

    let taskDateTime = new Date(taskUnixTime * 1000);
    let taskDateTimeString = taskDateTime.toString();

    var newTask = schedule.scheduleJob(taskName, taskDateTime, function(taskReqBody, fireDate){
        switch(taskReqBody.taskType){
            case "upgradeResField":
                (async () => {
                    let idVillage = taskReqBody.taskData.idVillage;
                    let resFieldId = taskReqBody.taskData.resFieldId;
                    let resFieldUpgradeId = taskReqBody.taskData.resFieldUpgradeId;

                    let villageFieldLevelsApiUrl = 'http://localhost:8080/api/villageFieldLevels/' + idVillage;
                    let villageFieldLevels = await(await(await fetch(villageFieldLevelsApiUrl)).json()).data;

                    let fieldLevel = Number(villageFieldLevels["resField"+resFieldId+"Level"] );
                    
                    villageFieldLevels["resField"+resFieldId+"Level"] = fieldLevel + 1;
                    
                    fetch(villageFieldLevelsApiUrl, {
                        method: 'PATCH', // or 'PUT'
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(villageFieldLevels),
                    });

                    let resFieldUpgradeApiUrl = 'http://localhost:8080/api/resFieldUpgrades/' + resFieldUpgradeId;

                    fetch(resFieldUpgradeApiUrl, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                        }
                    });
                })();                
                break;

            case "upgradeBuilding":
                (async () => {
                    let idVillage = taskReqBody.taskData.idVillage;
                    let buildingId = taskReqBody.taskData.buildingId;
                    let buildingUpgradeId = taskReqBody.taskData.buildingUpgradeId;

                    let villageBuildingFieldsApiUrl = 'http://localhost:8080/api/villageBuildingFields/' + idVillage;
                    let villageBuildingFields = await(await(await fetch(villageBuildingFieldsApiUrl)).json()).data;

                    let buildingLevel = Number(villageBuildingFields["building"+buildingId+"Level"] );
                    
                    villageBuildingFields["building"+buildingId+"Level"] = buildingLevel + 1;
                    
                    fetch(villageBuildingFieldsApiUrl, {
                        method: 'PATCH', // or 'PUT'
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(villageBuildingFields),
                    });

                    let buildingUpgradeApiUrl = 'http://localhost:8080/api/villageBuildingUpgrades/' + buildingUpgradeId;

                    fetch(buildingUpgradeApiUrl, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                        }
                    });
                })();                
                break;

            case "attack":
                (async () => {
                    const combatScript = require("../helperScripts/combatScript");
                    let idVillageFrom = taskReqBody.taskData.idVillageFrom;
                    let idVillageTo = taskReqBody.taskData.idVillageTo;

                    let defendingVillageOwnTroopsApiUrl = 'http://localhost:8080/api/villageOwnTroops/' + idVillageTo;
                    let defendingVillageOwnTroops = await(await(await fetch(defendingVillageOwnTroopsApiUrl)).json()).data;

                    let attackingVillageTroops = {
                        "tribe": taskReqBody.taskData.troopTribe,
                        "troop1" : taskReqBody.taskData.troop1num,
                        "troop2" : taskReqBody.taskData.troop2num,
                        "troop3" : taskReqBody.taskData.troop3num,
                        "troop4" : taskReqBody.taskData.troop4num,
                        "troop5" : taskReqBody.taskData.troop5num,
                        "troop6" : taskReqBody.taskData.troop6num,
                        "troop7" : taskReqBody.taskData.troop7num,
                        "troop8" : taskReqBody.taskData.troop8num,
                        "troop9" : taskReqBody.taskData.troop9num,
                        "troop10" : taskReqBody.taskData.troop10num
                    }

                    let constants = {
                        attackType: "full",
                        palaceLevel: 0,
                        wallLevel: 0,
                        basicDefense: 0,
                        troopsNumCoef: 1.5
                    }

                    let combatResult = combatScript.calculateCombat(attackingVillageTroops,defendingVillageOwnTroops,constants);

                    for(let i = 1; i < 11; i++){
                        defendingVillageOwnTroops["troop"+i] = combatResult.defendersTroopsAfter[i-1];
                        attackingVillageTroops["troop"+i] = combatResult.attackersTroopsAfter[i-1];
                    }


                    await fetch(defendingVillageOwnTroopsApiUrl, {
                        method: 'PATCH', // or 'PUT'
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(defendingVillageOwnTroops),
                    });

                    let sendTroopsDeleteApiUrl = 'http://localhost:8080/api/sendTroops/' + taskReqBody.taskData.sendTroopsId;

                    await fetch(sendTroopsDeleteApiUrl, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                        }
                    });

                    
                    let totalAttTroopsLeft = combatResult.attackersTroopsAfter.reduce((a, b) => a + b, 0);

                    if(totalAttTroopsLeft > 0){
                        let sendTroopsPostApiUrl = 'http://localhost:8080/api/sendTroops/';

                        let attackingVillageTroopsReturning = {};

                        attackingVillageTroopsReturning["sendType"] = "return";
                        attackingVillageTroopsReturning["idVillageFrom"] = idVillageTo;
                        attackingVillageTroopsReturning["idVillageTo"] = idVillageFrom;
                        attackingVillageTroopsReturning["troopTribe"] = attackingVillageTroops["tribe"];
                        attackingVillageTroopsReturning["troop1num"] = attackingVillageTroops["troop1"];
                        attackingVillageTroopsReturning["troop2num"] = attackingVillageTroops["troop2"];
                        attackingVillageTroopsReturning["troop3num"] = attackingVillageTroops["troop3"];
                        attackingVillageTroopsReturning["troop4num"] = attackingVillageTroops["troop4"];
                        attackingVillageTroopsReturning["troop5num"] = attackingVillageTroops["troop5"];
                        attackingVillageTroopsReturning["troop6num"] = attackingVillageTroops["troop6"];
                        attackingVillageTroopsReturning["troop7num"] = attackingVillageTroops["troop7"];
                        attackingVillageTroopsReturning["troop8num"] = attackingVillageTroops["troop8"];
                        attackingVillageTroopsReturning["troop9num"] = attackingVillageTroops["troop9"];
                        attackingVillageTroopsReturning["troop10num"] = attackingVillageTroops["troop10"];

                        await fetch(sendTroopsPostApiUrl, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(attackingVillageTroopsReturning),
                        });
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
                    
                    let idVillageTo = taskReqBody.taskData.idVillageTo;

                    let villageOwnTroopsApiUrl = 'http://localhost:8080/api/villageOwnTroops/' + idVillageTo;
                    let villageOwnTroops = await(await(await fetch(villageOwnTroopsApiUrl)).json()).data;

                    for(let i = 1; i < 11; i++){
                        villageOwnTroops["troop"+i] += Number(taskReqBody.taskData["troop"+i+"num"]);
                    }

                    await fetch(villageOwnTroopsApiUrl, {
                        method: 'PATCH', // or 'PUT'
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(villageOwnTroops),
                    });

                    let sendTroopsDeleteApiUrl = 'http://localhost:8080/api/sendTroops/' + taskReqBody.taskData.sendTroopsId;

                    await fetch(sendTroopsDeleteApiUrl, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                        }
                    });
                    
                })();
                break;
        }


        console.log(JSON.stringify(taskReqBody) + ' successfully ran at ' + new Date() + ' (was scheduled to run at '+ fireDate + ')');
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
/*
// Handle create barracksProductions actions
exports.new = function (req, res) {
    var barracksProductions = new barracksProductionsModel();
    barracksProductions.idVillage = req.body.idVillage;
    barracksProductions.troopName = req.body.troopName;
    barracksProductions.troopId = req.body.troopId;
    barracksProductions.troopCount = req.body.troopCount;
    barracksProductions.troopProdTime = req.body.troopProdTime;
    barracksProductions.timeStarted = req.body.timeStarted;
    barracksProductions.timeCompleted = req.body.timeCompleted;
    barracksProductions.barrProdId = req.body.barrProdId;
    barracksProductions.lastUpdate = req.body.lastUpdate;
    barracksProductions.troopsDoneAlready = req.body.troopsDoneAlready;

    barracksProductions.save(function (err) {
        if (err){
            res.json(err);
        }
        else{
            res.json({
                message: 'New barracksProductions created',
                data: barracksProductions
            });
        }
    });
};

exports.update = function (req, res) {
    barracksProductionsModel.findOne({barrProdId: req.params.barrProdId}, function (err, barracksProductions) {
        if (err)
            res.send(err);
        
        
        barracksProductions.idVillage = req.body.idVillage;
        barracksProductions.troopName = req.body.troopName;
        barracksProductions.troopId = req.body.troopId;
        barracksProductions.troopCount = req.body.troopCount;
        barracksProductions.troopProdTime = req.body.troopProdTime;
        barracksProductions.timeStarted = req.body.timeStarted;
        barracksProductions.timeCompleted = req.body.timeCompleted;
        barracksProductions.barrProdId = req.body.barrProdId;
        barracksProductions.lastUpdate = req.body.lastUpdate;
        barracksProductions.troopsDoneAlready = req.body.troopsDoneAlready;

        barracksProductions.save(function (err) {
            if (err)
                res.json(err);
            res.json({
                message: 'barracksProductions Info updated',
                data: barracksProductions
            });
        });
    });
};

exports.delete = function (req, res) {
    barracksProductionsModel.remove({barrProdId: req.params.barrProdId}, function (err, barracksProductions) {
        if (err)
            res.send(err);
        res.json({
            status: "success",
            message: 'barracksProductions deleted'
        });
    });
};
*/