const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const UserModel = require('../models/userModel');
const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const fetch = require("node-fetch");
var tools = require('../tools/tools');
var config = require('../config.json');

var cookieExtractor = function(req) {
    var token = null;
    if (req && req.cookies) token = req.cookies['jwt'];
    return token;
};

var headerExtractor = function(req) {
    var token = null;
    if(req.headers['authorization']){
        token = req.headers['authorization'].split(' ')[1];        
    } 
    return token;
};

passport.use(
    new JWTstrategy({
            secretOrKey: 'RgUkXp2s5v8y/B?E(H+MbPeShVmYq3t6w9z$C&F)J@NcRfUjWnZr4u7x!A%D*G-KaPdSgVkYp2s5v8y/B?E(H+MbQeThWmZq4t6w9z$C&F)J@NcRfUjXn2r5u8x!A%D*',
            jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor, headerExtractor])
        },
        async (token, done) => {
            try {
                return done(null, token.user);
            } catch (error) {
                done(error);
            }
        }
    )
);


passport.use(
    'register',
    new localStrategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        async (req, email, password, done) => {
            //console.log(req);
            try {
                let availableTiles = [];
                const villages = await(await(await tools.doApiRequest("villages","GET","",false)).json()).data;
                for(let village of villages){
                    if(village.owner == "" && village.fieldVariation == 0){
                        availableTiles.push(village);
                    }
                }
                const villageData = availableTiles[Math.floor(Math.random() * availableTiles.length)];
                const user = createNewUser(req.query.email,req.query.password,req.query.nickname,req.query.tribe,villageData);
                return done(null, user);
            } catch (error) {
                done(error);
            }
        }
    )
);

passport.use(
    'login',
    new localStrategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        async (req, email, password, done) => {
            try {
                const user = await UserModel.findOne({
                    email
                });

                if (!user) {
                    return done(null, false, {
                        message: 'User not found'
                    });
                }

                const validate = await user.isValidPassword(password);

                if (!validate) {
                    return done(null, false, {
                        message: 'Wrong Password'
                    });
                }

                return done(null, user, {
                    message: 'Logged in Successfully'
                });
            } catch (error) {
                return done(error);
            }
        }
    )
);

async function createNewUser(email,password,nickname,tribe,village){
    const currentUnixTime = Math.round(new Date().getTime()/1000);
    let villageBuildingFieldsData = {};
    let villageResFieldsData = {};
    let villageOwnTroopsData = {};
    let researchesCompleted = {};
    let wallType = 0;

    let userData = {
        "email": email,
        "password": password,
        "nickname": nickname,
        "tribe": tribe,
        "population": 0,
        "group": 1,
        "capital": village['_id'],
    }
    let userDataResponse = await(await(await tools.doApiRequest("users","POST",userData,true)).json()).data

    /* Update Village with userId */
    village['owner'] = userDataResponse['_id'];
    village['name']  = userDataResponse['nickname'] + "'s Village";
    await tools.doApiRequest("villages/" + village['mapTileId'],"PATCH",village,true);
    

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
        "maxWood": 800,
        "maxClay": 800,
        "maxIron": 800,
        "maxCrop": 800
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
        "currentWood": 800,
        "currentClay": 800,
        "currentIron": 800,
        "currentCrop": 800,
        "lastUpdate": currentUnixTime
    }
    await tools.doApiRequest("villageResources","POST",villageResourcesData,true);

    /* CREATE: researchesCompleted */
    researchesCompleted.idVillage = village['_id'];
    researchesCompleted.tribe = tribe;
    researchesCompleted.troop1 = true;
    researchesCompleted.troop10 = true;
    for(let troop of tools.researchesInfoLookup[tribe]){
        researchesCompleted['troop' + troop['id']] = false;
    }
    await tools.doApiRequest("researchesCompleted","POST",researchesCompleted,true);

    return userDataResponse;
};