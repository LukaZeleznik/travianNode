<template>
    <div>
        <table class="table table-bordered w-75 m-auto">
            <thead>
                <tr>
                <th scope="col">Name</th>
                <th scope="col" style="max-width:150px">Quantity</th>
                <th scope="col">Max</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(troop, index) in researchedTroops" :key="index">
                    <th scope="row" class="align-middle text-left" style="min-width:700px">
                        <img :src="'/images/troops/' + userTribe + '/' + troop['id'] + '.gif'"> {{ troop['name'] }} (Available: {{Math.floor(villageOwnTroops[troop['id']-1])}})
                        <span class="troopRequirements float-right">
                            <img src="/images/resources/wood.gif">  {{ troop['wood'] }} |
                            <img src="/images/resources/clay.gif">  {{ troop['clay'] }} |
                            <img src="/images/resources/iron.gif">  {{ troop['iron'] }} |
                            <img src="/images/resources/crop.gif">  {{ troop['crop'] }} |
                            <img src="/images/consum.gif">          {{ troop['consumption'] }} |
                            <img src="/images/clock.gif">           {{ secondsToTimeRemaining(calculateTroopTrainingTime(troop['time'])) }}
                        </span>
                    </th>
                    <td class="align-middle">
                        <div class="input-group input-group-sm mb-3 align-middle">
                            <input type="text" class="form-control trainTroop" :data-troopId="troop['id']" aria-label="Small" aria-describedby="inputGroup-sizing-sm" :id="'troop' + troop['id']">
                        </div>
                    </td>
                    <td class="align-middle">
                        <a @click="insertTroops(troop['id']);" href="#" style="color:green" v-if="villageResources"><strong>(<span :id="'maxTroops' + troop['id']">{{ calculateMaxTroops(troop) }}</span>)</strong></a>
                    </td>
                </tr>

            </tbody>
        </table>
        <div class="btn-group my-4 w-75" role="group" aria-label="Train">
            <button type="button" class="btn btn-success w-75 m-auto mt-3" @click="train();">Train</button>
        </div>
        <h5 class="mt-4 text-danger" id="errorMessage"></h5>                
        <table class="table table-bordered w-75 m-auto" v-if="villageStableProductions && villageStableProductions.length > 0">
            <thead >
                <tr>
                    <th scope="col">Training</th>
                    <th scope="col" style="max-width:150px">Time left</th>
                    <th scope="col">Finished</th>
                </tr>
            </thead>
            <tbody>
                <tr  v-for="(villageStableProduction, index) in villageStableProductions" :key="index">
                    <th scope="row" class="align-middle">
                        <img :src="'/images/troops/' + userTribe + '/' + (villageStableProduction.troopId) + '.gif'">{{
                            Math.ceil(villageStableProduction.troopCount - villageStableProduction.troopsDoneAlready)
                            }} {{villageStableProduction.troopName}}
                        <br />
                    </th>
                    <td class="align-middle">
                        <span class="trainCD">{{ secondsToTimeRemaining(villageStableProductionsTimeLeft[index]*1000) }}</span>
                    </td>
                    <td class="align-middle">
                        {{ secondsToTimeCompleted(villageStableProduction.timeCompleted*1000) }}
                    </td>
                </tr>
            </tbody>
        </table>
        
        <h5 class="mt-5"> <p>Current training time: {{ (buildingInfoLookup[$parent.villageBuildingType]['buildingModifier'][$parent.villageBuildingLevel]*100).toFixed(2) }} percent</p></h5>
        <div v-if="$parent.villageBuildingLevel < (buildingInfoLookup[$parent.villageBuildingType]['wood'].length-1)">
            <h5><p>Training time at level {{ $parent.villageBuildingLevel+1 }}: {{ (buildingInfoLookup[$parent.villageBuildingType]['buildingModifier'][$parent.villageBuildingLevel+1]*100).toFixed(2) }} percent</p></h5>
            <h4> <p>Cost for upgrading to Level {{ $parent.villageBuildingLevel+1 }}:</p></h4>
            <h5> <p>
                <img src="/images/resources/wood.gif">      {{ buildingInfoLookup[$parent.villageBuildingType]['wood'][$parent.villageBuildingLevel+1] }} |
                <img src="/images/resources/clay.gif">      {{ buildingInfoLookup[$parent.villageBuildingType]['clay'][$parent.villageBuildingLevel+1] }} |
                <img src="/images/resources/iron.gif">      {{ buildingInfoLookup[$parent.villageBuildingType]['iron'][$parent.villageBuildingLevel+1] }} |
                <img src="/images/resources/crop.gif">      {{ buildingInfoLookup[$parent.villageBuildingType]['crop'][$parent.villageBuildingLevel+1] }} |
                <img src="/images/consum.gif">              {{ buildingInfoLookup[$parent.villageBuildingType]['consumption'][$parent.villageBuildingLevel+1] }} |
                <img src="/images/clock.gif">               {{ secondsToTimeRemaining(buildingInfoLookup[$parent.villageBuildingType]['constructionTime'][$parent.villageBuildingLevel+1] * 1000) }}</p>
            </h5>
            <h5 class="mt-4"> 
                <span v-if="villageBuildingUpgrades.length > 0">Another building is already being upgraded</span>
                <button v-else-if="hasRequiredBuildingResources()" type="button" class="btn btn-success" @click="upgradeBuilding($route.params.vbid)">Upgrade to Level {{ $parent.villageBuildingLevel+1 }}</button> 
                <span v-else>Not enough resources</span>
            </h5>
        </div>
        <div v-else>
            <h5 class="mt-4">Already at maximum level</h5>
        </div>
         <h5 class="mt-4 text-danger" id="errorMessage"></h5>
    </div>
