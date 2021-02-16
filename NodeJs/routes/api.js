const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const passport = require('passport');
const fetch = require("node-fetch");
var tools = require('../tools/tools');
var config = require('../config.json');
var authTools = require('../tools/auth');
require('dotenv').config()

const scheduleController = require('../controllers/scheduleController');
const installController = require('../controllers/installController');
const villageResourcesController = require('../controllers/villageResourcesController');
const villageMaxResourcesController = require('../controllers/villageMaxResourcesController');
const villageResourceFieldsController = require('../controllers/villageResourceFieldsController');
const villageProductionsController = require('../controllers/villageProductionsController');
const villageResFieldUpgradesController = require('../controllers/villageResFieldUpgradesController');
const villageBuildingUpgradesController = require('../controllers/villageBuildingUpgradesController');
const villageOwnTroopsController = require('../controllers/villageOwnTroopsController');
const villageReinforcementsController = require('../controllers/villageReinforcementsController');
const sendTroopsController = require('../controllers/sendTroopsController');
const barracksProductionsController = require('../controllers/barracksProductionsController');
const stableProductionsController = require('../controllers/stableProductionsController');
const palaceProductionsController = require('../controllers/palaceProductionsController');
const userController = require('../controllers/userController');
const villageController = require('../controllers/villageController');
const villageBuildingFieldsController = require('../controllers/villageBuildingFieldsController');
const researchesCompletedController = require('../controllers/researchesCompletedController');
const researchesController = require('../controllers/researchesController');
const sendResourcesController = require('../controllers/sendResourcesController');
const reportsController = require('../controllers/reportsController');

const auth = require('../auth/auth');

router.get('/', function (req, res) {
    res.json({
        status: 'API Its Working',
        message: 'Welcome to openTravian API crafted with love!',
    });
});
router.route('/register')
    .post(
        passport.authenticate('register', {
            session: false
        }),
        async (req, res, next) => {
            res.json({
                message: 'Registration successful',
                user: req.user
            });
        }
    );

router.route('/login')
    .post(
        async (req, res, next) => {
            passport.authenticate(
                'login',
                async (err, user, info) => {
                    try {
                        if (err || !user) {
                            const error = new Error('An error occurred.');

                            return next(error);
                        }

                        req.login(
                            user, {
                                session: false
                            },
                            async (error) => {
                                if (error) return next(error);

                                const body = {
                                    _id: user._id,
                                    email: user.email,
                                };
                                const token = jwt.sign({
                                    //expiresIn: 60,
                                    user: body
                                }, 'RgUkXp2s5v8y/B?E(H+MbPeShVmYq3t6w9z$C&F)J@NcRfUjWnZr4u7x!A%D*G-KaPdSgVkYp2s5v8y/B?E(H+MbQeThWmZq4t6w9z$C&F)J@NcRfUjXn2r5u8x!A%D*');
                                //res.cookie('capital',token,{maxAge:9000000,httpOnly:true});
                                //res.cookie('jwt',token,{maxAge:9000000,httpOnly:true});
                                return res.json({
                                    token: token,
                                    capital: user.capital,
                                    userTribe: user.tribe,
                                    userId: user._id
                                });
                            }
                        );
                    } catch (error) {
                        return next(error);
                    }
                }
            )(req, res, next);
        }
    );

router.route('/profile')
    .get(passport.authenticate('jwt', {
            session: false
        }),
        (req, res, next) => {
            res.json({
                message: 'You made it to the secure route',
                user: req.user,
                token: req.query.secret_token
            })
        }
    );

router.route('/schedule')
    .post(scheduleController.new)
    .get(scheduleController.view);

router.route('/install')
    .post(installController.new);
/*
router.route('/schedule/:idTask')
    .get(scheduleController.view)
    .put(scheduleController.update)
    .patch(scheduleController.update)
    .delete(scheduleController.delete);
*/
/* Authenticated
*/

router.route('/villageResources')
    .post((req,res,next)    => authenticate(req,res,next), villageResourcesController.new);
router.route('/villageResources/:idVillage')
    .get((req,res,next)     => authenticate(req,res,next), authTools.checkIdVillage, villageResourcesController.view)
    .put((req,res,next)     => authenticate(req,res,next), authTools.checkIdVillage, villageResourcesController.update)
    .patch((req,res,next)   => authenticate(req,res,next), authTools.checkIdVillage, villageResourcesController.update)
    .delete((req,res,next)  => authenticate(req,res,next), authTools.checkIdVillage, villageResourcesController.delete);


router.route('/villages')
    .post(villageController.new)
    .get(villageController.find);
router.route('/villages/:mapTileId')
    .get(villageController.view) //ugly but works - pls change
    .put(villageController.update)
    .patch(villageController.update)
    .delete(villageController.delete);
router.route('/generateMapVillages')
    .post(villageController.insertMany);
router.route('/villages/owner/:uid')
    .get(villageController.findByOwner);
router.route('/villages/coords/:xCoordinate/:yCoordinate')
    .get(villageController.findByCoords);

