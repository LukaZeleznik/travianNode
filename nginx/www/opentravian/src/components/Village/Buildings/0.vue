<template>
    <div>
        <table class="table table-bordered">
            <tbody>
                <tr v-for="(availableBuilding, index) in availableBuildings" v-bind:key="'availableBuilding'+index">
                    <th scope="row" class="align-middle text-center"> 
                        <span class="d-block">{{ buildingInfoLookup[availableBuilding]['name'] }}</span>
                        <span class="d-block my-4" style="font-weight:normal !important;">{{ buildingInfoLookup[availableBuilding]['desc'] }}</span>
                        <span class="troopRequirements my-3">
                            <img src="/images/resources/wood.gif">  {{ buildingInfoLookup[availableBuilding]['wood'][1] }} |
                            <img src="/images/resources/clay.gif">  {{ buildingInfoLookup[availableBuilding]['clay'][1] }} |
                            <img src="/images/resources/iron.gif">  {{ buildingInfoLookup[availableBuilding]['iron'][1] }} |
                            <img src="/images/resources/crop.gif">  {{ buildingInfoLookup[availableBuilding]['crop'][1] }} |
                            <img src="/images/consum.gif">          {{ buildingInfoLookup[availableBuilding]['consumption'][1] }} |
                            <img src="/images/clock.gif">           {{ secondsToTimeRemaining(buildingInfoLookup[availableBuilding]['constructionTime'][1] / config.SERVER_SPEED * 1000) }}
                        </span>
                        <div class="mt-3">
                            <span v-if="villageBuildingUpgrades.length > 0">Another building is already being upgraded</span>
                            <button v-else type="button" class="btn btn-success w-50" @click="build(availableBuilding)">Build</button> 
                        </div>
                    </th>
                </tr>
            </tbody>
        </table>
        <h5 class="text-center mt-5 mb-3">AVAILABLE SOON</h5>
        <table class="table table-bordered m-auto">
            <tbody>
                <tr v-for="(soonAvailableBuilding, index) in soonAvailableBuildings" v-bind:key="'soonAvailableBuilding'+index">
                    <th scope="row" class="align-middle text-center"> 
                        <span class="d-block">{{ buildingInfoLookup[soonAvailableBuilding]['name'] }}</span>
                        <span class="d-block my-4" style="font-weight:normal !important;">{{ buildingInfoLookup[soonAvailableBuilding]['desc'] }}</span>
                        <span class="troopRequirements my-3">
                            <img src="/images/resources/wood.gif">  {{ buildingInfoLookup[soonAvailableBuilding]['wood'][1] }} |
                            <img src="/images/resources/clay.gif">  {{ buildingInfoLookup[soonAvailableBuilding]['clay'][1] }} |
                            <img src="/images/resources/iron.gif">  {{ buildingInfoLookup[soonAvailableBuilding]['iron'][1] }} |
                            <img src="/images/resources/crop.gif">  {{ buildingInfoLookup[soonAvailableBuilding]['crop'][1] }} |
                            <img src="/images/consum.gif">          {{ buildingInfoLookup[soonAvailableBuilding]['consumption'][1] }} |
                            <img src="/images/clock.gif">           {{ secondsToTimeRemaining(buildingInfoLookup[soonAvailableBuilding]['constructionTime'][1] / config.SERVER_SPEED * 1000) }}
                        </span>
                    </th>
                </tr>
            </tbody>
        </table>
        <h5 class="mt-4 text-danger" id="errorMessage"></h5>
    </div>
</template>


<script>
import { fetchMixins } from '@/mixins/fetchMixins'
import { toolsMixins } from '@/mixins/toolsMixins'

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
            availableBuildings: [],
            soonAvailableBuildings: [],
        };
    },

    mixins: [fetchMixins,toolsMixins],

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
        async build(buildingId){
            let buildingData = {
                "idVillage": this.activeVillageId,
                "vbid": this.$route.params.vbid,
                "type": buildingId
            }

            let buildingUpgradeResponse = await this.doApiRequest("villageBuildingUpgrades", "POST", buildingData,true);
            let buildingUpgradeResponseJson = await buildingUpgradeResponse.json();

            if(buildingUpgradeResponseJson.message == "villageBuildingUpgrade success"){
                this.fetchvillageBuildingFields();
                this.$router.push({ name: 'village' });
            }
            else{
                document.getElementById("errorMessage").innerText = buildingUpgradeResponseJson.message;
            }
        },
    }
}
</script>