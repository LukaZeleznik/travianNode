<template>
    <div>
        <table class="table table-bordered m-auto" v-if="$parent.villageBuildingLevel > 0">
            <thead>
                <tr>
                <th scope="col">Name</th>
                <th scope="col" style="max-width:150px">Quantity</th>
                <th scope="col">Max</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(troop, index) in researchedTroops" :key="index">
                    <th scope="row" class="align-middle text-center">
                        <img :src="'/images/troops/' + userTribe + '/' + troop['id'] + '.gif'"> {{ troop['name'] }} (Available: {{Math.floor(villageOwnTroops[troop['id']-1])}})
                        <span class="troopRequirements d-block">
                            <img src="/images/resources/wood.gif">  {{ troop['wood'] }} |
                            <img src="/images/resources/clay.gif">  {{ troop['clay'] }} |
                            <img src="/images/resources/iron.gif">  {{ troop['iron'] }} |
                            <img src="/images/resources/crop.gif">  {{ troop['crop'] }} |
                            <img src="/images/consum.gif">          {{ troop['consumption'] }} |
                            <img src="/images/clock.gif">           {{ secondsToTimeRemaining(calculateTroopTrainingTime(troop['time'])) }}
                        </span>
                    </th>
                    <td class="align-middle">
                        <div class="input-group input-group-sm align-middle">
                            <input type="text" class="form-control trainTroop" :data-troopId="troop['id']" aria-label="Small" aria-describedby="inputGroup-sizing-sm" :id="'troop' + troop['id']">
                        </div>
                    </td>
                    <td class="align-middle">
                        <a @click="insertTroops(troop['id']);" href="#" style="color:green" v-if="villageResources"><strong>(<span :id="'maxTroops' + troop['id']">{{ calculateMaxTroops(troop) > troop['availableQty'] ? troop['availableQty'] : calculateMaxTroops(troop) }}</span>)</strong></a>
                    </td>
                </tr>

            </tbody>
        </table>
        <div class="btn-group my-4 w-100" role="group" aria-label="Train" v-if="$parent.villageBuildingLevel > 0">
            <button type="button" class="btn btn-success m-auto mt-3" @click="train();">Train</button>
        </div>
        <h5 class="mt-4 text-danger" id="errorMessage"></h5>                
        <table class="table table-bordered m-auto" v-if="villagePalaceProductions && villagePalaceProductions.length > 0">
            <thead >
                <tr>
                    <th scope="col">Training</th>
                    <th scope="col" style="max-width:150px">Time left</th>
                    <th scope="col">Finished</th>
                </tr>
            </thead>
            <tbody>
                <tr  v-for="(villagePalaceProduction, index) in villagePalaceProductions" :key="index">
                    <th scope="row" class="align-middle">
                        <img :src="'/images/troops/' + userTribe + '/' + (villagePalaceProduction.troopId) + '.gif'">{{
                            Math.ceil(villagePalaceProduction.troopCount - villagePalaceProduction.troopsDoneAlready)
                            }} {{villagePalaceProduction.troopName}}
                        <br />
                    </th>
                    <td class="align-middle">
                        <span class="trainCD">{{ secondsToTimeRemaining(villagePalaceProductionsTimeLeft[index]*1000) }}</span>
                    </td>
                    <td class="align-middle">
                        {{ secondsToTimeCompleted(villagePalaceProduction.timeCompleted*1000) }}
                    </td>
                </tr>
            </tbody>
        </table>
        
        <div v-if="$parent.villageBuildingLevel < (buildingInfoLookup[$parent.villageBuildingType]['wood'].length-1)">
            <h4> <p>Cost for upgrading to Level {{ $parent.villageBuildingLevel+1 }}:</p></h4>
            <h5> <p>
                <img src="/images/resources/wood.gif">      {{ buildingInfoLookup[$parent.villageBuildingType]['wood'][$parent.villageBuildingLevel+1] }} |
                <img src="/images/resources/clay.gif">      {{ buildingInfoLookup[$parent.villageBuildingType]['clay'][$parent.villageBuildingLevel+1] }} |
                <img src="/images/resources/iron.gif">      {{ buildingInfoLookup[$parent.villageBuildingType]['iron'][$parent.villageBuildingLevel+1] }} |
                <img src="/images/resources/crop.gif">      {{ buildingInfoLookup[$parent.villageBuildingType]['crop'][$parent.villageBuildingLevel+1] }} |
                <img src="/images/consum.gif">              {{ buildingInfoLookup[$parent.villageBuildingType]['consumption'][$parent.villageBuildingLevel+1] }} |
                <img src="/images/clock.gif">               {{ secondsToTimeRemaining(buildingInfoLookup[$parent.villageBuildingType]['constructionTime'][$parent.villageBuildingLevel+1] / config.SERVER_SPEED * 1000) }}</p>
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
import { upgradeMixins } from '@/mixins/upgradeMixins'
import { toolsMixins } from '@/mixins/toolsMixins'

