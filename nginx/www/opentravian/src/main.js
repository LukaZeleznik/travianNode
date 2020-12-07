import Vue from 'vue';
import VueRouter from 'vue-router';
import Vuex from 'vuex';

import Register from './components/Register.vue';
import Login from './components/Login.vue';
import Resources from './components/Resources.vue';
import ResourceField from './components/Resources/ResourceField.vue';
import Village from './components/Village.vue';
import VillageBuilding from './components/VillageBuilding.vue';
import SendTroops from './components/SendTroops.vue';
import Map from './components/Map.vue';
import App from './components/app.vue';
import Install from './components/Install.vue';

// Navbar
Vue.component('navbarMenu', require('./components/Main/Navbar/Menu.vue').default);
Vue.component('navbarResources', require('./components/Main/Navbar/Resources.vue').default);

// Sidebars
Vue.component('sidebarTroops', require('./components/Main/Sidebar/Troops.vue').default);
Vue.component('sidebarTroopMovements', require('./components/Main/Sidebar/TroopMovements.vue').default);
Vue.component('sidebarProduction', require('./components/Main/Sidebar/Production.vue').default);
Vue.component('sidebarVillages', require('./components/Main/Sidebar/Villages.vue').default);

//Footer
Vue.component('footerBuildingQueue', require('./components/Main/Footer/BuildingQueue.vue').default);

// Village
Vue.component('villageFields', require('./components/Village/Fields.vue').default);
Vue.component('villageBuilding0', require('./components/Village/Buildings/0.vue').default); //Empty spot
Vue.component('villageBuilding1', require('./components/Village/Buildings/1.vue').default); //Barracks
Vue.component('villageBuilding2', require('./components/Village/Buildings/2.vue').default); //Warehouse
Vue.component('villageBuilding3', require('./components/Village/Buildings/3.vue').default); //Granary
Vue.component('villageBuilding4', require('./components/Village/Buildings/4.vue').default); //Stable
Vue.component('villageBuilding5', require('./components/Village/Buildings/5.vue').default); //Eart Wall (Teutons)
Vue.component('villageBuilding6', require('./components/Village/Buildings/6.vue').default); //City Wall (Romans)
Vue.component('villageBuilding7', require('./components/Village/Buildings/7.vue').default); //Palisade  (Gauls)
Vue.component('villageBuilding8', require('./components/Village/Buildings/8.vue').default); //Bakery
Vue.component('villageBuilding9', require('./components/Village/Buildings/9.vue').default); //Brickyard
Vue.component('villageBuilding10', require('./components/Village/Buildings/10.vue').default); //Grain Mill
Vue.component('villageBuilding11', require('./components/Village/Buildings/11.vue').default); //Iron Foundry
Vue.component('villageBuilding12', require('./components/Village/Buildings/12.vue').default); //Sawmill
Vue.component('villageBuilding13', require('./components/Village/Buildings/13.vue').default); //Palace

//Resources
Vue.component('resourcesFields', require('./components/Resources/Fields.vue').default);
Vue.component('resourcesField', require('./components/Resources/ResourceField.vue').default);

//Map
Vue.component('mapTile', require('./components/Map/MapTile.vue').default);

Vue.use(VueRouter);
Vue.use(Vuex);

const router = new VueRouter({
    mode: 'history',
    routes: [
        {
            path: '/',
            name: 'home',
            redirect: '/resources'
        },
        {
            path: '/register',
            name: 'register',
            component: Register
        },
        {
            path: '/login',
            name: 'login',
            component: Login
        },
        {
            path: '/resources',
            name: 'resources',
            component: Resources
        },
        {
            path: '/resourceField/:rfid',
            name: 'resourceField',
            component: ResourceField
        },
        {
            path: '/village',
            name: 'village',
            component: Village
        },
        {
            path: '/villageBuilding/:vbid',
            name: 'villageBuilding',
            component: VillageBuilding
        },
        {
            path: '/sendTroops/:vid',
            name: 'sendTroops',
            component: SendTroops
        },
        {
            path: '/map/:tileid?',
            name: 'map',
            component: Map,
        },
        {
            path: '/install',
            name: 'install',
            component: Install
        },
    ],
});