/*
router.route('/villageResources')
    .post( villageResourcesController.new);
router.route('/villageResources/:idVillage')
    .get(villageResourcesController.view)
    .put(villageResourcesController.update)
    .patch(villageResourcesController.update)
    .delete(villageResourcesController.delete);
*/
router.route('/villageMaxResources')
    .post(villageMaxResourcesController.new);
router.route('/villageMaxResources/:idVillage')
    .get((req,res,next)     => authenticate(req,res,next), authTools.checkIdVillage, villageMaxResourcesController.view)
    .put((req,res,next)     => authenticate(req,res,next), authTools.checkIdVillage, villageMaxResourcesController.update)
    .patch((req,res,next)   => authenticate(req,res,next), authTools.checkIdVillage, villageMaxResourcesController.update)
    .delete((req,res,next)  => authenticate(req,res,next), authTools.checkIdVillage, villageMaxResourcesController.delete);

router.route('/villageResourceFields')
    .post(villageResourceFieldsController.new);
router.route('/villageResourceFields/:idVillage')
    .get((req,res,next)     => authenticate(req,res,next), authTools.checkIdVillage, villageResourceFieldsController.view)
    .put((req,res,next)     => authenticate(req,res,next), authTools.checkIdVillage, villageResourceFieldsController.update)
    .patch((req,res,next)   => authenticate(req,res,next), authTools.checkIdVillage, villageResourceFieldsController.update)
    .delete((req,res,next)  => authenticate(req,res,next), authTools.checkIdVillage, villageResourceFieldsController.delete);

router.route('/villageProductions')
    .post(villageProductionsController.new);
router.route('/villageProductions/:idVillage')
    .get((req,res,next)     => authenticate(req,res,next), authTools.checkIdVillage, villageProductionsController.view)
    .put((req,res,next)     => authenticate(req,res,next), authTools.checkIdVillage, villageProductionsController.update)
    .patch((req,res,next)   => authenticate(req,res,next), authTools.checkIdVillage, villageProductionsController.update)
    .delete((req,res,next)  => authenticate(req,res,next), authTools.checkIdVillage, villageProductionsController.delete);

router.route('/villageResFieldUpgrades')
    .post(villageResFieldUpgradesController.new);
router.route('/villageResFieldUpgrades/:idVillage')
    .get((req,res,next)     => authenticate(req,res,next), authTools.checkIdVillage, villageResFieldUpgradesController.view);
router.route('/villageResFieldUpgrade/:upgradeId')
    .get((req,res,next)     => authenticate(req,res,next), authTools.checkResFieldUpgradeId, villageResFieldUpgradesController.find)
    .put((req,res,next)     => authenticate(req,res,next), authTools.checkResFieldUpgradeId, villageResFieldUpgradesController.update)
    .patch((req,res,next)   => authenticate(req,res,next), authTools.checkResFieldUpgradeId, villageResFieldUpgradesController.update)
    .delete((req,res,next)  => authenticate(req,res,next), authTools.checkResFieldUpgradeId, villageResFieldUpgradesController.delete);
router.route('/cancelVillageResFieldUpgrade/:upgradeId')
    .delete((req,res,next)  => authenticate(req,res,next), authTools.checkResFieldUpgradeId, villageResFieldUpgradesController.cancel);

router.route('/villageOwnTroops')
    .post(villageOwnTroopsController.new);
router.route('/villageOwnTroops/:idVillage')
    .get((req,res,next)     => authenticate(req,res,next), authTools.checkIdVillage, villageOwnTroopsController.view)
    .put((req,res,next)     => authenticate(req,res,next), authTools.checkIdVillage, villageOwnTroopsController.update)
    .patch((req,res,next)   => authenticate(req,res,next), authTools.checkIdVillage, villageOwnTroopsController.update)
    .delete((req,res,next)  => authenticate(req,res,next), authTools.checkIdVillage, villageOwnTroopsController.delete);

router.route('/villageReinforcements')
    .post(villageReinforcementsController.new);
router.route('/villageReinforcements/:idVillage')
    .get((req,res,next)     => authenticate(req,res,next), authTools.checkIdVillage, villageReinforcementsController.view);
router.route('/villageReinforcements/:reinforcementId')
    .put(villageReinforcementsController.update)
    .patch(villageReinforcementsController.update)
    .delete(villageReinforcementsController.delete);

router.route('/sendTroops')
    .post(sendTroopsController.new);
router.route('/sendTroops/:idVillage')
    .get((req,res,next)     => authenticate(req,res,next), authTools.checkIdVillage, sendTroopsController.view);
router.route('/sendTroops/:sendTroopsId')
    .put(sendTroopsController.update)
    .patch(sendTroopsController.update)
    .delete(sendTroopsController.delete);

router.route('/barracksProductions')
    .post(barracksProductionsController.new);
router.route('/barracksProductions/:idVillage')
    .get((req,res,next)     => authenticate(req,res,next), authTools.checkIdVillage, barracksProductionsController.view);
router.route('/barracksProductions/:barrProdId')
    .put(barracksProductionsController.update)
    .patch(barracksProductionsController.update)
    .delete(barracksProductionsController.delete);

