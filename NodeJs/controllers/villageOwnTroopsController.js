const path = require('path');
const fetch = require("node-fetch");
const villageOwnTroopsModel = require('../models/villageOwnTroopsModel');

exports.view = function (req, res) {
    villageOwnTroopsModel.findOne({idVillage: req.params.idVillage}, function (err, villageOwnTroops) {
        if (err){
            res.send(err);
        }
        else{
            (async () => {
                let idVillage = req.params.idVillage;

                let barracksProductionsApiUrl = 'http://localhost:8080/api/barracksProductions/' + idVillage;
                let barracksProductions = await(await(await fetch(barracksProductionsApiUrl)).json()).data;

                barracksProductions.forEach(async (barracksProduction) => {
                
                    let currentUnixTime = Math.round(new Date().getTime()/1000);
                    let timeDiff = currentUnixTime - barracksProduction.lastUpdate;
                    let timeDiffFromStart = currentUnixTime - barracksProduction.timeStarted;
    
                    let troopsProduced = timeDiff / barracksProduction.troopProdTime;
                    let troopsProducedAlready = timeDiffFromStart / barracksProduction.troopProdTime;

                    troopsProduced = Number(troopsProduced.toFixed(1));
                    troopsProducedAlready = Number(troopsProducedAlready.toFixed(1));
    
                    if(troopsProduced+barracksProduction.troopsDoneAlready  >= barracksProduction.troopCount){
                        troopsProduced = Number((barracksProduction.troopCount - barracksProduction.troopsDoneAlready).toFixed(1));
                        villageOwnTroops["troop"+barracksProduction.troopId] += troopsProduced;

                        let barracksProductionsDeleteApiUrl = 'http://localhost:8080/api/barracksProductions/' + barracksProduction._id;

                        await fetch(barracksProductionsDeleteApiUrl, {
                            method: 'DELETE',
                            headers: {
                                'Content-Type': 'application/json',
                            }
                        });
                    }
                    else{

                        villageOwnTroops["troop"+barracksProduction.troopId] += troopsProduced;
                        barracksProduction.troopsDoneAlready = troopsProducedAlready;

                        barracksProduction.lastUpdate = currentUnixTime;

                        let barracksProductionsPatchApiUrl = 'http://localhost:8080/api/barracksProductions/' + barracksProduction._id;

                        await fetch(barracksProductionsPatchApiUrl, {
                            method: 'PATCH', // or 'PUT'
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(barracksProduction),
                        });
                    }

                    villageOwnTroops["troop"+barracksProduction.troopId] = Number(villageOwnTroops["troop"+barracksProduction.troopId].toFixed(1));
                    
                });

                for(let i = 1; i < 11; i++){
                    villageOwnTroops["troop" + i] = Number(villageOwnTroops["troop" + i].toFixed(1));
                }

                villageOwnTroops.save(function (err) {
                    if (err)
                        res.json(err);
                    res.json({
                        message: 'villageOwnTroops Info updated',
                        data: villageOwnTroops
                    });
                });
            })();
        }
    });
};

// Handle create villageOwnTroops actions
exports.new = function (req, res) {
    var villageOwnTroops = new villageOwnTroopsModel();
    villageOwnTroops.idVillage = req.body.idVillage;
    villageOwnTroops.tribe = req.body.tribe;
    villageOwnTroops.troop1 = req.body.troop1;
    villageOwnTroops.troop2 = req.body.troop2;
    villageOwnTroops.troop3 = req.body.troop3;
    villageOwnTroops.troop4 = req.body.troop4;
    villageOwnTroops.troop5 = req.body.troop5;
    villageOwnTroops.troop6 = req.body.troop6;
    villageOwnTroops.troop7 = req.body.troop7;
    villageOwnTroops.troop8 = req.body.troop8;
    villageOwnTroops.troop9 = req.body.troop9;
    villageOwnTroops.troop10 = req.body.troop10;

    villageOwnTroops.save(function (err) {
        if (err){
            res.json(err);
        }
        else{
            res.json({
                message: 'villageOwnTroops success',
                data: villageOwnTroops
            });
        }
    });
};

exports.update = function (req, res) {
    villageOwnTroopsModel.findOne({idVillage: req.params.idVillage}, function (err, villageOwnTroops) {
        if (err)
            res.send(err);
        
        villageOwnTroops.idVillage = req.body.idVillage;
        villageOwnTroops.tribe = req.body.tribe;
        villageOwnTroops.troop1 = req.body.troop1;
        villageOwnTroops.troop2 = req.body.troop2;
        villageOwnTroops.troop3 = req.body.troop3;
        villageOwnTroops.troop4 = req.body.troop4;
        villageOwnTroops.troop5 = req.body.troop5;
        villageOwnTroops.troop6 = req.body.troop6;
        villageOwnTroops.troop7 = req.body.troop7;
        villageOwnTroops.troop8 = req.body.troop8;
        villageOwnTroops.troop9 = req.body.troop9;
        villageOwnTroops.troop10 = req.body.troop10;

        villageOwnTroops.save(function (err) {
            if (err)
                res.json(err);
            res.json({
                message: 'villageOwnTroops Info updated',
                data: villageOwnTroops
            });
        });
    });
};

exports.delete = function (req, res) {
    villageOwnTroopsModel.remove({idVillage: req.params.idVillage}, function (err, villageOwnTroops) {
        if (err)
            res.send(err);
        res.json({
            status: "success",
            message: 'villageOwnTroops deleted'
        });
    });
};