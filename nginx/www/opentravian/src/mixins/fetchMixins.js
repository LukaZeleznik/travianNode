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
            buildingInfoLookup: [],
            resourceInfoLookup: [],
            troopInfoLookup: [],
        };
    },

    created() {
        this.infoLookup();
    },

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
    },

    methods: {
        infoLookup(){
            this.buildingInfoLookup = require('../assets/infoTables/buildingInfoLookup.json');
            this.resourceInfoLookup = require('../assets/infoTables/resourceInfoLookup.json');
            this.troopInfoLookup = require('../assets/infoTables/troopInfoLookup.json');
        },
        fetchVillageOwnTroops(){ this.$store.dispatch('fetchVillageOwnTroops') },
        fetchVillageResources(){ this.$store.dispatch('fetchVillageResources') },
        fetchvillageBuildingFields(){ this.$store.dispatch('fetchVillageBuildingFields') },
        fetchvillageResourceFields(){ this.$store.dispatch('fetchVillageResourceFields') },
        fetchVillageTroopMovements(){ this.$store.dispatch('fetchVillageTroopMovements') },

        fetchBuildingData(vbid){
            fetch('http://localhost:8080/api/villageBuildingFields/1')
            .then(res => res.json())
            .then(res => {
                let keyType = "field"+vbid+"Type";
                let keyLevel = "field"+vbid+"Level";
                let userTribe = "Teuton";

                if(vbid == 19){
                    switch (userTribe) {
                        case "Teuton":  this.villageBuildingType = 5; break;
                        case "Roman":   this.villageBuildingType = 6; break;
                        case "Gaul":    this.villageBuildingType = 7; break;
                    }
                }
                else {
                    this.villageBuildingType = res.data[keyType];
                }
                this.villageBuildingLevel = res.data[keyLevel];
            })
            .catch(err => console.log(err));
        },
    }
  }