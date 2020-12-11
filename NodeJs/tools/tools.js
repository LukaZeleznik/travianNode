const fetch = require("node-fetch");

module.exports = {
    buildingInfoLookup:             require('../infoTables/buildingInfoLookup.json'),
    resourceInfoLookup:             require('../infoTables/resourceInfoLookup.json'),
    troopInfoLookup:                require('../infoTables/troopInfoLookup.json'),
    resFieldVariationsInfoLookup:   require('../infoTables/resFieldVariationsInfoLookup.json'),

    doApiRequest: async function (path, method, data, jsonf){
        let response;
        //console.log('http://localhost:8080/api/' + path);
        if (jsonf){
            response = await fetch('http://localhost:8080/api/' + path, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
        } else {
            response = await fetch('http://localhost:8080/api/' + path, { method: method });
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
    }
};