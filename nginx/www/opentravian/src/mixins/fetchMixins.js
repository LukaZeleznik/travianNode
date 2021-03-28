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
            activeVillageId:                this.$store.getters.getActiveVillageId,
            sidebarVillageList:             this.$store.getters.getSidebarVillageList,
            researchesCompleted:            this.$store.getters.getResearchesCompleted,
            researches:                     this.$store.getters.getResearches,
            userTribe:                      this.$store.getters.getUserTribe,
            villageOutgoingResources:       this.$store.getters.getVillageOutgoingResources,
            villageIncomingResources:       this.$store.getters.getVillageIncomingResources,
            userReports:                    this.$store.getters.getUserReports,
            villageReinforcements:          this.$store.getters.getVillageReinforcements,
            buildingInfoLookup: [],
            resourceInfoLookup: [],
            troopInfoLookup: [],
            resFieldVariationsInfoLookup: [],
            researchesInfoLookup: [],
            merchantInfoLookup: [],
            config: {},
        };
    },

    created() {
        this.infoLookup();
        this.loadConfiguration();
    },

    mixins: [toolsMixins],

    watch: {
        '$store.getters.getVillageResources':                   function() { this.villageResources = this.$store.getters.getVillageResources; },
        '$store.getters.getVillageOwnTroops':                   function() { this.villageOwnTroops = this.$store.getters.getVillageOwnTroops; },
        '$store.getters.getVillageBuildingLevels':              function() { this.villageBuildingLevels = this.$store.getters.getVillageBuildingLevels; },
        '$store.getters.getVillageBuildingTypes':               function() { this.villageBuildingTypes = this.$store.getters.getVillageBuildingTypes; },
        '$store.getters.getVillageBuildingColors':              function() { this.villageBuildingColors = this.$store.getters.getVillageBuildingColors; },
        '$store.getters.getVillageResourceFieldLevels':         function() { this.villageResourceFieldLevels = this.$store.getters.getVillageResourceFieldLevels; },
        '$store.getters.getVillageResourceFieldTypes':          function() { this.villageResourceFieldTypes = this.$store.getters.getVillageResourceFieldTypes; },
        '$store.getters.getVillageResourceFieldColors':         function() { this.villageResourceFieldColors = this.$store.getters.getVillageResourceFieldColors; },
        '$store.getters.getVillageOutgoingAttacks':             function() { this.villageOutgoingAttacks = this.$store.getters.getVillageOutgoingAttacks; },
        '$store.getters.getVillageOutgoingReinforcements':      function() { this.villageOutgoingReinforcements = this.$store.getters.getVillageOutgoingReinforcements; },
        '$store.getters.getVillageIncomingAttacks':             function() { this.villageIncomingAttacks = this.$store.getters.getVillageIncomingAttacks; },
        '$store.getters.getVillageIncomingReinforcements':      function() { this.villageIncomingReinforcements = this.$store.getters.getVillageIncomingReinforcements; },
        '$store.getters.getVillageReinforcements':              function() { this.villageReinforcements = this.$store.getters.getVillageReinforcements; },
        '$store.getters.getVillageMaxResources':                function() { this.villageMaxResources = this.$store.getters.getVillageMaxResources; },
        '$store.getters.getVillageProduction':                  function() { this.villageProduction = this.$store.getters.getVillageProduction; },
        '$store.getters.getVillageResFieldUpgrades':            function() { this.villageResFieldUpgrades = this.$store.getters.getVillageResFieldUpgrades; },
        '$store.getters.getVillageBuildingUpgrades':            function() { this.villageBuildingUpgrades = this.$store.getters.getVillageBuildingUpgrades; },
        '$store.getters.getActiveVillageId':                    function() { this.activeVillageId = this.$store.getters.getActiveVillageId; },
        '$store.getters.getSidebarVillageList':                 function() { this.sidebarVillageList = this.$store.getters.getSidebarVillageList; },
        '$store.getters.getResearchesCompleted':                function() { this.researchesCompleted = this.$store.getters.getResearchesCompleted; },
        '$store.getters.getResearches':                         function() { this.researches = this.$store.getters.getResearches; },    
        '$store.getters.getUserTribe':                          function() { this.userTribe = this.$store.getters.getUserTribe; },
        '$store.getters.getVillageOutgoingResources':           function() { this.villageOutgoingResources = this.$store.getters.getVillageOutgoingResources; },
        '$store.getters.getVillageIncomingResources':           function() { this.villageIncomingResources = this.$store.getters.getVillageIncomingResources; },
        '$store.getters.getUserReports':                        function() { this.userReports = this.$store.getters.getUserReports; },
    },

    methods: {
        loadConfiguration(){
            this.config = require('@/config.json');
        },
        infoLookup(){
            this.buildingInfoLookup =               require('@/assets/infoTables/buildingInfoLookup.json');
            this.resourceInfoLookup =               require('@/assets/infoTables/resourceInfoLookup.json');
            this.troopInfoLookup =                  require('@/assets/infoTables/troopInfoLookup.json');
            this.resFieldVariationsInfoLookup =     require('@/assets/infoTables/resFieldVariationsInfoLookup.json');
            this.researchesInfoLookup =             require('@/assets/infoTables/researchesInfoLookup.json');
            this.merchantInfoLookup =               require('@/assets/infoTables/merchantInfoLookup.json');
        },
        fetchVillageOwnTroops()         { this.$store.dispatch('fetchVillageOwnTroops') },
        fetchVillageResources()         { this.$store.dispatch('fetchVillageResources') },
        fetchVillageProduction()        { this.$store.dispatch('fetchVillageProduction') },
        fetchVillageMaxResources()      { this.$store.dispatch('fetchVillageMaxResources') },
        fetchvillageBuildingFields()    { this.$store.dispatch('fetchVillageBuildingFields') },
        fetchvillageResourceFields()    { this.$store.dispatch('fetchVillageResourceFields') },
        fetchVillageTroopMovements()    { this.$store.dispatch('fetchVillageTroopMovements') },
        fetchVillageReinforcements()    { this.$store.dispatch('fetchVillageReinforcements') },
        fetchVillageResFieldUpgrades()  { this.$store.dispatch('fetchVillageResFieldUpgrades') },
        fetchVillageBuildingUpgrades()  { this.$store.dispatch('fetchVillageBuildingUpgrades') },
        fetchActiveVillageId()          { this.$store.dispatch('fetchActiveVillageId') },
        fetchSidebarVillageList()       { this.$store.dispatch('fetchSidebarVillageList') },
        fetchResearchesCompleted()      { this.$store.dispatch('fetchResearchesCompleted') },
        fetchResearches()               { this.$store.dispatch('fetchResearches') },
        fetchUserTribe()                { this.$store.dispatch('fetchUserTribe') },
        fetchVillageResourceMovements() { this.$store.dispatch('fetchVillageResourceMovements') },
        fetchUserReports()              { this.$store.dispatch('fetchUserReports') },

        fetchBuildingData(vbid){
            fetch('http://' + process.env.VUE_APP_BASE_URL + ':8080/api/villageBuildingFields/' + this.activeVillageId, {credentials: 'include'})
            .then(res => res.json())
            .then(res => {
                const keyType = "field"+vbid+"Type";
                const keyLevel = "field"+vbid+"Level";

                if(vbid == 19){
                    switch (this.userTribe) {
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
            fetch('http://' + process.env.VUE_APP_BASE_URL + ':8080/api/villageResourceFields/' + this.activeVillageId, {credentials: 'include'})
            .then(res => res.json())
            .then(res => {
                const keyType = "field"+rfid+"Type";
                const keyLevel = "field"+rfid+"Level";

                this.villageResourceType = res.data[keyType];
                this.villageResourceLevel = res.data[keyLevel];
            })
            .catch(err => console.log(err));
        },
    }
  }