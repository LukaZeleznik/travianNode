const fetch = require("node-fetch");
require('dotenv').config();

module.exports = {
    buildingInfoLookup:             require('../infoTables/buildingInfoLookup.json'),
    resourceInfoLookup:             require('../infoTables/resourceInfoLookup.json'),
    troopInfoLookup:                require('../infoTables/troopInfoLookup.json'),
    resFieldVariationsInfoLookup:   require('../infoTables/resFieldVariationsInfoLookup.json'),
    researchesInfoLookup:           require('../infoTables/researchesInfoLookup.json'),
    merchantInfoLookup:             require('../infoTables/merchantInfoLookup.json'),

    doApiRequest: async function (path, method, data, jsonf){
        let response;
        console.log('http://' + process.env.HOSTNAME + '/api/' + path);
        if (jsonf){
            response = await fetch('http://' + process.env.HOSTNAME + ':8080/api/' + path, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + process.env.ADMIN_TOKEN
                },
                body: JSON.stringify(data),
            });
        } else {
            response = await fetch('http://' + process.env.HOSTNAME + ':8080/api/' + path, { method: method, headers: {'Authorization': 'Bearer ' + process.env.ADMIN_TOKEN}});
        }
        return response;
    },
    getTribeFromIdVillage: async function (idVillage){
        const villageOwner = await(await(await this.doApiRequest("villages/" + idVillage, "GET", "", false)).json()).data.owner;
        const userTribe = await(await(await this.doApiRequest("users/" + villageOwner, "GET", "", false)).json()).data.tribe;
        return userTribe;
    },
    getVillageData: async function (idVillage){
        const villageData = await(await(await this.doApiRequest("villages/" + idVillage, "GET", "", false)).json()).data;
        return villageData;
    },
    getUserDataFromIdVillage: async function (idVillage){
        const villageOwner = await(await(await this.doApiRequest("villages/" + idVillage, "GET", "", false)).json()).data.owner;
        const userData = await(await(await this.doApiRequest("users/" + villageOwner, "GET", "", false)).json()).data;
        return userData;
    },
};