export default {
    data() {
        return {
            villagePalaceProductions: undefined,
            villagePalaceProductionsTimeLeft: [],
            researchedTroops: [],
            troop9avail: 0,
            troop10avail: 0,
            userTribe: 0,
        };
    },

    mixins: [
        fetchMixins,
        hasMixins,
        upgradeMixins,
        toolsMixins
        ],
    
    watch: {
    },

    created() {
        this.fetchVillageOwnTroops();
        this.getResearchedTroops();
        this.startCountdownInterval();
        this.fetchVillagePalaceProduction();
    },

    methods: {
        fetchVillagePalaceProduction(){
            this.villagePalaceProductions = this.$store.getters.getVillagePalaceProduction;
            this.villagePalaceProductionsTimeLeft = [];
            for(let i = 0; i < this.villagePalaceProductions.length; i++){
                this.villagePalaceProductionsTimeLeft[i] = this.villagePalaceProductions[i].timeCompleted - Math.floor(new Date().getTime()/1000);
            }

            this.$store.dispatch('fetchVillagePalaceProduction')
            .then( () => {
                this.villagePalaceProductions = this.$store.getters.getVillagePalaceProduction;
                this.villagePalaceProductionsTimeLeft = [];
                for(let i = 0; i < this.villagePalaceProductions.length; i++){
                    this.villagePalaceProductionsTimeLeft[i] = this.villagePalaceProductions[i].timeCompleted - Math.floor(new Date().getTime()/1000);
                }
            });
        },
        insertTroops(id){        
            console.log(document.getElementById("maxTroops"+id).innerHTML);
            document.getElementById("troop"+id).value = document.getElementById("maxTroops"+id).innerHTML;
        },
        async getResearchedTroops(){
            this.researchedTroops = [];
            const troopInfoLookup = this.troopInfoLookup;
            const villageBuildingType = this.$parent.villageBuildingType;
            const troopsAvailable = await this.checkTroopRequirement();
            let researchedTroops = this.researchedTroops;

            this.userTribe = await this.getTribeFromIdVillage(this.activeVillageId);

            Object.keys(troopInfoLookup).forEach((tribe) => {
                console.log(tribe,this.userTribe);
                if(tribe == this.userTribe){
                    Object.keys(troopInfoLookup[tribe]).forEach(async function(troop){
                        if(troopInfoLookup[tribe][troop]['buildingId'] == villageBuildingType){
                            if(troopInfoLookup[tribe][troop]['id'] == 9 && troopsAvailable[0] >= 1){
                                researchedTroops.push(troopInfoLookup[tribe][troop]);
                            } else if(troopInfoLookup[tribe][troop]['id'] == 10 && troopsAvailable[1] >= 1){
                                researchedTroops.push(troopInfoLookup[tribe][troop]);
                            }
                        }
                    });
                }
            });
            for(const [index, troop] of researchedTroops.entries()) {
                if(troop['id'] == 9) researchedTroops[index]['availableQty'] = troopsAvailable[0];
                if(troop['id'] == 10) researchedTroops[index]['availableQty'] = troopsAvailable[1];
            }
            this.researchedTroops = researchedTroops;
            console.log( this.researchedTroops );

        },
        async checkTroopRequirement(){
            let allowed = 0;
            if(this.$parent.villageBuildingLevel >= 10){
                allowed++;
                const level = this.$parent.villageBuildingLevel-10;
                allowed += Math.floor(level/5);
                console.log(allowed);
            }
            const existingTroops = await this.getExistingTroops();

            allowed -= existingTroops[0];
            let troop9avail = allowed;
            let troop10avail = (allowed - existingTroops[1]) * 3;
            
            return [troop9avail,troop10avail];
        },
        async getExistingTroops(){
            let troop9 = 0;
            let troop10 = 0;

            const villageOwnTroops = await(await(await this.doApiRequest("villageOwnTroops/" + this.activeVillageId,"GET", "", false)).json()).data
            troop9 += villageOwnTroops['troop9'];
            troop10 += villageOwnTroops['troop10'];

            const palaceProductions = await(await(await this.doApiRequest("palaceProductions/" + this.activeVillageId,"GET", "", false)).json()).data
            palaceProductions.forEach(production =>{
                if(production['troopId'] == 9) troop9 += production['troopCount'];
                if(production['troopId'] == 10) troop10 += production['troopCount'];
            });

            const sendTroops = await(await(await this.doApiRequest("sendTroops/" + this.activeVillageId,"GET", "", false)).json()).data
            // To be tested and check if it maybe picks up incomming attacks with such units
            sendTroops.forEach(troopMovement =>{
                troop9 += troopMovement['troop9num'];
                troop10 += troopMovement['troop10num'];
            });

            //TODO
            //const villageReinforcements = await(await(await this.doApiRequest("villageReinforcements/" + this.activeVillageId,"GET", "", false)).json()).data

            return [troop9, troop10];
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
                "idVillage": this.activeVillageId,
                "troopId": troopId,
                "troopCount": troopNum
            }

            let palaceProductionsResponse = await(await this.doApiRequest("palaceProductions","POST",troopData,true)).json();
            if(palaceProductionsResponse.message == "palaceProductions success"){
                this.fetchVillageOwnTroops();
                this.fetchVillageResources();
                this.fetchVillagePalaceProduction();
                this.getResearchedTroops();
            }
            else{
                document.getElementById("errorMessage").innerText = palaceProductionsResponse.message;
            }
        },
        calculateMaxTroops(troop){
            return Math.floor(Math.min(this.villageResources[0]/troop["wood"],this.villageResources[1]/troop["clay"],this.villageResources[2]/troop["iron"],this.villageResources[3]/troop["crop"]))
        },
        calculateTroopTrainingTime(curTrainTime){
            return ((curTrainTime * 1000) * this.buildingInfoLookup[this.$parent.villageBuildingType]['buildingModifier'][this.$parent.villageBuildingLevel]) / this.config.SERVER_SPEED;
        },
        startCountdownInterval(){
            setInterval( ()=> {
                for(let i = 0; i < this.villagePalaceProductionsTimeLeft.length; i++){
                    this.$set(this.villagePalaceProductionsTimeLeft, i, this.villagePalaceProductionsTimeLeft[i] - 1);
                    if(this.villagePalaceProductionsTimeLeft[i] < 0){
                        this.fetchVillageOwnTroops();
                        this.fetchVillagePalaceProduction();
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