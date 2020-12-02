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
                    <th scope="row" class="align-middle text-left" style="min-width:650px">
                        <img :src="'/images/troops/' + userTribe + '/' + troop['id'] + '.gif'"> {{ troop['name'] }} (Available: {{Math.floor(villageOwnTroops[troop['id']-1])}})
                        <span class="troopRequirements float-right">
                            <img src="/images/resources/wood.gif">  {{ troop['wood'] }} |
                            <img src="/images/resources/clay.gif">  {{ troop['clay'] }} |
                            <img src="/images/resources/iron.gif">  {{ troop['iron'] }} |
                            <img src="/images/resources/crop.gif">  {{ troop['crop'] }} |
                            <img src="/images/consum.gif">          {{ troop['consumption'] }} |
                            <img src="/images/clock.gif">           {{ $root.secondsToTimeRemaining(calculateTroopTrainingTime(troop['time'])) }}
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
        <table class="table table-bordered w-75 m-auto" v-if="villageBarracksProductions && villageBarracksProductions.length > 0">
            <thead >
                <tr>
                    <th scope="col">Training</th>
                    <th scope="col" style="max-width:150px">Time left</th>
                    <th scope="col">Finished</th>
                </tr>
            </thead>
            <tbody>
                <tr  v-for="(villageBarracksProduction, index) in villageBarracksProductions" :key="index">
                    <th scope="row" class="align-middle">
                        <img :src="'/images/troops/' + userTribe + '/' + (villageBarracksProduction.troopId) + '.gif'">{{
                            Math.ceil(villageBarracksProduction.troopCount - villageBarracksProduction.troopsDoneAlready)
                            }} {{villageBarracksProduction.troopName}}
                        <br />
                    </th>
                    <td class="align-middle">
                        <span class="trainCD">{{ $root.secondsToTimeRemaining(villageBarracksProductionsTimeLeft[index]*1000) }}</span>
                    </td>
                    <td class="align-middle">
                        {{ $root.secondsToTimeCompleted(villageBarracksProduction.timeCompleted*1000) }}
                    </td>
                </tr>
            </tbody>
        </table>
        
        <h5 class="mt-5"> <p>Current training time: {{ (buildingInfoLookup[$parent.villageBuildingType]['buildingModifier'][$parent.villageBuildingLevel]*100).toFixed(2) }} percent</p></h5>
        <div v-if="$parent.villageBuildingLevel < 20">
            <h5><p>Training time at level {{ $parent.villageBuildingLevel+1 }}: {{ (buildingInfoLookup[$parent.villageBuildingType]['buildingModifier'][$parent.villageBuildingLevel+1]*100).toFixed(2) }} percent</p></h5>
            <h4> <p>Cost for upgrading to Level {{ $parent.villageBuildingLevel+1 }}:</p></h4>
            <h5> <p>
                <img src="/images/resources/wood.gif">      {{ buildingInfoLookup[$parent.villageBuildingType]['wood'][$parent.villageBuildingLevel+1] }} |
                <img src="/images/resources/clay.gif">      {{ buildingInfoLookup[$parent.villageBuildingType]['clay'][$parent.villageBuildingLevel+1] }} |
                <img src="/images/resources/iron.gif">      {{ buildingInfoLookup[$parent.villageBuildingType]['iron'][$parent.villageBuildingLevel+1] }} |
                <img src="/images/resources/crop.gif">      {{ buildingInfoLookup[$parent.villageBuildingType]['crop'][$parent.villageBuildingLevel+1] }} |
                <img src="/images/consum.gif">              {{ buildingInfoLookup[$parent.villageBuildingType]['consumption'][$parent.villageBuildingLevel+1] }} |
                <img src="/images/clock.gif">               {{ $root.secondsToTimeRemaining(buildingInfoLookup[$parent.villageBuildingType]['constructionTime'][$parent.villageBuildingLevel+1] * 1000) }}</p>
            </h5>
            <h5 class="mt-4"> 
                <button v-if="hasRequiredBuildingResources()" type="button" class="btn btn-success" @click="upgradeBuilding()">Upgrade to Level {{ $parent.villageBuildingLevel+1 }}</button> 
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
import { fetchMixins } from '../../../mixins/fetchMixins'
import { hasMixins } from '../../../mixins/hasMixins'
import { apiRequestMixins } from '../../../mixins/apiRequestMixins'