const store = new Vuex.Store({
    state: {
        villageResources: [0, 0, 0, 0],
        villageMaxResources: [0, 0, 0, 0],
        villageResourceFieldLevels: [],
        villageResourceFieldTypes: [],
        villageResourceFieldColors: ["", "Green", "Orange", "Silver", "", "Silver", "Gold", "Gold", "Green", "Orange", "Gold", "White", "Gold", "Orange", "Green", "Gold", "Gold", "Silver", "", "Silver", "Orange", "Green"],
        villageProduction: [0, 0, 0, 0],
        villageResFieldUpgrades: [],
        villageBuildingUpgrades: [],
        villageOwnTroops: [],
        villageReinforcements: [],
        villageIncomingAttacks: [],
        villageIncomingReinforcements: [],
        villageOutgoingAttacks: [],
        villageOutgoingReinforcements: [],
        villageBarracksProduction: [],
        villageStableProduction: [],
        villageBuildingLevels: [],
        villageBuildingTypes: [],
        villageBuildingColors: [],
        activeVillageId: localStorage.getItem('activeVillageId'),
        activeVillageName: "",
    },

    mutations: {
        setVillageResources(state, resources)                                   { state.villageResources = resources; },
        setVillageMaxResources(state, villageMaxResources)                      { state.villageMaxResources = villageMaxResources; },
        setVillageResourceFieldLevels(state, villageResourceFieldLevels)        { state.villageResourceFieldLevels = villageResourceFieldLevels; },
        setVillageResourceFieldTypes(state, villageResourceFieldTypes)          { state.villageResourceFieldTypes = villageResourceFieldTypes; },
        setVillageResourceFieldColors(state, villageResourceFieldColors)        { state.villageResourceFieldColors = villageResourceFieldColors; },
        setVillageProduction(state, villageProduction)                          { state.villageProduction = villageProduction; },
        setVillageResFieldUpgrades(state, villageResFieldUpgrades)              { state.villageResFieldUpgrades = villageResFieldUpgrades; },
        setVillageBuildingUpgrades(state, villageBuildingUpgrades)              { state.villageBuildingUpgrades = villageBuildingUpgrades; },
        setVillageOwnTroops(state, villageOwnTroops)                            { state.villageOwnTroops = villageOwnTroops; },
        setVillageReinforcements(state, villageReinforcements)                  { state.villageReinforcements = villageReinforcements; },
        setVillageOutgoingAttacks(state, villageOutgoingAttacks)                { state.villageOutgoingAttacks = villageOutgoingAttacks; },
        setVillageOutgoingReinforcements(state, villageOutgoingReinforcements)  { state.villageOutgoingReinforcements = villageOutgoingReinforcements; },
        setVillageIncomingAttacks(state, villageIncomingAttacks)                { state.villageIncomingAttacks = villageIncomingAttacks; },
        setVillageIncomingReinforcements(state, villageIncomingReinforcements)  { state.villageIncomingReinforcements = villageIncomingReinforcements; },
        setVillageBarracksProduction(state, villageBarracksProduction)          { state.villageBarracksProduction = villageBarracksProduction; },
        setVillageStableProduction(state, villageStableProduction)              { state.villageStableProduction = villageStableProduction; },
        setVillageBuildingLevels(state, villageBuildingLevels)                  { state.villageBuildingLevels = villageBuildingLevels; },
        setVillageBuildingTypes(state, villageBuildingTypes)                    { state.villageBuildingTypes = villageBuildingTypes; },
        setVillageBuildingColors(state, villageBuildingColors)                  { state.villageBuildingColors = villageBuildingColors; },
        setActiveVillageId(state, activeVillageId)                              { state.activeVillageId = activeVillageId; },
        setActiveVillageName(state, activeVillageName)                          { state.activeVillageName = activeVillageName; },
    },
    actions: {
        async fetchActiveVillageId(context) {
            if(context.getters.getActiveVillageId){
                return context.getters.getActiveVillageId;
            }
            /*await fetch('http://localhost:8080/api/users/' + getCookie('userId'))
                .then(res => res.json())
                .then(res => {
                    context.commit('setActiveVillageId', res.data.capital);
                })
                .catch(err => console.log(err));*/
        },
        async fetchVillageResources(context) {
            await fetch('http://localhost:8080/api/villageResources/' + context.getters.getActiveVillageId,{credentials: 'include'})
                .then(res => res.json())
                .then(res => {
                    let villageResources = [res.data.currentWood, res.data.currentClay, res.data.currentIron, res.data.currentCrop];
                    context.commit('setVillageResources', villageResources);
                })
                .catch(err => console.log(err));
        },
        async fetchVillageMaxResources(context) {
            await fetch('http://localhost:8080/api/villageMaxResources/' + context.getters.getActiveVillageId)
                .then(res => res.json())
                .then(res => {
                    let villageMaxResources = [res.data.maxWood, res.data.maxClay, res.data.maxIron, res.data.maxCrop];
                    context.commit('setVillageMaxResources', villageMaxResources);
                })
                .catch(err => console.log(err));
        },
        async fetchVillageProduction(context) {
            await fetch('http://localhost:8080/api/villageProductions/' + context.getters.getActiveVillageId)
                .then(res => res.json())
                .then(res => {
                    let villageProduction = [res.data.productionWood, res.data.productionClay, res.data.productionIron, res.data.productionCrop];
                    context.commit('setVillageProduction', villageProduction);
                })
                .catch(err => console.log(err));
        },
        async fetchVillageResFieldUpgrades(context) {
            await fetch('http://localhost:8080/api/villageResFieldUpgrades/' + context.getters.getActiveVillageId)
                .then(res => res.json())
                .then(res => {
                    let villageResFieldUpgrades = res.data;
                    context.commit('setVillageResFieldUpgrades', villageResFieldUpgrades);
                })
                .catch(err => console.log(err));
        },
        async fetchVillageBuildingUpgrades(context) {
            await fetch('http://localhost:8080/api/villageBuildingUpgrades/' + context.getters.getActiveVillageId)
                .then(res => res.json())
                .then(res => {
                    let villageBuildingUpgrades = res.data;
                    context.commit('setVillageBuildingUpgrades', villageBuildingUpgrades);
                })
                .catch(err => console.log(err));
        },
        async fetchVillageOwnTroops(context) {
            await fetch('http://localhost:8080/api/villageOwnTroops/' + context.getters.getActiveVillageId)
                .then(res => res.json())
                .then(res => {
                    let villageOwnTroops = [res.data.troop1, res.data.troop2, res.data.troop3, res.data.troop4, res.data.troop5,
                        res.data.troop6, res.data.troop7, res.data.troop8, res.data.troop9, res.data.troop10
                    ];
                    context.commit('setVillageOwnTroops', villageOwnTroops);
                })
                .catch(err => console.log(err));
        },
        async fetchVillageReinforcements(context) {
            await fetch('http://localhost:8080/api/villageReinforcements/' + context.getters.getActiveVillageId)
                .then(res => res.json())
                .then(res => {
                    let villageReinforcements = res.data;
                    context.commit('setVillageReinforcements', villageReinforcements);
                })
                .catch(err => console.log(err));
        },
        async fetchVillageTroopMovements(context) {
            await fetch('http://localhost:8080/api/sendTroops/' + context.getters.getActiveVillageId)
                .then(res => res.json())
                .then(res => {

                    let villageOutgoingAttacks = [];
                    let villageOutgoingReinforcements = [];
                    let villageIncomingAttacks = [];
                    let villageIncomingReinforcements = [];

                    for (let troopMovement of res.data) {
                        if (troopMovement.idVillageFrom == context.getters.getActiveVillageId) {
                            if (troopMovement.sendType == "full" || troopMovement.sendType == "raid") {
                                villageOutgoingAttacks.push(troopMovement);
                            } else if (troopMovement.sendType == "reinforcement") {
                                villageOutgoingReinforcements.push(troopMovement);
                            }
                        } else if (troopMovement.idVillageTo == context.getters.getActiveVillageId) {
                            if (troopMovement.sendType == "full" || troopMovement.sendType == "raid") {
                                villageIncomingAttacks.push(troopMovement);
                            } else if (troopMovement.sendType == "reinforcement" || troopMovement.sendType == "return") {
                                villageIncomingReinforcements.push(troopMovement);
                            }
                        }
                    }

                    context.commit('setVillageOutgoingAttacks', villageOutgoingAttacks);
                    context.commit('setVillageOutgoingReinforcements', villageOutgoingReinforcements);
                    context.commit('setVillageIncomingAttacks', villageIncomingAttacks);
                    context.commit('setVillageIncomingReinforcements', villageIncomingReinforcements);
                })
                .catch(err => console.log(err));
        },
        async fetchVillageBarracksProduction(context) {
            await fetch('http://localhost:8080/api/barracksProductions/' + context.getters.getActiveVillageId)
                .then(res => res.json())
                .then(res => {
                    let villageBarracksProduction = res.data;
                    context.commit('setVillageBarracksProduction', villageBarracksProduction);
                })
                .catch(err => console.log(err));
        },
        async fetchVillageStableProduction(context) {
            await fetch('http://localhost:8080/api/stableProductions/' + context.getters.getActiveVillageId)
                .then(res => res.json())
                .then(res => {
                    let villageStableProduction = res.data;
                    context.commit('setVillageStableProduction', villageStableProduction);
                })
                .catch(err => console.log(err));
        },
        async fetchVillageBuildingFields(context) {
            await fetch('http://localhost:8080/api/villageBuildingFields/' + context.getters.getActiveVillageId)
                .then(res => res.json())
                .then(res => {
                    let villageBuildingTypes = [
                        res.data.field1Type,
                        res.data.field2Type,
                        res.data.field3Type,
                        res.data.field4Type,
                        res.data.field5Type,
                        res.data.field6Type,
                        res.data.field7Type,
                        res.data.field8Type,
                        res.data.field9Type,
                        res.data.field10Type,
                        res.data.field11Type,
                        res.data.field12Type,
                        res.data.field13Type,
                        res.data.field14Type,
                        res.data.field15Type,
                        res.data.field16Type,
                        res.data.field17Type,
                        res.data.field18Type,
                        res.data.field19Type
                    ];

                    let villageBuildingLevels = [
                        res.data.field1Level,
                        res.data.field2Level,
                        res.data.field3Level,
                        res.data.field4Level,
                        res.data.field5Level,
                        res.data.field6Level,
                        res.data.field7Level,
                        res.data.field8Level,
                        res.data.field9Level,
                        res.data.field10Level,
                        res.data.field11Level,
                        res.data.field12Level,
                        res.data.field13Level,
                        res.data.field14Level,
                        res.data.field15Level,
                        res.data.field16Level,
                        res.data.field17Level,
                        res.data.field18Level,
                        res.data.field19Level
                    ];

                    let villageBuildingColors = villageBuildingTypes.map(type => {
                        switch(type) {
                            case 0: return "SlateGray";
                            case 1: return "Orange";        //Barracks
                            case 2: return "Brown";         //Warehouse
                            case 3: return "Yellow";        //Granary
                            case 4: return "Pink";          //Stable
                            case 5: return "SaddleBrown";   //Earth Wall
                            case 6: return "SaddleBrown";   //City Wall
                            case 7: return "SaddleBrown";   //Palisade
                            default: return "SlateGray";
                        }
                    });

                    context.commit('setVillageBuildingTypes', villageBuildingTypes);
                    context.commit('setVillageBuildingLevels', villageBuildingLevels);
                    context.commit('setVillageBuildingColors', villageBuildingColors);
                })
                .catch(err => console.log(err));
        },
        async fetchVillageResourceFields(context) {
            await fetch('http://localhost:8080/api/villageResourceFields/' + context.getters.getActiveVillageId)
                .then(res => res.json())
                .then(res => {
                    let villageResourceFieldTypes = [
                        res.data.field1Type,
                        res.data.field2Type,
                        res.data.field3Type,
                        res.data.field4Type,
                        res.data.field5Type,
                        res.data.field6Type,
                        res.data.field7Type,
                        res.data.field8Type,
                        res.data.field9Type,
                        res.data.field10Type,
                        res.data.field11Type,
                        res.data.field12Type,
                        res.data.field13Type,
                        res.data.field14Type,
                        res.data.field15Type,
                        res.data.field16Type,
                        res.data.field17Type,
                        res.data.field18Type
                    ];

                    let villageResourceFieldLevels = [
                        res.data.field1Level,
                        res.data.field2Level,
                        res.data.field3Level,
                        res.data.field4Level,
                        res.data.field5Level,
                        res.data.field6Level,
                        res.data.field7Level,
                        res.data.field8Level,
                        res.data.field9Level,
                        res.data.field10Level,
                        res.data.field11Level,
                        res.data.field12Level,
                        res.data.field13Level,
                        res.data.field14Level,
                        res.data.field15Level,
                        res.data.field16Level,
                        res.data.field17Level,
                        res.data.field18Level
                    ];

                    let villageResourceFieldColors = villageResourceFieldTypes.map(type => {
                        switch(type) {
                            case 0: return "Green";     //Woodcutter
                            case 1: return "Orange";    //Claypit
                            case 2: return "Silver";    //Ironmine
                            case 3: return "Gold";      //Cropland
                            default: return "White";
                        }
                    });

                    context.commit('setVillageResourceFieldTypes', villageResourceFieldTypes);
                    context.commit('setVillageResourceFieldLevels', villageResourceFieldLevels);
                    context.commit('setVillageResourceFieldColors', villageResourceFieldColors);
                })
                .catch(err => console.log(err));
        },
    },
    getters: {
        getVillageResources:                state => { return state.villageResources; },
        getVillageMaxResources:             state => { return state.villageMaxResources; },
        getVillageResourceFieldLevels:      state => { return state.villageResourceFieldLevels; },
        getVillageResourceFieldTypes:       state => { return state.villageResourceFieldTypes; },
        getVillageResourceFieldColors:      state => { return state.villageResourceFieldColors; },
        getVillageProduction:               state => { return state.villageProduction; },
        getVillageResFieldUpgrades:         state => { return state.villageResFieldUpgrades; },
        getVillageBuildingUpgrades:         state => { return state.villageBuildingUpgrades; },
        getVillageOwnTroops:                state => { return state.villageOwnTroops; },
        getVillageReinforcements:           state => { return state.villageReinforcements; },
        getVillageOutgoingAttacks:          state => { return state.villageOutgoingAttacks; },
        getVillageOutgoingReinforcements:   state => { return state.villageOutgoingReinforcements; },
        getVillageIncomingAttacks:          state => { return state.villageIncomingAttacks; },
        getVillageIncomingReinforcements:   state => { return state.villageIncomingReinforcements; },
        getVillageBarracksProduction:       state => { return state.villageBarracksProduction; },
        getVillageStableProduction:         state => { return state.villageStableProduction; },
        getVillageBuildingLevels:           state => { return state.villageBuildingLevels; },
        getVillageBuildingTypes:            state => { return state.villageBuildingTypes; },
        getVillageBuildingColors:           state => { return state.villageBuildingColors; },
        getActiveVillageId:                 state => { return state.activeVillageId; },
        getActiveVillageName:               state => { return state.activeVillageName; },
    }
})


Vue.config.productionTip = false;

new Vue({
    el: '#app',
    components: {
        App
    },
    router,
    store,
    render: h => h(App),

});

/*
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}
*/