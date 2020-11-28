import Vue from 'vue';
import VueRouter from 'vue-router';
import Vuex from 'vuex';

import Resources from './components/Resources.vue';
import Login from './components/Login.vue';
import ResourceField from './components/ResourceField.vue';
import Village from './components/Village.vue';
import VillageBuilding from './components/VillageBuilding.vue';
import SendTroops from './components/SendTroops.vue';
import Map from './components/Map.vue';
import App from './components/app.vue';

// Navbar
Vue.component('navbarMenu', require('./components/Main/Navbar/Menu.vue').default);
Vue.component('navbarResources', require('./components/Main/Navbar/Resources.vue').default);

// Sidebars
Vue.component('sidebarTroops', require('./components/Main/Sidebar/Troops.vue').default);
Vue.component('sidebarTroopMovements', require('./components/Main/Sidebar/TroopMovements.vue').default);
Vue.component('sidebarProduction', require('./components/Main/Sidebar/Production.vue').default);

//Footer
Vue.component('footerBuildingQueue', require('./components/Main/Footer/BuildingQueue.vue').default);

// Village
Vue.component('villageFields', require('./components/Village/Fields.vue').default);
Vue.component('villageBuilding0', require('./components/Village/Buildings/0.vue').default);
Vue.component('villageBuilding1', require('./components/Village/Buildings/1.vue').default);

//Resources
Vue.component('resourcesFields', require('./components/Resources/Fields.vue').default);

Vue.use(VueRouter);
Vue.use(Vuex);

const router = new VueRouter({
    mode: 'history',
    routes: [{
            path: '/',
            redirect: '/resources'
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
            path: '/map',
            name: 'map',
            component: Map
        },
    ],
});

