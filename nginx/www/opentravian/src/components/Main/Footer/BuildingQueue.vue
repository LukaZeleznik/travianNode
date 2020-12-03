<template>
    <div>
        <div class="h3 pl-5 ml-4 my-3" v-if="villageResFieldUpgrades.length > 0 || villageBuildingUpgrades.length > 0">Buildings:</div>
        
        <div class="d-flex justify-content-between pl-5 ml-4" v-if="villageResFieldUpgrades.length > 0">
            <h5 style="min-width: 200px;"><img @click="cancelResFieldUpgrade(villageResFieldUpgrades)" style="width: 1.0rem;height: 0.9rem;cursor: pointer;" src="/images/del.gif">
                {{ resourceInfoLookup[villageResFieldUpgrades[0].fieldType]['name']}} <!-- should NOT be name..should be field type... -->
                (Level {{ (villageResFieldUpgrades[0].fieldLevel+1) }})</h5>
            <h5 class="text-center" v-if="villageResFieldUpgradesTimeLeft[0] > -1">
                in <span id="upgradeCD1">{{ $root.secondsToTimeRemaining(villageResFieldUpgradesTimeLeft[0]*1000) }}</span>
            </h5>
            <h5 class="text-right" v-if="villageResFieldUpgrades[0].timeCompleted > 0">
                done at {{ $root.secondsToTimeCompleted(villageResFieldUpgrades[0].timeCompleted*1000) }}
            </h5>
        </div>
        <div class="d-flex justify-content-between pl-5 ml-4" v-if="villageBuildingUpgrades.length > 0">
            <h5 style="min-width: 200px;"><img @click="cancelBuildingUpgrade(villageBuildingUpgrades)" style="width: 1.0rem;height: 0.9rem;cursor: pointer;" src="/images/del.gif">
                {{ buildingInfoLookup[villageBuildingUpgrades[0].buildingType]['name'] }}
                (Level {{ (villageBuildingUpgrades[0].buildingLevel+1) }})</h5>
            <h5 class="text-center" v-if="villageBuildingUpgradesTimeLeft[0] > -1">
                in <span id="upgradeCD2">{{ $root.secondsToTimeRemaining(villageBuildingUpgradesTimeLeft[0]*1000) }}</span>
            </h5>
            <h5 class="text-right" v-if="villageBuildingUpgrades[0].timeCompleted > 0">
                done at {{ $root.secondsToTimeCompleted(villageBuildingUpgrades[0].timeCompleted*1000) }}
            </h5>
        </div>
    </div>
</template>

<script>
import { fetchMixins } from '../../../mixins/fetchMixins'

export default {
    data() {
        return {
            villageResFieldUpgrades: this.$store.getters.getVillageResFieldUpgrades,
            villageResFieldUpgradesTimeLeft: [],
            villageBuildingUpgrades: this.$store.getters.getVillageBuildingUpgrades,
            villageBuildingUpgradesTimeLeft: [],
            buildingInfoLookup: this.$parent.buildingInfoLookup,
            resourceInfoLookup: this.$parent.resourceInfoLookup,
        };
    },

    mixins: [fetchMixins],

    created() {
        this.fetchVillageResFieldUpgrades();
        this.fetchVillageBuildingUpgrades();
        this.fetchVillageMaxResources();
        this.startResFieldUpgradeInterval();
        this.startBuildingUpgradeInterval();
    },
    watch: {
        'villageBuildingUpgrades': function() {
            this.villageBuildingUpgrades = this.$store.getters.getVillageBuildingUpgrades;
            if(this.villageBuildingUpgrades.length < 1) return;
            this.villageBuildingUpgradesTimeLeft[0] = (this.villageBuildingUpgrades[0].timeCompleted - Math.floor(new Date().getTime()/1000));
        },
        'villageResFieldUpgrades': function() {
            this.villageResFieldUpgrades = this.$store.getters.getVillageResFieldUpgrades;
            if(this.villageResFieldUpgrades.length < 1) return;
            this.villageResFieldUpgradesTimeLeft[0] = (this.villageResFieldUpgrades[0].timeCompleted - Math.floor(new Date().getTime()/1000));
        },
    },
    methods: {
        startResFieldUpgradeInterval(){
            var upgradeCD1Interval = setInterval( ()=> {
                if(this.villageResFieldUpgradesTimeLeft[0] > 0){
                    this.$set(this.villageResFieldUpgradesTimeLeft, 0, this.villageResFieldUpgradesTimeLeft[0]-1);
                }
                else if(this.villageResFieldUpgradesTimeLeft[0] <= 0 ){
                    clearInterval(upgradeCD1Interval);
                    this.fetchVillageResFieldUpgrades();
                    this.fetchVillageBuildingUpgrades();
                    this.fetchVillageProduction();
                    this.fetchvillageResourceFields();
                }
            }, 1000);
        },
        startBuildingUpgradeInterval(){
            var upgradeCD2Interval = setInterval( ()=> {
                if(this.villageBuildingUpgradesTimeLeft[0] > 0){
                    this.$set(this.villageBuildingUpgradesTimeLeft, 0, this.villageBuildingUpgradesTimeLeft[0]-1);
                }
                else if(this.villageBuildingUpgradesTimeLeft[0] <= 0 ){
                    clearInterval(upgradeCD2Interval);
                    this.fetchVillageResFieldUpgrades();
                    this.fetchVillageBuildingUpgrades();
                    this.fetchVillageProduction();
                    this.fetchVillageMaxResources();
                    this.fetchvillageBuildingFields();
                }
            }, 1000);
        },

/*
        async cancelBuildingUpgrade(villageBuildingUpgrades){
            let currentUnixTime =  Math.round(new Date().getTime()/1000);

            let villageResourcesApiUrl = 'http://localhost:8080/api/villageResources/1';
            let villageResources = await(await(await fetch(villageResourcesApiUrl)).json()).data;

            /*let cancelBuildingUpgradeResponse = await fetch('http://localhost:8080/api/villageBuildingUpgrades/' + villageBuildingUpgrades[0]._id, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            let cancelBuildingUpgradeResponse = await this.$root.doApiRequest("villageBuildingUpgrades/" + villageBuildingUpgrades[0]._id, "DELETE", "");
            let cancelBuildingUpgradeJson = await cancelBuildingUpgradeResponse.json();
            if(cancelBuildingUpgradeJson.status == "success"){
                villageResources.currentWood += villageBuildingUpgrades[0].woodUsed;
                villageResources.currentClay += villageBuildingUpgrades[0].clayUsed;
                villageResources.currentIron += villageBuildingUpgrades[0].ironUsed;
                villageResources.currentCrop += villageBuildingUpgrades[0].cropUsed;
                villageResources.lastUpdate = currentUnixTime;

                let updateVillageResourcesResponse = await this.$root.doApiRequest("villageResources/1", "PATCH", villageResources) //hardcoded
                let updateVillageResourcesJson = await updateVillageResourcesResponse.json();
                console.log(updateVillageResourcesJson);
                // DOESN'T WORK, TODO
            }
        },
        cancelResFieldUpgrade(){
            /*let villageResources = getVillageResources();
            let currentUnixTime =  Math.round(new Date().getTime()/1000);

            villageResources.currentWood -= villageResFieldUpgrades[0].woodUsed;
            villageResources.currentClay -= villageResFieldUpgrades[0].clayUsed;
            villageResources.currentIron -= villageResFieldUpgrades[0].ironUsed;
            villageResources.currentCrop -= villageResFieldUpgrades[0].cropUsed;
            villageResources.lastUpdate = currentUnixTime;
        },*/
    }
    
}
</script>