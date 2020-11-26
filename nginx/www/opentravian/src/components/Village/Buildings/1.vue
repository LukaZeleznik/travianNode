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
                <tr>
                    <th scope="row" class="align-middle" style="min-width:650px" v-if="troopInfoLookup">
                        <img style="width: 1.2rem;height: 1rem;" src="/images/maceman.gif">{{ troopInfoLookup["Teuton"][0]["name"] }} (Available: {{Math.floor(villageOwnTroops[0])}})
                        <span class="troopRequirements">
                            <img style="width: 1.2rem;height: 1rem;" src="/images/wood.gif">    {{ troopInfoLookup["Teuton"][0]["wood"] }} |
                            <img style="width: 1.2rem;height: 1rem;" src="/images/clay.gif">    {{ troopInfoLookup["Teuton"][0]["clay"] }} |
                            <img style="width: 1.2rem;height: 1rem;" src="/images/iron.gif">    {{ troopInfoLookup["Teuton"][0]["iron"] }} |
                            <img style="width: 1.2rem;height: 1rem;" src="/images/crop.gif">    {{ troopInfoLookup["Teuton"][0]["crop"] }} |
                            <img style="width: 1.2rem;height: 1rem;" src="/images/consum.gif">  {{ troopInfoLookup["Teuton"][0]["consumption"] }} |
                            <img style="width: 1.2rem;height: 1rem;" src="/images/clock.gif">   {{ new Date (troopInfoLookup["Teuton"][0]["time"] * 1000).toISOString().substr(11, 8) }}
                        </span>
                    </th>
                    <td class="align-middle">
                        <div class="input-group input-group-sm mb-3 align-middle">
                            <input type="text" class="form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm" id="unit1">
                        </div>
                    </td>
                    <td class="align-middle">
                        <a @click="insertTroops(1);" href="#" style="color:green" v-if="troopInfoLookup && villageResources"><strong>(<span id="maxTroops1">{{Math.floor(Math.min(villageResources[0]/troopInfoLookup["Teuton"][0]["wood"],villageResources[1]/troopInfoLookup["Teuton"][0]["clay"],villageResources[2]/troopInfoLookup["Teuton"][0]["iron"],villageResources[3]/troopInfoLookup["Teuton"][0]["crop"]))}}</span>)</strong></a>
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
                        <img style="width: 1.2rem;height: 1rem;" src="/img/maceman.gif">{{
                            Math.ceil(villageBarracksProduction.troopCount - villageBarracksProduction.troopsDoneAlready)
                            }} {{villageBarracksProduction.troopName}}
                        <br />
                    </th>
                    <td class="align-middle">
                        <span class="trainCD">{{ new Date(villageBarracksProductionsTimeLeft[index]*1000).toISOString().substr(11, 8) }}</span>
                    </td>
                    <td class="align-middle">
                        {{new Date(villageBarracksProduction.timeCompleted*1000).toLocaleTimeString('sl-SI')}}
                    </td>
                </tr>
            </tbody>
        </table>
        
        <h5 class="mt-5"> <p>Current training time: {{ buildingInfoLookup[villageBuildingDataProp['type']]['buildingModifier'][villageBuildingDataProp['level']-1]*100 }} percent</p></h5>
        <h5> <p>Training time at level {{ villageBuildingDataProp['level']+1 }}: {{ buildingInfoLookup[villageBuildingDataProp['type']]['buildingModifier'][villageBuildingDataProp['level']]*100 }} percent</p></h5>
        <h4> <p>Cost for upgrading to Level {{ villageBuildingDataProp['level']+1 }}:</p></h4>
        <h5> <p>
            <img style="width: 1.5rem;height: 1rem;" src="/images/wood.gif">    {{ buildingInfoLookup[villageBuildingDataProp['type']]['wood'][villageBuildingDataProp['level']] }} |
            <img style="width: 1.5rem;height: 1rem;" src="/images/clay.gif">    {{ buildingInfoLookup[villageBuildingDataProp['type']]['clay'][villageBuildingDataProp['level']] }} |
            <img style="width: 1.5rem;height: 1rem;" src="/images/iron.gif">    {{ buildingInfoLookup[villageBuildingDataProp['type']]['iron'][villageBuildingDataProp['level']] }} |
            <img style="width: 1.5rem;height: 1rem;" src="/images/crop.gif">    {{ buildingInfoLookup[villageBuildingDataProp['type']]['crop'][villageBuildingDataProp['level']] }} |
            <img style="width: 1.5rem;height: 1rem;" src="/images/consum.gif">  {{ buildingInfoLookup[villageBuildingDataProp['type']]['consumption'][villageBuildingDataProp['level']] }} |
            <img style="width: 1.5rem;height: 1rem;" src="/images/clock.gif">   {{ new Date(buildingInfoLookup[villageBuildingDataProp['type']]['constructionTime'][villageBuildingDataProp['level']] * 1000).toISOString().substr(11, 8) }}</p>
        </h5>
        <h6> <a>Upgrade to Level {{ villageBuildingDataProp['level']+1 }}</a> </h6>
    </div>
</template>


<script>

export default {
    props: {
        villageBuildingDataProp: Object
    },

    data() {
        return {
            troopInfoLookup: undefined,
            buildingInfoLookup: undefined,
            villageResources : undefined,
            villageOwnTroops: undefined,
            villageBarracksProductions : undefined,
            villageBarracksProductionsTimeLeft : [],
        };
    },

    created() {
        this.importRequiredLookups();
        this.fetchVillageResources();
        this.fetchVillageOwnTroops();
        this.startCountdownInterval();
    },

    methods: {
        importRequiredLookups(){
            this.buildingInfoLookup = require('../../../../public/infoTables/buildingInfoLookup.json');
            this.troopInfoLookup = require('../../../../public/infoTables/troopInfoLookup.json');
        },
        fetchVillageResources(){
            this.villageResources = this.$store.getters.getVillageResources;

            this.$store.dispatch('fetchVillageResources')
            .then( () => {
                this.villageResources = this.$store.getters.getVillageResources;
            });
        },
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
            document.getElementById("unit"+id).value =  document.getElementById("maxTroops"+id).innerHTML;
        },
        async train(){
            let troop1num = document.getElementById("unit1").value;

            let troopData = {
                "idVillage": 1,
                "troopId": 1,
                "troopCount": troop1num
            }

            let barracksProductionsResponse = await fetch('http://localhost:8080/api/barracksProductions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(troopData),
            });

            let barracksProductionsResponseJson = await barracksProductionsResponse.json();

            console.log(barracksProductionsResponseJson);

            if(barracksProductionsResponseJson.message == "New barracksProductions created"){
                this.fetchVillageOwnTroops();
                this.fetchVillageResources();
            }
            else{
                document.getElementById("errorMessage").innerText = barracksProductionsResponseJson.message;
            }
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