</template>


<script>
import { fetchMixins } from '@/mixins/fetchMixins'
import { hasMixins } from '@/mixins/hasMixins'
import { apiRequestMixins } from '@/mixins/apiRequestMixins'
import { upgradeMixins } from '@/mixins/upgradeMixins'
import { toolsMixins } from '@/mixins/toolsMixins'

export default {
    data() {
        return {
            villageStableProductions: undefined,
            villageStableProductionsTimeLeft: [],
            researchedTroops: [],
            userTribe: "teuton",
        };
    },

    mixins: [
        fetchMixins,
        hasMixins,
        apiRequestMixins,
        upgradeMixins,
        toolsMixins
        ],
    
    watch: {
    },

    created() {
        this.fetchVillageOwnTroops();
        this.getResearchedTroops();
        this.startCountdownInterval();
    },

    methods: {
        fetchVillageStableProduction(){
            this.villageStableProductions = this.$store.getters.getVillageStableProduction;
            this.villageStableProductionsTimeLeft = [];
            for(let i = 0; i < this.villageStableProductions.length; i++){
                this.villageStableProductionsTimeLeft[i] = this.villageStableProductions[i].timeCompleted - Math.floor(new Date().getTime()/1000);
            }

            this.$store.dispatch('fetchVillageStableProduction')
            .then( () => {
                this.villageStableProductions = this.$store.getters.getVillageStableProduction;
                this.villageStableProductionsTimeLeft = [];
                for(let i = 0; i < this.villageStableProductions.length; i++){
                    this.villageStableProductionsTimeLeft[i] = this.villageStableProductions[i].timeCompleted - Math.floor(new Date().getTime()/1000);
                }
            });
        },
        insertTroops(id){        
            console.log(document.getElementById("maxTroops"+id).innerHTML);
            document.getElementById("troop"+id).value = document.getElementById("maxTroops"+id).innerHTML;
        },
        getResearchedTroops(){
            Object.keys(this.troopInfoLookup).forEach((tribe) => {
                if(tribe == this.userTribe){
                    Object.keys(this.troopInfoLookup[tribe]).forEach( (troop) =>{
                        if(this.troopInfoLookup[tribe][troop]['buildingId'] == this.$parent.villageBuildingType){
                            this.researchedTroops.push(this.troopInfoLookup[tribe][troop]);
                        }
                    });
                }
            });
        },
        async train(){
            let elementList = document.querySelectorAll(".trainTroop");
            let troopNum;
            let troopId;

            for(let element of elementList){
                troopId = element.getAttribute("data-troopId");
                troopNum = element.value;
                element.value = '';
                if(troopNum>0) break;
            }

            let troopData = {
                "idVillage": 1,
                "troopId": troopId,
                "troopCount": troopNum
            }

            let stableProductionsResponse = await this.doApiRequest("stableProductions","POST",troopData,true);
            let stableProductionsResponseJson = await stableProductionsResponse.json();

            if(stableProductionsResponseJson.message == "stableProductions success"){
                this.fetchVillageOwnTroops();
                this.fetchVillageResources();
            }
            else{
                document.getElementById("errorMessage").innerText = stableProductionsResponseJson.message;
            }
        },
        calculateMaxTroops(troop){
            return Math.floor(Math.min(this.villageResources[0]/troop["wood"],this.villageResources[1]/troop["clay"],this.villageResources[2]/troop["iron"],this.villageResources[3]/troop["crop"]))
        },
        calculateTroopTrainingTime(curTrainTime){
            return (curTrainTime * 1000) * this.buildingInfoLookup[this.$parent.villageBuildingType]['buildingModifier'][this.$parent.villageBuildingLevel]
        },
        startCountdownInterval(){
            setInterval( ()=> {
                for(let i = 0; i < this.villageStableProductionsTimeLeft.length; i++){
                    this.$set(this.villageStableProductionsTimeLeft, i, this.villageStableProductionsTimeLeft[i] - 1);
                    if(this.villageStableProductionsTimeLeft[i] < 0){
                        this.fetchVillageOwnTroops();
                    }
                }
            }, 1000);
        },
    }
}
</script>

<style scoped>
@media (max-width: 600px) {
    .troopRequirements{
        display: none;
    }
}
</style>