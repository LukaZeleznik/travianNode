<template>
    <div>
        <!-- RESEARCH TABLE -->
        <table class="table table-bordered m-auto" v-if="$parent.villageBuildingLevel > 0">
            <thead>
                <tr>
                <th scope="col">Troop</th>
                <th scope="col" style="max-width:100px">Quantity</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(troop, index) in availableResearches" :key="index">
                    <th scope="row" class="align-middle text-center">
                        <img :src="'/images/troops/' + userTribe + '/' + troop['id'] + '.gif'"> {{ troop['name'] }}
                        <span class="troopRequirements d-block">
                            <img src="/images/resources/wood.gif">  {{ troop['wood'] }} |
                            <img src="/images/resources/clay.gif">  {{ troop['clay'] }} |
                            <img src="/images/resources/iron.gif">  {{ troop['iron'] }} |
                            <img src="/images/resources/crop.gif">  {{ troop['crop'] }} |
                            <img src="/images/clock.gif">           {{ secondsToTimeRemaining(troop['time'] * 1000 / config.SERVER_SPEED) }}
                        </span>
                    </th>
                    <td class="align-middle">
                        <span v-if="researches.length > 0">Another research is already in progress</span>
                        <button v-else-if="hasRequiredResearchResources(troop['id'])" type="button" class="btn btn-success" @click="research(troop['id'])">Research</button> 
                        <span v-else>Not enough resources</span>
                    </td>
                </tr>
            </tbody>
        </table>
        <h5 class="mt-4 text-danger" id="errorMessage"></h5> 

        <!-- RESEARCH QUEUE -->
        <table class="table table-bordered m-auto" v-if="researches && researches.length > 0">
            <thead >
                <tr>
                    <th scope="col">Research</th>
                    <th scope="col" style="max-width:150px">Time left</th>
                    <th scope="col">Finished</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <th scope="row" class="align-middle">
                        <img :src="'/images/troops/' + userTribe + '/' + (researches[0].troopId) + '.gif'"> {{researches[0].troopName}}<br />
                    </th>
                    <td class="align-middle">
                        <span class="trainCD">
                            {{ secondsToTimeRemaining(researchesTimeLeft[0]*1000) }}
                        </span>
                    </td>
                    <td class="align-middle">
                        {{ secondsToTimeCompleted(researches[0].timeCompleted*1000) }}
                    </td>
                </tr>
            </tbody>
        </table>

        <!-- BUILDING UPGRADE -->
        <div class="mt-3" v-if="$parent.villageBuildingLevel < (buildingInfoLookup[$parent.villageBuildingType]['wood'].length-1)">
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
            researchesTimeLeft: [],
            availableResearches: [],
        };
    },

    mixins: [
        fetchMixins,
        hasMixins,
        upgradeMixins,
        toolsMixins
        ],

    watch: {
        'researches': function() {
            this.researches = this.$store.getters.getResearches;
            if(this.researches.length < 1) return;
            this.researchesTimeLeft[0] = (this.researches[0].timeCompleted - Math.floor(new Date().getTime()/1000));
        },
        'researchesCompleted': function() { this.getAvailableResearches(); },
    },
    
    created() {
        this.fetchResearchesCompleted();
        this.fetchResearches();
        this.startResearchInterval();
    },

    methods: {
        async getAvailableResearches(){
            for(let troop of this.researchesInfoLookup[this.userTribe]){
                if (this.researchesCompleted['troop' + troop['id']] == false){
                    this.availableResearches.push(troop);
                }
            }
        },
        async research(troopId){
            const researchData = {
                "idVillage": this.activeVillageId,
                "troopId": troopId,
                "researchType": "troopResearch"
            }
            const researchesResponse = await(await this.doApiRequest("researches", "POST", researchData, true)).json();

            if(researchesResponse.message == "researches success"){
                this.fetchVillageResources();
                this.fetchResearches();
            }
            else{
                document.getElementById("errorMessage").innerText = researchesResponse.message;
            }
        },
        startResearchInterval(){
            var researchInterval = setInterval( ()=> {
                if(this.researchesTimeLeft[0] > 0){
                    this.$set(this.researchesTimeLeft, 0, this.researchesTimeLeft[0]-1);
                }
                else if(this.researchesTimeLeft[0] <= 0 ){
                    clearInterval(researchInterval);
                    this.fetchResearchesCompleted();
                    this.fetchResearches();
                    this.fetchVillageResources();
                }
            }, 1000);
        },
    }
}
</script>