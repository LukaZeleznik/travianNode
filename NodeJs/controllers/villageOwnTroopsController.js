const path = require('path');
const fetch = require("node-fetch");
const villageOwnTroopsModel = require('../models/villageOwnTroopsModel');
var tools = require('../tools/tools');
var config = require('../config.json');

exports.view = function (req, res) {
    villageOwnTroopsModel.findOne({idVillage: req.params.idVillage}, function (err, villageOwnTroops) {
        if (err){
            res.send(err);
        }
        else{
            (async () => {
                var idVillage = req.params.idVillage;
                var userTribe = await tools.getTribeFromIdVillage(idVillage);

                let barracksProductions = await(await(await tools.doApiRequest("barracksProductions/" + idVillage, "GET", "", false)).json()).data;
                let stableProductions = await(await(await tools.doApiRequest("stableProductions/" + idVillage, "GET", "", false)).json()).data;
                doProcessTroopProductions(barracksProductions,villageOwnTroops,'barracksProductions');
                doProcessTroopProductions(stableProductions,villageOwnTroops,'stableProductions');

                for(let troop in tools.troopInfoLookup[userTribe]){
                    villageOwnTroops['troop' + tools.troopInfoLookup[userTribe][troop].id] = Number(villageOwnTroops['troop' + tools.troopInfoLookup[userTribe][troop].id].toFixed(1));
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
    for(let troop in tools.troopInfoLookup[req.body.tribe]){
        villageOwnTroops['troop' + tools.troopInfoLookup[req.body.tribe][troop].id] = req.body['troop' + tools.troopInfoLookup[req.body.tribe][troop].id];
    }

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
        for(let troop of tools.troopInfoLookup[userTribe]){
            villageOwnTroops['troop' + troop['id']] = req.body['troop' + troop['id']];
        }

        villageOwnTroops.save(function (err) {
            if (err)
                res.json(err);
            res.json({
                status: 'success',
                message: 'villageOwnTroops updated',
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

function doProcessTroopProductions(productions,villageOwnTroops,path){
    productions.forEach(async (production) => {
        const currentUnixTime = Math.round(new Date().getTime()/1000);
        const timeDiff = currentUnixTime - production.lastUpdate;
        const timeDiffFromStart = currentUnixTime - production.timeStarted;

        let troopsProduced = timeDiff / production.troopProdTime;
        let troopsProducedAlready = timeDiffFromStart / production.troopProdTime;

        troopsProduced = Number(troopsProduced.toFixed(1));
        troopsProducedAlready = Number(troopsProducedAlready.toFixed(1));

        if(troopsProduced+production.troopsDoneAlready  >= production.troopCount){
            troopsProduced = Number((production.troopCount - production.troopsDoneAlready).toFixed(1));
            villageOwnTroops["troop"+production.troopId] += troopsProduced;

            await tools.doApiRequest(path + "/" + production._id, "DELETE", "", false);
        }
        else{
            villageOwnTroops["troop"+production.troopId] += troopsProduced;
            if(troopsProducedAlready < 0) troopsProducedAlready = 0;
            production.troopsDoneAlready = troopsProducedAlready;

            production.lastUpdate = currentUnixTime;

            await tools.doApiRequest(path + "/" + production._id, "PATCH", production, true);
        }
        villageOwnTroops["troop"+production.troopId] = Number(villageOwnTroops["troop"+production.troopId].toFixed(1));
    });
}