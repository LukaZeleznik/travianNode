import { toolsMixins } from './toolsMixins'

export const fetchMixins = {
    data() {
        return {
            villageResources:               this.$store.getters.getVillageResources,
            villageOwnTroops:               this.$store.getters.getVillageOwnTroops,
            villageBuildingLevels:          this.$store.getters.getVillageBuildingLevels,
            villageBuildingTypes:           this.$store.getters.getVillageBuildingTypes,
            villageBuildingColors:          this.$store.getters.getVillageBuildingColors,
            villageResourceFieldLevels:     this.$store.getters.getVillageResourceFieldLevels,
            villageResourceFieldTypes:      this.$store.getters.getVillageResourceFieldTypes,
            villageResourceFieldColors:     this.$store.getters.getVillageResourceFieldColors,
            villageOutgoingAttacks:         this.$store.getters.getVillageOutgoingAttacks,
            villageOutgoingReinforcements:  this.$store.getters.getVillageOutgoingReinforcements,
            villageIncomingAttacks:         this.$store.getters.getVillageIncomingAttacks,
            villageIncomingReinforcements:  this.$store.getters.getVillageIncomingReinforcements,
            villageMaxResources:            this.$store.getters.getVillageMaxResources,
            villageProduction:              this.$store.getters.getVillageProduction,
            villageResFieldUpgrades:        this.$store.getters.getVillageResFieldUpgrades,
            villageBuildingUpgrades:        this.$store.getters.getVillageBuildingUpgrades,
            buildingInfoLookup: [],
            resourceInfoLookup: [],
            troopInfoLookup: [],
            resFieldVariationsInfoLookup: [],
        };
    },

    created() {
        this.infoLookup();
    },

    mixins: [toolsMixins],

    watch: {
        '$store.getters.getVillageResources': function() {
            this.villageResources = this.$store.getters.getVillageResources;
        },
        '$store.getters.getVillageOwnTroops': function() {
            this.villageOwnTroops = this.$store.getters.getVillageOwnTroops;
        },
        '$store.getters.getVillageBuildingLevels': function() {
            this.villageBuildingLevels = this.$store.getters.getVillageBuildingLevels;
        },
        '$store.getters.getVillageBuildingTypes': function() {
            this.villageBuildingTypes = this.$store.getters.getVillageBuildingTypes;
        },
        '$store.getters.getVillageBuildingColors': function() {
            this.villageBuildingColors = this.$store.getters.getVillageBuildingColors;
        },
        '$store.getters.getVillageResourceFieldLevels': function() {
            this.villageResourceFieldLevels = this.$store.getters.getVillageResourceFieldLevels;
        },
        '$store.getters.getVillageResourceFieldTypes': function() {
            this.villageResourceFieldTypes = this.$store.getters.getVillageResourceFieldTypes;
        },
        '$store.getters.getVillageResourceFieldColors': function() {
            this.villageResourceFieldColors = this.$store.getters.getVillageResourceFieldColors;
        },
        '$store.getters.getVillageOutgoingAttacks': function() {
            this.villageOutgoingAttacks = this.$store.getters.getVillageOutgoingAttacks;
        },
        '$store.getters.getVillageOutgoingReinforcements': function() {
            this.villageOutgoingReinforcements = this.$store.getters.getVillageOutgoingReinforcements;
        },
        '$store.getters.getVillageIncomingAttacks': function() {
            this.villageIncomingAttacks = this.$store.getters.getVillageIncomingAttacks;
        },
        '$store.getters.getVillageIncomingReinforcements': function() {
            this.villageIncomingReinforcements = this.$store.getters.getVillageIncomingReinforcements;
        },
        '$store.getters.getVillageReinforcements': function() {
            this.villageReinforcements = this.$store.getters.getVillageReinforcements;
        },
        '$store.getters.getVillageMaxResources': function() {
            this.villageMaxResources = this.$store.getters.getVillageMaxResources;
        },
        '$store.getters.getVillageProduction': function() {
            this.villageProduction = this.$store.getters.getVillageProduction;
        },
        '$store.getters.getVillageResFieldUpgrades': function() {
            this.villageResFieldUpgrades = this.$store.getters.getVillageResFieldUpgrades;
        },
        '$store.getters.getVillageBuildingUpgrades': function() {
            this.villageBuildingUpgrades = this.$store.getters.getVillageBuildingUpgrades;
        },
        
    },

    methods: {
        infoLookup(){
            this.buildingInfoLookup = require('@/assets/infoTables/buildingInfoLookup.json');
            this.resourceInfoLookup = require('@/assets/infoTables/resourceInfoLookup.json');
            this.troopInfoLookup = require('@/assets/infoTables/troopInfoLookup.json');
            this.resFieldVariationsInfoLookup = require('@/assets/infoTables/resFieldVariationsInfoLookup.json');

            /* 
                resFieldVariationsInfoLookup cheat sheet until better solution of identifying them is implemented:

                [0,3,0,2,1,1,2,3,3,2,2,3,3,0,3,1,0,1] 4,4,4,6
                [0,3,0,1,1,1,2,3,3,2,2,3,3,0,3,1,0,1] 4,5,3,6
                [0,3,0,2,0,1,2,3,3,2,2,3,3,0,3,1,0,1] 5,3,4,6
                [3,3,0,2,3,3,3,3,3,3,3,3,3,3,3,1,3,3] 1,1,1,15
                [3,3,0,3,3,1,2,3,3,2,2,3,3,0,3,1,0,1] 3,3,3,9
                
                // http://travian.kirilloid.ru/villages_res.php#s=1.36&pl=15&fl=10,10,10,10&fs=31
            */
        },
        fetchVillageOwnTroops(){ this.$store.dispatch('fetchVillageOwnTroops') },
        fetchVillageResources(){ this.$store.dispatch('fetchVillageResources') },
        fetchVillageProduction(){ this.$store.dispatch('fetchVillageProduction') },
        fetchVillageMaxResources(){ this.$store.dispatch('fetchVillageMaxResources') },
        fetchvillageBuildingFields(){ this.$store.dispatch('fetchVillageBuildingFields') },
        fetchvillageResourceFields(){ this.$store.dispatch('fetchVillageResourceFields') },
        fetchVillageTroopMovements(){ this.$store.dispatch('fetchVillageTroopMovements') },
        fetchVillageReinforcements(){ this.$store.dispatch('fetchVillageReinforcements') },
        fetchVillageResFieldUpgrades(){ this.$store.dispatch('fetchVillageResFieldUpgrades') },
        fetchVillageBuildingUpgrades(){ this.$store.dispatch('fetchVillageBuildingUpgrades') },

        fetchBuildingData(vbid){
            fetch('http://localhost:8080/api/villageBuildingFields/' + this.getCookie('activeVillageId'))
            .then(res => res.json())
            .then(res => {
                let keyType = "field"+vbid+"Type";
                let keyLevel = "field"+vbid+"Level";
                let userTribe = "teuton";

                if(vbid == 19){
                    switch (userTribe) {
                        case "teuton":  this.villageBuildingType = 5; break;
                        case "roman":   this.villageBuildingType = 6; break;
                        case "gaul":    this.villageBuildingType = 7; break;
                    }
                }
                else {
                    this.villageBuildingType = res.data[keyType];
                }
                this.villageBuildingLevel = res.data[keyLevel];
            })
            .catch(err => console.log(err));
        },
        fetchResourceFieldsData(rfid){
            fetch('http://localhost:8080/api/villageResourceFields/' + this.getCookie('activeVillageId'))
            .then(res => res.json())
            .then(res => {
                let keyType = "field"+rfid+"Type";
                let keyLevel = "field"+rfid+"Level";

                this.villageResourceType = res.data[keyType];
                this.villageResourceLevel = res.data[keyLevel];
            })
            .catch(err => console.log(err));
        },
    }
  }