export default {
    data() {
        return {
            troopInfoLookup: this.$parent.troopInfoLookup,
            buildingInfoLookup: this.$parent.buildingInfoLookup,
            villageResources: this.$store.getters.getVillageResources,
            villageOwnTroops: this.$store.getters.getVillageOwnTroops,
            villageBarracksProductions: undefined,
            villageBarracksProductionsTimeLeft: [],
            researchedTroops: [],
            userTribe: "Teuton",
        };
    },

    mixins: [fetchMixins,hasMixins,apiRequestMixins],
    
    watch: {
        '$store.getters.getVillageResources': function() {
            this.villageResources = this.$store.getters.getVillageResources;
        },
        '$store.getters.getVillageOwnTroops': function() {
            this.villageOwnTroops = this.$store.getters.getVillageOwnTroops;
        },
    },

    created() {
        //fetchMixins
        this.fetchVillageOwnTroops();
        this.fetchVillageResources();


        this.fetchVillageBarracksProduction();
        this.startCountdownInterval();
        this.getResearchedTroops();
        
    },

    methods: {
        fetchVillageBarracksProduction(){
            this.villageBarracksProductions = this.$store.getters.getVillageBarracksProduction;
            this.villageBarracksProductionsTimeLeft = [];
            for(let i = 0; i < this.villageBarracksProductions.length; i++){
                this.villageBarracksProductionsTimeLeft[i] = this.villageBarracksProductions[i].timeCompleted - Math.floor(new Date().getTime()/1000);
            }

            this.$store.dispatch('fetchVillageBarracksProduction')
            .then( () => {
                this.villageBarracksProductions = this.$store.getters.getVillageBarracksProduction;
                this.villageBarracksProductionsTimeLeft = [];
                for(let i = 0; i < this.villageBarracksProductions.length; i++){
                    this.villageBarracksProductionsTimeLeft[i] = this.villageBarracksProductions[i].timeCompleted - Math.floor(new Date().getTime()/1000);
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

            let barracksProductionsResponse = await this.doApiRequest("barracksProductions","POST",troopData);
            let barracksProductionsResponseJson = await barracksProductionsResponse.json();

            if(barracksProductionsResponseJson.message == "barracksProductions success"){
                this.fetchVillageOwnTroops();
                this.fetchVillageResources();
            }
            else{
                document.getElementById("errorMessage").innerText = barracksProductionsResponseJson.message;
            }
        },
        async upgradeBuilding(){
            let buildingData = {
                "idVillage": 1,
                "vbid": this.$route.params.vbid,
            }

            let buildingUpgradeResponse = await this.doApiRequest("villageBuildingUpgrades", "POST", buildingData);
            let buildingUpgradeResponseJson = await buildingUpgradeResponse.json();

            if(buildingUpgradeResponseJson.message == "villageBuildingUpgrade success"){
                this.$router.push({ name: 'village' });
            }
            else{
                document.getElementById("errorMessage").innerText = buildingUpgradeResponseJson.message;
            }
        },
        calculateMaxTroops(troop){
            return Math.floor(Math.min(this.villageResources[0]/troop["wood"],this.villageResources[1]/troop["clay"],this.villageResources[2]/troop["iron"],this.villageResources[3]/troop["crop"]))
        },
        calculateTroopTrainingTime(curTrainTime){
            return (curTrainTime * 1000) * this.buildingInfoLookup[this.$parent.villageBuildingType]['buildingModifier'][this.$parent.villageBuildingLevel];
        },
        startCountdownInterval(){
            setInterval( ()=> {
                for(let i = 0; i < this.villageBarracksProductionsTimeLeft.length; i++){
                    this.$set(this.villageBarracksProductionsTimeLeft, i, this.villageBarracksProductionsTimeLeft[i] - 1);
                    if(this.villageBarracksProductionsTimeLeft[i] < 0){
                        this.fetchVillageOwnTroops();
                    }
                }
            }, 1000);
        }
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