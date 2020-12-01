<template>
    <div>
        <table class="table table-bordered w-75 m-auto">
            <tbody>
                <tr v-for="(availableBuilding, index) in availableBuildings" v-bind:key="'availableBuilding'+index">
                    <th scope="row" class="align-middle text-left" style="min-width:650px"> {{ buildingInfoLookup[availableBuilding]['name'] }}
                        <span class="troopRequirements float-right">
                            <img src="/images/resources/wood.gif">  {{ buildingInfoLookup[availableBuilding]['wood'][1] }} |
                            <img src="/images/resources/clay.gif">  {{ buildingInfoLookup[availableBuilding]['clay'][1] }} |
                            <img src="/images/resources/iron.gif">  {{ buildingInfoLookup[availableBuilding]['iron'][1] }} |
                            <img src="/images/resources/crop.gif">  {{ buildingInfoLookup[availableBuilding]['crop'][1] }} |
                            <img src="/images/consum.gif">          {{ buildingInfoLookup[availableBuilding]['consumption'][1] }} |
                            <img src="/images/clock.gif">           {{ $root.secondsToTimeRemaining(buildingInfoLookup[availableBuilding]['constructionTime'][1] * 1000) }}
                        </span>
                    </th>
                    <td class="align-middle">
                        <div class="input-group input-group-sm mb-3 align-middle"> 
                            <h5 class="mt-4"> 
                                <button type="button" class="btn btn-success" @click="build(availableBuilding)">Build</button> 
                            </h5>
                        </div>
                    </td>
                </tr>
                <h5 style="text-align:left;">AVAILABLE SOON</h5>
                <tr v-for="(soonAvailableBuilding, index) in soonAvailableBuildings" v-bind:key="'soonAvailableBuilding'+index">
                    <th scope="row" class="align-middle text-left" style="min-width:650px"> {{ buildingInfoLookup[soonAvailableBuilding]['name'] }}
                        <span class="troopRequirements float-right">
                            <img src="/images/resources/wood.gif">  {{ buildingInfoLookup[soonAvailableBuilding]['wood'][1] }} |
                            <img src="/images/resources/clay.gif">  {{ buildingInfoLookup[soonAvailableBuilding]['clay'][1] }} |
                            <img src="/images/resources/iron.gif">  {{ buildingInfoLookup[soonAvailableBuilding]['iron'][1] }} |
                            <img src="/images/resources/crop.gif">  {{ buildingInfoLookup[soonAvailableBuilding]['crop'][1] }} |
                            <img src="/images/consum.gif">          {{ buildingInfoLookup[soonAvailableBuilding]['consumption'][1] }} |
                            <img src="/images/clock.gif">           {{ $root.secondsToTimeRemaining(buildingInfoLookup[soonAvailableBuilding]['constructionTime'][1] * 1000) }}
                        </span>
                    </th>
                </tr>
            </tbody>
        </table>
        <h5 class="mt-4 text-danger" id="errorMessage"></h5>
    </div>
</template>


<script>
//Buildings
const EARTH_WALL = 5;
const CITY_WALL = 6;
const PALISADE = 7;
const BAKERY = 8;
const BRICKYARD = 9;
const GRAIN_MILL = 10;
const IRON_FOUNDRY = 11;
const SAWMILL = 12;

//Resources
const WOODCUTTER = 0;
const CLAY_PIT = 1;
const IRON_MINE = 2;
const CROPLAND = 3;