const store = new Vuex.Store({
    state: {
        count: 0,
        villageResources: [0, 0, 0, 0],
        villageMaxResources: [0, 0, 0, 0],
        villageResFieldLevels: [],
        villageResFieldTypes: [],
        villageResFieldColors: ["", "Green", "Orange", "Silver", "", "Silver", "Gold", "Gold", "Green", "Orange", "Gold", "White", "Gold", "Orange", "Green", "Gold", "Gold", "Silver", "", "Silver", "Orange", "Green"],
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
        villageBuildingLevels: [],
        villageBuildingTypes: [],
        villageBuildingColors: [],
    },
    mutations: {
        increment(state, payload) {
            state.count += payload;
        },
        setVillageResources(state, resources) {
            state.villageResources = resources;
        },
        setVillageMaxResources(state, villageMaxResources) {
            state.villageMaxResources = villageMaxResources;
        },
        setVillageResFieldLevels(state, villageResFieldLevels) {
            state.villageResFieldLevels = villageResFieldLevels;
        },
        setVillageResFieldTypes(state, villageResFieldTypes) {
            state.villageResFieldTypes = villageResFieldTypes;
        },
        setVillageResFieldColors(state, villageResFieldColors) {
            state.villageResFieldColors = villageResFieldColors;
        },
        setVillageProduction(state, villageProduction) {
            state.villageProduction = villageProduction;
        },
        setVillageResFieldUpgrades(state, villageResFieldUpgrades) {
            state.villageResFieldUpgrades = villageResFieldUpgrades;
        },
        setVillageBuildingUpgrades(state, villageBuildingUpgrades) {
            state.villageBuildingUpgrades = villageBuildingUpgrades;
        },
        setVillageOwnTroops(state, villageOwnTroops) {
            state.villageOwnTroops = villageOwnTroops;
        },
        setVillageReinforcements(state, villageReinforcements) {
            state.villageReinforcements = villageReinforcements;
        },
        setVillageOutgoingAttacks(state, villageOutgoingAttacks) {
            state.villageOutgoingAttacks = villageOutgoingAttacks;
        },
        setVillageOutgoingReinforcements(state, villageOutgoingReinforcements) {
            state.villageOutgoingReinforcements = villageOutgoingReinforcements;
        },
        setVillageIncomingAttacks(state, villageIncomingAttacks) {
            state.villageIncomingAttacks = villageIncomingAttacks;
        },
        setVillageIncomingReinforcements(state, villageIncomingReinforcements) {
            state.villageIncomingReinforcements = villageIncomingReinforcements;
        },
        setVillageBarracksProduction(state, villageBarracksProduction) {
            state.villageBarracksProduction = villageBarracksProduction;
        },
        setVillageBuildingLevels(state, villageBuildingLevels) {
            state.villageBuildingLevels = villageBuildingLevels;
        },
        setVillageBuildingTypes(state, villageBuildingTypes) {
            state.villageBuildingTypes = villageBuildingTypes;
        },
        setVillageBuildingColors(state, villageBuildingColors) {
            state.villageBuildingColors = villageBuildingColors;
        },
    },
    actions: {
        increment(context, payload) {
            context.commit('increment', payload)
        },
        async fetchVillageResources(context) {
            await fetch('http://localhost:8080/api/villageResources/1')
                .then(res => res.json())
                .then(res => {
                    let villageResources = [res.data.currentWood, res.data.currentClay, res.data.currentIron, res.data.currentCrop];
                    context.commit('setVillageResources', villageResources);
                })
                .catch(err => console.log(err));
        },
        async fetchVillageMaxResources(context) {
            await fetch('http://localhost:8080/api/villageMaxResources/1')
                .then(res => res.json())
                .then(res => {
                    let villageMaxResources = [res.data.maxWood, res.data.maxClay, res.data.maxIron, res.data.maxCrop];
                    context.commit('setVillageMaxResources', villageMaxResources);
                })
                .catch(err => console.log(err));
        },
        async fetchVillageResFieldLevels(context) {
            await fetch('http://localhost:8080/api/villageFieldLevels/1')
                .then(res => res.json())
                .then(res => {
                    let villageResFieldLevels = ["", res.data.resField1Level, res.data.resField2Level, res.data.resField3Level, "",
                        res.data.resField4Level, res.data.resField5Level, res.data.resField6Level, res.data.resField7Level,
                        res.data.resField8Level, res.data.resField9Level, "Village", res.data.resField10Level, res.data.resField11Level,
                        res.data.resField12Level, res.data.resField13Level, res.data.resField14Level, res.data.resField15Level,
                        "", res.data.resField16Level, res.data.resField17Level, res.data.resField18Level
                    ];

                    context.commit('setVillageResFieldLevels', villageResFieldLevels);
                })
                .catch(err => console.log(err));
        },
        async fetchVillageResFieldTypes(context) {
            await fetch('http://localhost:8080/api/villageFieldTypes/1')
                .then(res => res.json())
                .then(res => {
                    let villageResFieldTypes = ["", res.data.resField1Type, res.data.resField2Type, res.data.resField3Type, "",
                        res.data.resField4Type, res.data.resField5Type, res.data.resField6Type, res.data.resField7Type,
                        res.data.resField8Type, res.data.resField9Type, "village", res.data.resField10Type, res.data.resField11Type,
                        res.data.resField12Type, res.data.resField13Type, res.data.resField14Type, res.data.resField15Type,
                        "", res.data.resField16Type, res.data.resField17Type, res.data.resField18Type
                    ];

                    let villageResFieldColors = villageResFieldTypes.map(type => {
                        if (type == "wood") {
                            return "Green"
                        } else if (type == "clay") {
                            return "Orange"
                        } else if (type == "iron") {
                            return "Silver"
                        } else if (type == "crop") {
                            return "Gold"
                        } else if (type == "village") {
                            return "White"
                        } else {
                            return ""
                        }
                    });

                    context.commit('setVillageResFieldTypes', villageResFieldTypes);
                    context.commit('setVillageResFieldColors', villageResFieldColors);
                })
                .catch(err => console.log(err));
        },
        async fetchVillageProduction(context) {
            await fetch('http://localhost:8080/api/villageProductions/1')
                .then(res => res.json())
                .then(res => {
                    let villageProduction = [res.data.productionWood, res.data.productionClay, res.data.productionIron, res.data.productionCrop];
                    context.commit('setVillageProduction', villageProduction);
                })
                .catch(err => console.log(err));
        },
        async fetchVillageResFieldUpgrades(context) {
            await fetch('http://localhost:8080/api/resFieldUpgrades/1')
                .then(res => res.json())
                .then(res => {
                    let villageResFieldUpgrades = res.data;
                    context.commit('setVillageResFieldUpgrades', villageResFieldUpgrades);
                })
                .catch(err => console.log(err));
        },
        async fetchVillageBuildingUpgrades(context) {
            await fetch('http://localhost:8080/api/BuildingUpgrades/1')
                .then(res => res.json())
                .then(res => {
                    let villageBuildingUpgrades = res.data;
                    context.commit('setVillageBuildingUpgrades', villageBuildingUpgrades);
                })
                .catch(err => console.log(err));
        },
        async fetchVillageOwnTroops(context) {
            await fetch('http://localhost:8080/api/villageOwnTroops/1')
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
            await fetch('http://localhost:8080/api/villageReinforcements/1')
                .then(res => res.json())
                .then(res => {
                    let villageReinforcements = res.data;
                    context.commit('setVillageReinforcements', villageReinforcements);
                })
                .catch(err => console.log(err));
        },
        async fetchVillageTroopMovements(context) {
            await fetch('http://localhost:8080/api/sendTroops/1')
                .then(res => res.json())
                .then(res => {

                    let villageOutgoingAttacks = [];
                    let villageOutgoingReinforcements = [];
                    let villageIncomingAttacks = [];
                    let villageIncomingReinforcements = [];

                    for (let troopMovement of res.data) {
                        if (troopMovement.idVillageFrom == 1) {
                            if (troopMovement.sendType == "full" || troopMovement.sendType == "raid") {
                                villageOutgoingAttacks.push(troopMovement);
                            } else if (troopMovement.sendType == "reinforcement" || troopMovement.sendType == "return") {
                                villageOutgoingReinforcements.push(troopMovement);
                            }
                        } else if (troopMovement.idVillageTo == 1) {
                            if (troopMovement.sendType == "full" || troopMovement.sendType == "raid") {
                                villageIncomingAttacks.push(troopMovement);
                            } else if (troopMovement.sendType == "reinforcement" || troopMovement.sendType == "return") {
                                villageIncomingReinforcements.push(troopMovement);
                            }
                        }
                    }
              context.commit('setVillageResFieldTypes', villageResFieldTypes);
              context.commit('setVillageResFieldColors', villageResFieldColors);
          })
          .catch(err => console.log(err));
      },
      async fetchVillageProduction(context){
          await fetch('http://localhost:8080/api/villageProductions/1')
          .then(res => res.json())
          .then(res => {
              let villageProduction = [res.data.productionWood,res.data.productionClay,res.data.productionIron,res.data.productionCrop];
              context.commit('setVillageProduction', villageProduction);
          })
          .catch(err => console.log(err));
      },
      async fetchVillageResFieldUpgrades(context){
          await fetch('http://localhost:8080/api/resFieldUpgrades/1')
          .then(res => res.json())
          .then(res => {
              let villageResFieldUpgrades = res.data;
              context.commit('setVillageResFieldUpgrades', villageResFieldUpgrades);
          })
          .catch(err => console.log(err));
      },
      async fetchVillageBuildingUpgrades(context){
        await fetch('http://localhost:8080/api/villageBuildingUpgrades/1')
        .then(res => res.json())
        .then(res => {
            let villageBuildingUpgrades = res.data;
            context.commit('setVillageBuildingUpgrades', villageBuildingUpgrades);
        })
        .catch(err => console.log(err));
    },
      async fetchVillageOwnTroops(context){
          await fetch('http://localhost:8080/api/villageOwnTroops/1')
          .then(res => res.json())
          .then(res => {        
              let villageOwnTroops = [res.data.troop1,res.data.troop2,res.data.troop3,res.data.troop4,res.data.troop5,
                res.data.troop6,res.data.troop7,res.data.troop8,res.data.troop9,res.data.troop10];
              context.commit('setVillageOwnTroops', villageOwnTroops);
          })
          .catch(err => console.log(err));
      },
      async fetchVillageReinforcements(context){
          await fetch('http://localhost:8080/api/villageReinforcements/1')
          .then(res => res.json())
          .then(res => {
            let villageReinforcements = res.data;
            context.commit('setVillageReinforcements', villageReinforcements);
          })
          .catch(err => console.log(err));
      },
      async fetchVillageTroopMovements(context){
          await fetch('http://localhost:8080/api/sendTroops/1')
          .then(res => res.json())
          .then(res => {
              
              let villageOutgoingAttacks = [];
              let villageOutgoingReinforcements = [];
              let villageIncomingAttacks = [];
              let villageIncomingReinforcements = [];
                    context.commit('setVillageOutgoingAttacks', villageOutgoingAttacks);
                    context.commit('setVillageOutgoingReinforcements', villageOutgoingReinforcements);
                    context.commit('setVillageIncomingAttacks', villageIncomingAttacks);
                    context.commit('setVillageIncomingReinforcements', villageIncomingReinforcements);
                })
                .catch(err => console.log(err));
        },
        async fetchVillageBarracksProduction(context) {
            await fetch('http://localhost:8080/api/barracksProductions/1')
                .then(res => res.json())
                .then(res => {
                    let villageBarracksProduction = res.data;
                    context.commit('setVillageBarracksProduction', villageBarracksProduction);
                })
                .catch(err => console.log(err));
        },
        async fetchVillageBuildingsData(context) {
            await fetch('http://localhost:8080/api/villageBuildingsData/1')
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
                        res.data.field18Type
                    ];
                    console.log(villageBuildingTypes);

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
                        res.data.field18Level
                    ];

              context.commit('setVillageOutgoingAttacks', villageOutgoingAttacks);
              context.commit('setVillageOutgoingReinforcements', villageOutgoingReinforcements);
              context.commit('setVillageIncomingAttacks', villageIncomingAttacks);
              context.commit('setVillageIncomingReinforcements', villageIncomingReinforcements);    
          })
          .catch(err => console.log(err));
      },
      async fetchVillageBarracksProduction(context){
          await fetch('http://localhost:8080/api/barracksProductions/1')
          .then(res => res.json())
          .then(res => {
            let villageBarracksProduction = res.data;
            context.commit('setVillageBarracksProduction', villageBarracksProduction);
          })
          .catch(err => console.log(err));
      },
      async fetchVillageBuildingFields(context){
        await fetch('http://localhost:8080/api/villageBuildingFields/1')
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
                res.data.field18Type
            ];
            console.log(villageBuildingTypes);
                    let villageBuildingColors = villageBuildingTypes.map(type => {
                        if (type == 0) {
                            return "SlateGray"
                        } else if (type > 0) {
                            return "Orange"
                        } else {
                            return ""
                        }
                    });

                    context.commit('setVillageBuildingTypes', villageBuildingTypes);
                    context.commit('setVillageBuildingLevels', villageBuildingLevels);
                    context.commit('setVillageBuildingColors', villageBuildingColors);
                })
                .catch(err => console.log(err));
        },

    },
    getters: {
        incrementGetter: state => {
            return state.count;
        },
        getVillageResources: state => {
            return state.villageResources;
        },
        getVillageMaxResources: state => {
            return state.villageMaxResources;
        },
        getVillageResFieldLevels: state => {
            return state.villageResFieldLevels;
        },
        getVillageResFieldTypes: state => {
            return state.villageResFieldTypes;
        },
        getVillageResFieldColors: state => {
            return state.villageResFieldColors;
        },
        getVillageProduction: state => {
            return state.villageProduction;
        },
        getVillageResFieldUpgrades: state => {
            return state.villageResFieldUpgrades;
        },
        getVillageBuildingUpgrades: state => {
            return state.villageBuildingUpgrades;
        },
        getVillageOwnTroops: state => {
            return state.villageOwnTroops;
        },
        getVillageReinforcements: state => {
            return state.villageReinforcements;
        },
        getVillageOutgoingAttacks: state => {
            return state.villageOutgoingAttacks;
        },
        getVillageOutgoingReinforcements: state => {
            return state.villageOutgoingReinforcements;
        },
        getVillageIncomingAttacks: state => {
            return state.villageIncomingAttacks;
        },
        getVillageIncomingReinforcements: state => {
            return state.villageIncomingReinforcements;
        },
        getVillageBarracksProduction: state => {
            return state.villageBarracksProduction;
        },
        getVillageBuildingLevels: state => {
            return state.villageBuildingLevels;
        },
        getVillageBuildingTypes: state => {
            return state.villageBuildingTypes;
        },
        getVillageBuildingColors: state => {
            return state.villageBuildingColors;
        },
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

    methods: {
        async doApiRequest(path, method, data) {
            let response = await fetch('http://localhost:8080/api/' + path, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            console.log(response);
            return response;
        },
        secondsToTimeCompleted(seconds) {
            return new Date(seconds).toLocaleTimeString('sl-SI')
        },
        secondsToTimeRemaining(seconds) {
            return new Date(seconds).toISOString().substr(11, 8)
        }
    },

});