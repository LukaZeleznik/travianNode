const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const passport = require('passport');

const scheduleController = require('../controllers/scheduleController');
const villageResourcesController = require('../controllers/villageResourcesController');
const villageMaxResourcesController = require('../controllers/villageMaxResourcesController');
const villageFieldLevelsController = require('../controllers/villageFieldLevelsController');
const villageFieldTypesController = require('../controllers/villageFieldTypesController');
const villageProductionsController = require('../controllers/villageProductionsController');
const resFieldUpgradesController = require('../controllers/resFieldUpgradesController');
const villageBuildingUpgradesController = require('../controllers/villageBuildingUpgradesController');
const villageOwnTroopsController = require('../controllers/villageOwnTroopsController');
const villageReinforcementsController = require('../controllers/villageReinforcementsController');
const sendTroopsController = require('../controllers/sendTroopsController');
const barracksProductionsController = require('../controllers/barracksProductionsController');
const userController = require('../controllers/userController');
const villageBuildingFieldsController = require('../controllers/villageBuildingFieldsController');
const auth = require('../auth/auth');

router.get('/', function (req, res) {
    res.json({
        status: 'API Its Working',
        message: 'Welcome to RESTHub crafted with love!',
    });
});
router.route('/register')
    .post(
        passport.authenticate('signup', {
            session: false
        }),
        async (req, res, next) => {
            res.json({
                message: 'Signup successful',
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
                                    email: user.email
                                };
                                const token = jwt.sign({
                                    user: body
                                }, 'TOP_SECRET');

                                return res.json({
                                    token
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
/*
router.route('/schedule/:idTask')
    .get(scheduleController.view)
    .put(scheduleController.update)
    .patch(scheduleController.update)
    .delete(scheduleController.delete);
*/
router.route('/villageResources')
    .post(villageResourcesController.new);
router.route('/villageResources/:idVillage')
    .get(passport.authenticate('jwt', { session: false }), villageResourcesController.view)
    .put(villageResourcesController.update)
    .patch(villageResourcesController.update)
    .delete(villageResourcesController.delete);

router.route('/villageMaxResources')
    .post(villageMaxResourcesController.new);
router.route('/villageMaxResources/:idVillage')
    .get(villageMaxResourcesController.view)
    .put(villageMaxResourcesController.update)
    .patch(villageMaxResourcesController.update)
    .delete(villageMaxResourcesController.delete);

router.route('/villageFieldLevels')
    .post(villageFieldLevelsController.new);
router.route('/villageFieldLevels/:idVillage')
    .get(villageFieldLevelsController.view)
    .put(villageFieldLevelsController.update)
    .patch(villageFieldLevelsController.update)
    .delete(villageFieldLevelsController.delete);

router.route('/villageFieldTypes')
    .post(villageFieldTypesController.new);
router.route('/villageFieldTypes/:idVillage')
    .get(villageFieldTypesController.view)
    .put(villageFieldTypesController.update)
    .patch(villageFieldTypesController.update)
    .delete(villageFieldTypesController.delete);

router.route('/villageProductions')
    .post(villageProductionsController.new);
router.route('/villageProductions/:idVillage')
    .get(villageProductionsController.view)
    .put(villageProductionsController.update)
    .patch(villageProductionsController.update)
    .delete(villageProductionsController.delete);

router.route('/resFieldUpgrades')
    .post(resFieldUpgradesController.new);
router.route('/resFieldUpgrades/:idVillage')
    .get(resFieldUpgradesController.view);
router.route('/resFieldUpgrades/:upgradeId')
    .put(resFieldUpgradesController.update)
    .patch(resFieldUpgradesController.update)
    .delete(resFieldUpgradesController.delete);

router.route('/villageOwnTroops')
    .post(villageOwnTroopsController.new);
router.route('/villageOwnTroops/:idVillage')
    .get(villageOwnTroopsController.view)
    .put(villageOwnTroopsController.update)
    .patch(villageOwnTroopsController.update)
    .delete(villageOwnTroopsController.delete);

router.route('/villageReinforcements')
    .post(villageReinforcementsController.new);
router.route('/villageReinforcements/:idVillage')
    .get(villageReinforcementsController.view);
router.route('/villageReinforcements/:reinforcementId')
    .put(villageReinforcementsController.update)
    .patch(villageReinforcementsController.update)
    .delete(villageReinforcementsController.delete);

router.route('/sendTroops')
    .post(sendTroopsController.new);
router.route('/sendTroops/:idVillage')
    .get(sendTroopsController.view);
router.route('/sendTroops/:sendTroopsId')
    .put(sendTroopsController.update)
    .patch(sendTroopsController.update)
    .delete(sendTroopsController.delete);

router.route('/barracksProductions')
    .post(barracksProductionsController.new);
router.route('/barracksProductions/:idVillage')
    .get(barracksProductionsController.view);
router.route('/barracksProductions/:barrProdId')
    .put(barracksProductionsController.update)
    .patch(barracksProductionsController.update)
    .delete(barracksProductionsController.delete);

router.route('/user')
    .post(userController.new);
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
    .get(villageBuildingFieldsController.view)
    .put(villageBuildingFieldsController.update)
    .patch(villageBuildingFieldsController.update)
    .delete(villageBuildingFieldsController.delete);

router.route('/villageBuildingUpgrades')
    .post(villageBuildingUpgradesController.new);
router.route('/villageBuildingUpgrades/:idVillage')
    .get(villageBuildingUpgradesController.view);
router.route('/villageBuildingUpgrades/:upgradeId')
    .put(villageBuildingUpgradesController.update)
    .patch(villageBuildingUpgradesController.update)
    .delete(villageBuildingUpgradesController.delete);

module.exports = router;