export default {
    data() {
        return {
            buildingInfoLookup: this.$parent.buildingInfoLookup,
            villageBuildingLevels: this.$store.getters.getVillageBuildingLevels,
            villageBuildingTypes: this.$store.getters.getVillageBuildingTypes,
            villageBuildingColors: this.$store.getters.getVillageBuildingColors,
            villageResourceFieldLevels: this.$store.getters.getVillageResourceFieldLevels,
            villageResourceFieldTypes: this.$store.getters.getVillageResourceFieldTypes,
            villageResourceFieldColors: this.$store.getters.getVillageResourceFieldColors,
            availableBuildings: [],
            soonAvailableBuildings: [],
        };
    },

    created() {
        this.fetchvillageBuildingFields();
        this.fetchvillageResourceFields();
        this.getAvailableBuildings();
    },

    methods: {
        getAvailableBuildings(){
            for(let i = 1; i < this.buildingInfoLookup.length; i++){
                if(this.villageBuildingTypes<=0 || this.villageBuildingLevels<=0) break;

                // Skip walls, they have separate field
                if(i != EARTH_WALL && i != CITY_WALL && i != PALISADE) {
                    if(this.villageBuildingTypes.includes(this.buildingInfoLookup[i]['id'])){

                        // Unique code for buildings that support multiple of the same type
                        for(let l = 0; l < this.villageBuildingTypes.length; l++){
                            if(this.villageBuildingTypes[l] == this.buildingInfoLookup[i]['id']) {
                                if(this.buildingInfoLookup[i]['allowMultiple'] && this.villageBuildingLevels[l] == 20) {
                                    this.availableBuildings.push(this.buildingInfoLookup[i]['id']);
                                    break;
                                }
                            }
                        }
                    } else {
                        // Unique code for buldings that require certain level of resource fields
                        if ([BAKERY,BRICKYARD,GRAIN_MILL,IRON_FOUNDRY,SAWMILL].includes(i)){
                            let allowf = false;
                            switch (i) {
                                case BAKERY:
                                    if(this.hasRequiredResFieldLevel(CROPLAND,10)){
                                        for(let l = 0; l < this.villageBuildingTypes.length; l++){
                                            if(this.villageBuildingTypes[l] == GRAIN_MILL || this.villageBuildingLevels[l] == 5) {
                                                allowf = true;
                                            }
                                        }
                                    }
                                    break;
                                case BRICKYARD:     if(this.hasRequiredResFieldLevel(CLAY_PIT,10))    allowf = true; break;
                                case GRAIN_MILL:    if(this.hasRequiredResFieldLevel(CROPLAND,5))     allowf = true; break;
                                case IRON_FOUNDRY:  if(this.hasRequiredResFieldLevel(IRON_MINE,10))   allowf = true; break;
                                case SAWMILL:       if(this.hasRequiredResFieldLevel(WOODCUTTER,10))  allowf = true; break;
                            }
                            if(allowf){
                                // Available
                                this.availableBuildings.push(this.buildingInfoLookup[i]['id']);
                            } else {
                                // Available soon (missing requirements)
                                this.soonAvailableBuildings.push(this.buildingInfoLookup[i]['id']);
                            }
                        } else {  
                            this.availableBuildings.push(this.buildingInfoLookup[i]['id']);
                        }
                    }
                }
            }
        },
        hasRequiredResFieldLevel(type,level){
            for(let l = 0; l < this.villageResourceFieldTypes.length; l++){
                if(this.villageResourceFieldTypes[l] == type && this.villageResourceFieldLevels[l] >= level) {
                    return true;
                }
            }
            return false;
        },
        fetchvillageBuildingFields(){
            this.villageBuildingLevels  = this.$store.getters.getVillageBuildingLevels;
            this.villageBuildingTypes   = this.$store.getters.getVillageBuildingTypes;
            this.villageBuildingColors  = this.$store.getters.getVillageBuildingColors;

            this.$store.dispatch('fetchVillageBuildingFields')
            .then( () => {
                this.villageBuildingLevels  = this.$store.getters.getVillageBuildingLevels;
                this.villageBuildingTypes   = this.$store.getters.getVillageBuildingTypes;
                this.convertBuildingTypeToName();
            });
        },
        fetchvillageResourceFields(){
            this.villageResourceFieldLevels  = this.$store.getters.getVillageResourceFieldLevels;
            this.villageResourceFieldTypes   = this.$store.getters.getVillageResourceFieldTypes;
            this.villageResourceFieldColors  = this.$store.getters.getVillageResourceFieldColors;

            this.$store.dispatch('fetchVillageResourceFields')
            .then( () => {
                this.villageResourceFieldLevels  = this.$store.getters.getVillageResourceFieldLevels;
                this.villageResourceFieldTypes   = this.$store.getters.getVillageResourceFieldTypes;
                this.villageResourceFieldColors  = this.$store.getters.getVillageResourceFieldColors;
            });
        },
        convertBuildingTypeToName(){
            this.villageBuildingNames = this.villageBuildingTypes.map(type => {
                return this.$parent.buildingInfoLookup[type]['name'];
            });
        },
        async build(buildingId){
            let buildingData = {
                "idVillage": 1,
                "vbid": this.$route.params.vbid,
                "type": buildingId
            }

            let buildingUpgradeResponse = await this.$root.doApiRequest("villageBuildingUpgrades", "POST", buildingData);
            let buildingUpgradeResponseJson = await buildingUpgradeResponse.json();

            if(buildingUpgradeResponseJson.message == "villageBuildingUpgrade success"){
                this.$router.push({ name: 'village' });
            }
            else{
                document.getElementById("errorMessage").innerText = buildingUpgradeResponseJson.message;
            }
        },
    }
}
</script>