router.route('/stableProductions')
    .post(stableProductionsController.new);
router.route('/stableProductions/:idVillage')
    .get((req,res,next)     => authenticate(req,res,next), authTools.checkIdVillage, stableProductionsController.view);
router.route('/stableProductions/:stableProdId')
    .put(stableProductionsController.update)
    .patch(stableProductionsController.update)
    .delete(stableProductionsController.delete);

router.route('/palaceProductions')
    .post(palaceProductionsController.new);
router.route('/palaceProductions/:idVillage')
    .get((req,res,next)     => authenticate(req,res,next), authTools.checkIdVillage, palaceProductionsController.view);
router.route('/palaceProductions/:palaceProdId')
    .put(palaceProductionsController.update)
    .patch(palaceProductionsController.update)
    .delete(palaceProductionsController.delete);

router.route('/users')
    .post(userController.new)
    .get(userController.view);
router.route('/users/:uid')
    .get(userController.find)
    .patch(userController.update);
/*
router.route('/user/:user')
    .get(userController.view)
    .put(userController.update)
    .patch(userController.update)
    .delete(userController.delete);
    */

router.route('/villageBuildingFields')
    .post(villageBuildingFieldsController.new);
router.route('/villageBuildingFields/:idVillage')
    .get((req,res,next)     => authenticate(req,res,next), authTools.checkIdVillage, villageBuildingFieldsController.view)
    .put((req,res,next)     => authenticate(req,res,next), authTools.checkIdVillage, villageBuildingFieldsController.update)
    .patch((req,res,next)   => authenticate(req,res,next), authTools.checkIdVillage, villageBuildingFieldsController.update)
    .delete((req,res,next)  => authenticate(req,res,next), authTools.checkIdVillage, villageBuildingFieldsController.delete);

router.route('/villageBuildingUpgrades')
    .post(villageBuildingUpgradesController.new);
router.route('/villageBuildingUpgrades/:idVillage')
    .get((req,res,next)     => authenticate(req,res,next), authTools.checkIdVillage, villageBuildingUpgradesController.view);
router.route('/villageBuildingUpgrade/:upgradeId')
    .put((req,res,next)     => authenticate(req,res,next), authTools.checkBuildingUpgradeId, villageBuildingUpgradesController.update)
    .patch((req,res,next)   => authenticate(req,res,next), authTools.checkBuildingUpgradeId, villageBuildingUpgradesController.update)
    .get((req,res,next)     => authenticate(req,res,next), authTools.checkBuildingUpgradeId, villageBuildingUpgradesController.find)
    .delete((req,res,next)  => authenticate(req,res,next), authTools.checkBuildingUpgradeId, villageBuildingUpgradesController.delete);
router.route('/cancelVillageBuildingUpgrade/:upgradeId')
    .delete((req,res,next)  => authenticate(req,res,next), authTools.checkBuildingUpgradeId, villageBuildingUpgradesController.cancel);

router.route('/researchesCompleted')
    .post(researchesCompletedController.new);
router.route('/researchesCompleted/:idVillage')
    .get((req,res,next)     => authenticate(req,res,next), authTools.checkIdVillage, researchesCompletedController.view)
    .put((req,res,next)     => authenticate(req,res,next), authTools.checkIdVillage, researchesCompletedController.update)
    .patch((req,res,next)   => authenticate(req,res,next), authTools.checkIdVillage, researchesCompletedController.update)
    .delete((req,res,next)  => authenticate(req,res,next), authTools.checkIdVillage, researchesCompletedController.delete);

router.route('/researches')
    .post(researchesController.new);
router.route('/researches/:idVillage')
    .get((req,res,next)     => authenticate(req,res,next), authTools.checkIdVillage, researchesController.view);
router.route('/researches/:researchId')
    .put(researchesController.update)
    .patch(researchesController.update)
    .delete(researchesController.delete);

router.route('/sendResources')
    .post(sendResourcesController.new);
router.route('/sendResources/:idVillage')
    .get((req,res,next)     => authenticate(req,res,next), authTools.checkIdVillage, sendResourcesController.view);
router.route('/sendResources/:sendResourcesId')
    .put(sendResourcesController.update)
    .patch(sendResourcesController.update)
    .delete(sendResourcesController.delete);

router.route('/reports')
    .post(reportsController.new);
router.route('/reports/:idReport')
    .get((req,res,next)     => authenticate(req,res,next), authTools.checkIdVillage, reportsController.view)
    .put((req,res,next)     => authenticate(req,res,next), authTools.checkIdVillage, reportsController.update)
    .patch((req,res,next)   => authenticate(req,res,next), authTools.checkIdVillage, reportsController.update)
    .delete((req,res,next)  => authenticate(req,res,next), authTools.checkIdVillage, reportsController.delete);

module.exports = router;

function authenticate(req, res, next){
    passport.authenticate('jwt', {session: false}, function (err, user, info){
        if(user){
            req.user = user;
            return next();
        } else {
            console.log("UNAUTHORIZED - JWT INVALID");
            res.json({
                message:'Unauthorized',
                data:""
            });
            return;
        }
    })(req, res, next)
}