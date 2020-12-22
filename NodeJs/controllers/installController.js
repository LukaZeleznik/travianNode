var tools = require('../tools/tools');
var config = require('../config.json');

exports.new = async function (req, res) {
    const width = req.body.width;
    const height = req.body.height;

    /* GENERATE MAP */
    await generateMap(width,height);

    /* CREATE NEW USER */
    const adminTile = Math.ceil((height*width-(Math.floor(height/2)))/2);
    const villageData = await(await(await tools.doApiRequest("villages/" + adminTile, "GET", "", false)).json()).data;
    await createNewUser("admin@test.com", "password", "Admin", "teuton", villageData);

    //assume always is success..for now
    res.json({
        status: 'success',
        message: 'Installation completed',
        data: ''
    });
};

function getRandomVariation(){
    var gen = Math.floor(Math.random() * 90) + 1;
    let counter = 0;
    for(let l of tools.resFieldVariationsInfoLookup){
        counter += l.chance
        if(counter >= gen) return l.id;
    }
};

async function generateMap(width,height){
    let villageData = [];
    let xCoords = [];
    let yCoords = [];
    for(let y = 0; y < height; y++){
        for(let x = 0; x < width; x++){
            if (y % 2 && x == width-1) break;
            xCoords.push((x - Math.floor(width/2)));
            yCoords.push(-(y - Math.floor(height/2)));
        }
    }

    for(let i = 0; i < height*width-(Math.floor(height/2)); i++){
        const variation = getRandomVariation();
        villageData.push({
            "mapTileId": i+1,
            "xCoordinate": xCoords[i],
            "yCoordinate": yCoords[i],
            "fieldVariation": variation,
            "owner": "",
            "name": "",
        })
    }
    await tools.doApiRequest("generateMapVillages", "POST", villageData, true);
};

async function createNewUser(email, password, nickname, tribe, village){
    const currentUnixTime = Math.round(new Date().getTime()/1000);
    let villageBuildingFieldsData = {};
    let villageResFieldsData = {};
    let villageOwnTroopsData = {};
    let researchesCompleted = {};
    let wallType = 0;

    let adminData = {
        "email": email,
        "password": password,
        "nickname": nickname,
        "tribe": tribe,
        "population": 200,
        "group": 2,
        "capital": village['_id'],
    }
    let adminDataResponse = await(await(await tools.doApiRequest("users", "POST", adminData, true)).json()).data

    /* Update Village with userId */
    village['owner'] = adminDataResponse['_id'];
    village['name']  = adminDataResponse['nickname'] + "'s Village";
    village['fieldVariation'] = 0;
    await tools.doApiRequest("villages/" + village['mapTileId'], "PATCH", village,true);
    

    /* CREATE: villageBuildingFields */
    for(let l = 1; l < 20; l++){
        villageBuildingFieldsData['field'+l+'Type'] = 0;
        villageBuildingFieldsData['field'+l+'Level'] = 0;
    }
    switch (tribe) {
        case "teuton":  wallType = 5; break;
        case "roman":   wallType = 6; break;
        case "gaul":    wallType = 7; break;
    }
    villageBuildingFieldsData['field19Type'] = wallType;
    villageBuildingFieldsData['idVillage'] = village['_id'];
    await tools.doApiRequest("villageBuildingFields","POST",villageBuildingFieldsData,true);


    /* CREATE: villageResourceFields */
    for(let l = 1; l < 19; l++){
        villageResFieldsData['field'+l+'Type'] = tools.resFieldVariationsInfoLookup[village['fieldVariation']]['variation'][l-1];
        villageResFieldsData['field'+l+'Level'] = 0;
    }
    villageResFieldsData['idVillage'] = village['_id'];
    await tools.doApiRequest("villageResourceFields","POST",villageResFieldsData,true);


    /* CREATE: villageMaxResources */
    let villageMaxResourcesData = {
        "idVillage": village['_id'],
        "maxWood": 800 * config.STORAGE_MODIFIER,
        "maxClay": 800 * config.STORAGE_MODIFIER,
        "maxIron": 800 * config.STORAGE_MODIFIER,
        "maxCrop": 800 * config.STORAGE_MODIFIER
    }
    await tools.doApiRequest("villageMaxResources","POST",villageMaxResourcesData,true);


    /* CREATE: villageOwnTroops */
    for(let l = 0; l < tools.troopInfoLookup[tribe].length; l++){
        villageOwnTroopsData['troop' + (l+1)] = 0;
    }
    villageOwnTroopsData['idVillage'] = village['_id'];
    villageOwnTroopsData['tribe'] = tribe;
    await tools.doApiRequest("villageOwnTroops","POST",villageOwnTroopsData,true);

    
    /* CREATE: villageProductions */
    let villageProductionsData = {
        "idVillage": village['_id'],
        "productionWood": 0,
        "productionClay": 0,
        "productionIron": 0,
        "productionCrop": 0
    }
    await tools.doApiRequest("villageProductions","POST",villageProductionsData,true);


    /* CREATE: villageResources */
    let villageResourcesData = {
        "idVillage": village['_id'],
        "currentWood": 800 * config.STORAGE_MODIFIER,
        "currentClay": 800 * config.STORAGE_MODIFIER,
        "currentIron": 800 * config.STORAGE_MODIFIER,
        "currentCrop": 800 * config.STORAGE_MODIFIER,
        "lastUpdate": currentUnixTime
    }
    await tools.doApiRequest("villageResources","POST",villageResourcesData,true);

    /* CREATE: researchesCompleted */
    researchesCompleted.idVillage = village['_id'];
    researchesCompleted.tribe = tribe;
    researchesCompleted.troop1 = true;
    for(let troop of tools.researchesInfoLookup[tribe]){
        researchesCompleted['troop' + troop['id']] = false;
    }
    researchesCompleted.troop10 = true;
    await tools.doApiRequest("researchesCompleted","POST",researchesCompleted,true);
};