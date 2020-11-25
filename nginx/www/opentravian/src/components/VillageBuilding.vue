<template>
    <div>
        <div class="container" v-if="buildingInfoLookup">
            <div class="justify-content-center text-center">
                <h1 class="my-4">{{buildingInfoLookup[1]["name"]}} Level 1</h1>
                <h6 class="my-4">All foot soldier are trained in the barracks. The higher the level of the barracks, the faster the troops are trained.</h6>
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
                            <th scope="row" class="align-middle" v-if="troopInfoLookup">
                                <img style="width: 1.2rem;height: 1rem;" src="/images/maceman.gif">{{troopInfoLookup["Teuton"][0]["name"]}} (Available: {{Math.floor(villageOwnTroops[0])}})
                                <span class="troopRequirements">
                                    <img style="width: 1.2rem;height: 1rem;" src="/images/wood.gif"> {{troopInfoLookup["Teuton"][0]["wood"]}} |
                                    <img style="width: 1.2rem;height: 1rem;" src="/images/clay.gif"> {{troopInfoLookup["Teuton"][0]["clay"]}} |
                                    <img style="width: 1.2rem;height: 1rem;" src="/images/iron.gif"> {{troopInfoLookup["Teuton"][0]["iron"]}} |
                                    <img style="width: 1.2rem;height: 1rem;" src="/images/crop.gif"> {{troopInfoLookup["Teuton"][0]["crop"]}} |
                                    <img style="width: 1.2rem;height: 1rem;" src="/images/consum.gif"> {{troopInfoLookup["Teuton"][0]["consumption"]}} |
                                    <img style="width: 1.2rem;height: 1rem;" src="/images/clock.gif"> {{troopInfoLookup["Teuton"][0]["time"]}}
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
                                <span class="trainCD">{{ villageBarracksProductionsTimeLeft[index] }}</span>s
                            </td>
                            <td class="align-middle">
                                {{new Date(villageBarracksProduction.timeCompleted*1000).toLocaleTimeString('sl-SI')}}
                            </td>
                        </tr>
                    </tbody>
                </table>
                
                <h5 class="mt-5"> <p>Current training time:        100 percent</p></h5>
                <h5> <p>Training time at level 2:        96 percent</p></h5>
                <h4> <p>Cost for upgrading to Level 2:</p></h4>
                <h5> <p>
                    <img style="width: 1.5rem;height: 1rem;" src="/images/wood.gif"> 40 |
                    <img style="width: 1.5rem;height: 1rem;" src="/images/clay.gif"> 100 |
                    <img style="width: 1.5rem;height: 1rem;" src="/images/iron.gif"> 50 |
                    <img style="width: 1.5rem;height: 1rem;" src="/images/crop.gif"> 60 |
                    <img style="width: 1.5rem;height: 1rem;" src="/images/consum.gif"> 2 |
                    <img style="width: 1.5rem;height: 1rem;" src="/images/clock.gif"> 0:00:03</p>
                </h5>
                <h6> <a>Upgrade to Level 2</a> </h6>
            </div>
        </div>
    </div>
</template>


<script>

export default {
  data() {
    return {
      troopInfoLookup: undefined,
      buildingInfoLookup: undefined,
      villageResources : undefined,
      maxResources : undefined,
      villageOwnTroops: undefined,
      villageBarracksProductions : undefined,
      villageBarracksProductionsTimeLeft : [],
      maxTroopsToTrain : undefined,
      villageBuildingLevel : 0,
      villageBuildingType : undefined,
    };
  },

  created() {
    this.fetchVillageResources();
    this.fetchVillageMaxResources();
    this.fetchVillageOwnTroops();
    //this.fetchResFieldTypes();
    //this.fetchResFieldLevels();
    //this.fetchVillageBarracksProduction();
    //this.calculateMaxTroopsToTrain();
    this.fetchTroopInfoLookup();
    this.fetchBuildingInfoLookup();
    this.startCountdownInterval();
    this.fetchVillageBuildingTypes();
    this.fetchVillageBuildingLevels();
  },

  methods: {
    fetchBuildingInfoLookup(){
        fetch('/infoTables/buildingInfoLookup.json')
        .then(res => res.json())
        .then(res => {
            this.buildingInfoLookup = res;
        })        
        .catch(err => console.log(err));
    },
    fetchTroopInfoLookup(){
        fetch('/infoTables/troopInfoLookup.json')
        .then(res => res.json())
        .then(res => {
            this.troopInfoLookup = res;
        })        
        .catch(err => console.log(err));
    },
    fetchVillageResources(){
        this.villageResources = this.$store.getters.getVillageResources;

        this.$store.dispatch('fetchVillageResources')
        .then( () => {
            this.villageResources = this.$store.getters.getVillageResources;
        });
    },
    fetchVillageMaxResources(){
        this.villageMaxResources = this.$store.getters.getVillageMaxResources;

        this.$store.dispatch('fetchVillageMaxResources')
        .then( () => {
            this.villageMaxResources = this.$store.getters.getVillageMaxResources;
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
    fetchVillageBuildingTypes(){
        fetch('http://localhost:8080/api/villageBuildingTypes/1')
        .then(res => res.json())
        .then(res => { //TODO
            let rfid = this.$route.params.rfid;
            
            if (rfid > 4) rfid--;
            if (rfid > 10) rfid--;
            if (rfid > 16) rfid--;

            console.log(rfid);

            let key = "resField"+rfid+"Type";
            this.resFieldType = res.data[key];

            if(this.resFieldType == "wood"){
                this.resFieldTypeLong = "Woodcutter";
            }
            else if(this.resFieldType == "clay"){
                this.resFieldTypeLong = "Claypit";
            }
            else if(this.resFieldType == "iron"){
                this.resFieldTypeLong = "Ironmine";
            }
            else if(this.resFieldType == "crop"){
                this.resFieldTypeLong = "Cropland";
            }
        })
        .catch(err => console.log(err));
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
        console.log("KLICANO");
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