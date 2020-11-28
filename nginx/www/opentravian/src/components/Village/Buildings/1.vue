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
                <tr v-for="(troop, index) in troopList" :key="index">
                    <th scope="row" class="align-middle text-left" style="min-width:650px">
                        <img :src="'/images/troops/' + userTribe + '/' + troop['id'] + '.gif'"> {{ troop['name'] }} (Available: {{Math.floor(villageOwnTroops[index])}})
                        <span class="troopRequirements float-right">
                            <img src="/images/resources/wood.gif">    {{ troop['wood'] }} |
                            <img src="/images/resources/clay.gif">    {{ troop['clay'] }} |
                            <img src="/images/resources/iron.gif">    {{ troop['iron'] }} |
                            <img src="/images/resources/crop.gif">    {{ troop['crop'] }} |
                            <img src="/images/consum.gif">  {{ troop['consumption'] }} |
                            <img src="/images/clock.gif">   {{ $root.secondsToTimeRemaining(troop['time'] * 1000) }}
                        </span>
                    </th>
                    <td class="align-middle">
                        <div class="input-group input-group-sm mb-3 align-middle">
                            <input type="text" class="form-control trainTroop" :data-troopId="troop['id']" aria-label="Small" aria-describedby="inputGroup-sizing-sm" :id="'troop' + troop['id']">
                        </div>
                    </td>
                    <td class="align-middle">
                        <a @click="insertTroops(troop['id']);" href="#" style="color:green" v-if="troopInfoLookup && villageResources"><strong>(<span :id="'maxTroops' + troop['id']">{{ calculateMaxTroops(troop) }}</span>)</strong></a>
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
        
        <h5 class="mt-5"> <p>Current training time: {{ buildingInfoLookup[$parent.villageBuildingType]['buildingModifier'][$parent.villageBuildingLevel-1]*100 }} percent</p></h5>
        <h5> <p>Training time at level {{ $parent.villageBuildingLevel+1 }}: {{ buildingInfoLookup[$parent.villageBuildingType]['buildingModifier'][$parent.villageBuildingLevel]*100 }} percent</p></h5>
        <h4> <p>Cost for upgrading to Level {{ $parent.villageBuildingLevel+1 }}:</p></h4>
        <h5> <p>
            <img src="/images/resources/wood.gif">      {{ buildingInfoLookup[$parent.villageBuildingType]['wood'][$parent.villageBuildingLevel] }} |
            <img src="/images/resources/clay.gif">      {{ buildingInfoLookup[$parent.villageBuildingType]['clay'][$parent.villageBuildingLevel] }} |
            <img src="/images/resources/iron.gif">      {{ buildingInfoLookup[$parent.villageBuildingType]['iron'][$parent.villageBuildingLevel] }} |
            <img src="/images/resources/crop.gif">      {{ buildingInfoLookup[$parent.villageBuildingType]['crop'][$parent.villageBuildingLevel] }} |
            <img src="/images/consum.gif">              {{ buildingInfoLookup[$parent.villageBuildingType]['consumption'][$parent.villageBuildingLevel] }} |
            <img src="/images/clock.gif">               {{ $root.secondsToTimeRemaining(buildingInfoLookup[$parent.villageBuildingType]['constructionTime'][$parent.villageBuildingLevel] * 1000) }}</p>
        </h5>
        <h5 class="mt-4"> 
            <button type="button" class="btn btn-success" @click="upgradeBuilding()">Upgrade to Level {{ $parent.villageBuildingLevel+1 }}</button> 
        </h5>
         <h5 class="mt-4 text-danger" id="errorMessage"></h5>
    </div>
</template>


<script>

export default {
    data() {
        return {
            troopInfoLookup: this.$parent.troopInfoLookup,
            buildingInfoLookup: this.$parent.buildingInfoLookup,
            villageResources: this.$parent.villageResources,
            villageOwnTroops: undefined,
            villageBarracksProductions: undefined,
            villageBarracksProductionsTimeLeft: [],
            troopList: [],
            userTribe: "Teuton",
            vbid: this.$route.params.vbid,
        };
    },

    created() {
        this.fetchVillageOwnTroops();
        this.$parent.fetchVillageResources();
        this.startCountdownInterval();
        this.getTroopList();
    },

    methods: {
        fetchVillageOwnTroops(){
            this.villageOwnTroops = this.$store.getters.getVillageOwnTroops;

            this.$store.dispatch('fetchVillageOwnTroops')
            .then( () => {
                this.villageOwnTroops = this.$store.getters.getVillageOwnTroops;
                this.fetchVillageBarracksProduction();
            });
        },
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
                //this.startCountdownInterval();
            });
        },
        insertTroops(id){        
            console.log(document.getElementById("maxTroops"+id).innerHTML);
            document.getElementById("troop"+id).value = document.getElementById("maxTroops"+id).innerHTML;
        },
        getTroopList(){
            Object.keys(this.troopInfoLookup).forEach((tribe) => {
                if(tribe == this.userTribe){
                    Object.keys(this.troopInfoLookup[tribe]).forEach( (troop) =>{
                        if(this.troopInfoLookup[tribe][troop]['buildingId'] == this.$parent.villageBuildingType){
                            this.troopList.push(this.troopInfoLookup[tribe][troop]);
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

            let barracksProductionsResponse = await this.$root.doApiRequest("barracksProductions","POST",troopData);
            let barracksProductionsResponseJson = await barracksProductionsResponse.json();

            if(barracksProductionsResponseJson.message == "New barracksProductions created"){
                this.fetchVillageOwnTroops();
                this.$parent.fetchVillageResources();
            }
            else{
                document.getElementById("errorMessage").innerText = barracksProductionsResponseJson.message;
            }
        },
        async upgradeBuilding(){
            let buildingData = {
                "idVillage": 1,
                "vbid": Number(this.vbid),
            }
            let buildingUpgradeResponse = await this.$root.doApiRequest("buildingUpgrades", "POST", buildingData)

            let buildingUpgradeResponseJson = await buildingUpgradeResponse.json();

            console.log("debug 2" + buildingUpgradeResponseJson);

            if(buildingUpgradeResponseJson.message == "New buildingUpgrade created"){
                this.$router.push({ name: 'villageBuilding' });
            }
            else{
                document.getElementById("errorMessage").innerText = buildingUpgradeResponseJson.message;
            }
        },
        calculateMaxTroops(troop){
            return Math.floor(Math.min(this.villageResources[0]/troop["wood"],this.villageResources[1]/troop["clay"],this.villageResources[2]/troop["iron"],this.villageResources[3]/troop["crop"]))
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