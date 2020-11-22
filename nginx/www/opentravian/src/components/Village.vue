<template>
  <div>
    <div class="container">
      <div class="d-flex justify-content-center" id="villageResources">
        <ul class="list-group list-group-horizontal flex-row">
          <li class="list-group-item">
              <img style="width: 1.2rem;height: 0.9rem;" src="/images/wood.gif">
              <span id="currentWood">{{ Math.floor(villageResources[0]) }}</span>/<span id="maxWood">{{ villageMaxResources[0] }}</span>
          </li>
          <li class="list-group-item">
              <img style="width: 1.2rem;height: 0.9rem;" src="/images/clay.gif">
              <span id="currentClay">{{ Math.floor(villageResources[1]) }}</span>/<span id="maxClay">{{ villageMaxResources[1] }}</span>
          </li>
          <li class="list-group-item">
              <img style="width: 1.2rem;height: 0.9rem;" src="/images/iron.gif">
              <span id="currentIron">{{ Math.floor(villageResources[2]) }}</span>/<span id="maxIron">{{ villageMaxResources[2] }}</span>
          </li>
          <li class="list-group-item">
              <img style="width: 1.2rem;height: 0.9rem;" src="/images/crop.gif">
              <span id="currentCrop">{{ Math.floor(villageResources[3]) }}</span>/<span id="maxCrop">{{ villageMaxResources[3] }}</span>
          </li>
        </ul>
      </div>
    </div>

    <!-- Main Body -->
    <div class="container mt-4">
      <div class="row">
          <!-- Resource Fields -->
          <div class="col-md-8 col-sm-12 col-12">
              <div class="h2 text-center mb-4"><strong>VillageName</strong></div>

              <div class="grid">
                  <ul id="hexGrid" style="padding-left: 0px;">
                      <li class="hex" v-for="(villageBuildingColor, index) in villageBuildingColors" :key="index">
                          <div class="hexIn" v-if="index == 0 || index == 4 || index == 18">
                          </div>

                          <div class="hexIn" v-else-if="index == 11">
                            <router-link class="hexLink" :to="{ name: 'resources' }">
                              <div class='img' v-bind:style="'background-color:'+villageBuildingColor">
                                  <p style="top:35%;opacity:1;color:black">{{villageBuildingTypes[index]}}</p>
                              </div>
                              <h1 id="demo1"></h1>
                              <p id="demo2"></p>
                            </router-link>
                          </div>

                          <div class="hexIn" v-else-if="index == 7">
                            <router-link class="hexLink"  :to="{ path: '/villageBuilding/' + index }">
                              <div class='img' v-bind:style="'background-color:'+villageBuildingColor">
                                  <p style="top:35%;opacity:1;color:black">{{villageBuildingTypes[index]}}</p>
                              </div>
                              <h1 id="demo1"></h1>
                              <p id="demo2"></p>
                            </router-link>
                          </div>
                          
                          <div class="hexIn" v-else>
                              <router-link class="hexLink" :to="{ path: '/village' }">
                                <div class='img' v-bind:style="'background-color:'+villageBuildingColor">
                                    <p style="top:35%;opacity:1;color:black">{{villageBuildingLevels[index]}}</p>
                                </div>
                                <h1 id="demo1"></h1>
                                <p id="demo2"></p>
                              </router-link>
                          </div>
                      </li>
                  </ul>                
              </div>          
                  
              <div class="h3 pl-5 ml-4 my-3" v-if="villageResFieldUpgrades.length > 0">Buildings:</div>
              <div class="d-flex justify-content-between pl-5 ml-4 upgrageResFieldData" v-if="villageResFieldUpgrades.length > 0">
                <h5><img style="width: 1.0rem;height: 0.9rem;" src="/images/del.gif"> 
                  {{ villageResFieldUpgrades[0].fieldType }} 
                  (Level {{ villageResFieldUpgrades[0].fieldLevel }})</h5>
                <h5 class="text-center">in <span id="upgradeCD1">{{ villageResFieldUpgradesTimeLeft[0] }}</span> seconds</h5>
                <h5 class="text-right">done at {{ new Date(villageResFieldUpgrades[0].timeCompleted*1000).toLocaleTimeString('sl-SI')}} </h5>
              </div>
              <div class="d-flex justify-content-between pl-5 ml-4 upgrageResFieldData" v-if="villageResFieldUpgrades.length == 2">
                <h5><img style="width: 1.0rem;height: 0.9rem;" src="/images/del.gif"> 
                  {{ villageResFieldUpgrades[1].fieldType }} 
                  (Level {{ villageResFieldUpgrades[1].fieldLevel }})</h5>
                <!--<h5>in <span id="upgradeCD1">{{ new Date(villageResFieldUpgrades[1].timeCompleted*1000 - Math.floor(new Date().getTime())).toLocaleTimeString() }}</span> hours</h5>-->
                <h5>done at {{ new Date(villageResFieldUpgrades[1].timeCompleted*1000).toLocaleTimeString('sl-SI') }} </h5>
            </div>
          </div>

          <!-- Troop Movements and other stuff on the right -->
          <div class="col-md-4 text-center mb-3 rightSide">

            <div class="h3">Troop Movements:</div>
            <div  v-if="villageIncomingAttacks.length > 0 || villageOutgoingAttacks.length > 0 || 
                      villageIncomingReinforcements.length > 0 || villageOutgoingReinforcements.length > 0">
            <div class="d-flex justify-content-between" v-if="villageIncomingAttacks.length > 0">
              <h5 style="color:Red"><img style="width: 1.2rem;" src="/images/att_inc.gif"><strong> {{villageIncomingAttacks.length}} Attacks</strong></h5>
              <h5>in <span id="incAtt">{{villageIncomingAttacksTimeLeft[0]}}</span> seconds</h5>
            </div>
            <div class="d-flex justify-content-between" v-if="villageOutgoingAttacks.length > 0">
              <h5 style="color:Orange"><img style="width: 1.2rem;" src="/images/att_out.gif"><strong> {{villageOutgoingAttacks.length}} Attacks</strong></h5>
              <h5>in <span id="outAtt">{{villageOutgoingAttacksTimeLeft[0]}}</span> seconds</h5>
            </div>
            <div class="d-flex justify-content-between" v-if="villageIncomingReinforcements.length > 0">
              <h5 style="color:Orange"><img style="width: 1.2rem;" src="/images/reinf_inc.gif"><strong> {{villageIncomingReinforcements.length}} Reinf.</strong></h5>
              <h5>in <span id="incReinf">{{villageIncomingReinforcementsTimeLeft[0]}}</span> seconds</h5>
            </div>
            <div class="d-flex justify-content-between" v-if="villageOutgoingReinforcements.length > 0">
              <h5 style="color:Green"><img style="width: 1.2rem;" src="/images/reinf_out.gif"><strong> {{villageOutgoingReinforcements.length}} Reinf.</strong></h5>
              <h5>in <span id="outReinf">{{villageOutgoingReinforcementsTimeLeft[0]}}</span> seconds</h5>
            </div>
          </div>
          <div class="h5" v-else>
            <div class="text-center">
              <h5>None</h5>
            </div>
          </div>

              <div class="h3 mt-3">Production:</div>
            <div class="d-flex justify-content-between">
                <h5><img style="width: 1.5rem;height: 1rem;" src="/images/wood.gif"> Wood:</h5>
                <h5><strong>{{villageProduction[0]}}</strong> per hour</h5>
            </div>
            <div class="d-flex justify-content-between">
                <h5><img style="width: 1.5rem;height: 1rem;" src="/images/clay.gif"> Clay:</h5>
                <h5><strong>{{villageProduction[1]}}</strong> per hour</h5>
            </div>
            <div class="d-flex justify-content-between">
                <h5><img style="width: 1.5rem;height: 1rem;" src="/images/iron.gif"> Iron:</h5>
                <h5><strong>{{villageProduction[2]}}</strong> per hour</h5>
            </div>
            <div class="d-flex justify-content-between">
                <h5><img style="width: 1.5rem;height: 1rem;" src="/images/crop.gif"> Crop:</h5>
                <h5><strong>{{villageProduction[3]}}</strong> per hour</h5>
            </div>

            <div class="h3 mt-3">Troops:</div>
            <div class="h5" v-if="villageOwnTroops.length > 0">
              <div class="d-flex justify-content-center" v-for="(villageOwnTroop, index) in villageOwnTroops" :key="index">
                  <h5 v-if="villageOwnTroop"><img src="/images/maceman.gif">  {{villageOwnTroop}} clubswinger </h5>
                  <!-- TODO needs troopInfoLookup -->
              </div>
            </div>
            <div class="h5" v-else>
              <div class="text-center">
              <h5>None</h5>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  data() {
    return {
      villageResources : [],
      villageMaxResources : [0,0,0,0],
      villageBuildingLevels : [],
      villageBuildingTypes : [],
      villageBuildingColors : ["","SlateGray","SlateGray","SlateGray","","SlateGray","SlateGray","SaddleBrown","SlateGray","SlateGray","SlateGray","Green","SlateGray","SlateGray","SlateGray","SlateGray","SlateGray","SlateGray","","SlateGray","SlateGray","SlateGray"],
      villageProduction : [0,0,0,0],
      villageResFieldUpgrades : [],
      villageResFieldUpgradesTimeLeft : [],
      villageOwnTroops : [],
      villageReinforcements : [],
      villageIncomingAttacks : [],
      villageIncomingReinforcements : [],
      villageOutgoingAttacks : [],
      villageOutgoingReinforcements : [],
      villageIncomingAttacksTimeLeft : [],
      villageIncomingReinforcementsTimeLeft : [],
      villageOutgoingAttacksTimeLeft : [],
      villageOutgoingReinforcementsTimeLeft : [],
    };
  },

  created() {
    this.fetchVillageResources();
    this.fetchVillageMaxResources();
    this.fetchVillageProduction();
    this.fetchVillageTroopMovements();
    this.fetchVillageOwnTroops();
    this.fetchVillageReinforcements();
    this.fetchVillageResFieldUpgrades();
    this.startUpgradeInterval();
    this.startTroopMovementsInterval();
    this.villageBuildingTypes[11] = "Resources";
    this.villageBuildingTypes[7] = "Barracks";
  },

  methods: {
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
    fetchVillageResFieldLevels(){
      this.villageResFieldLevels = this.$store.getters.getVillageResFieldLevels;

      this.$store.dispatch('fetchVillageResFieldLevels')
      .then( () => {
        this.villageResFieldLevels = this.$store.getters.getVillageResFieldLevels;
      });
    },
    fetchVillageProduction(){
      this.villageProduction = this.$store.getters.getVillageProduction;

      this.$store.dispatch('fetchVillageProduction')
      .then( () => {
        this.villageProduction = this.$store.getters.getVillageProduction;
      })
      .then( () => {
        this.startIntervals();
      });
    },
    fetchVillageResFieldUpgrades(){
      console.log("fetching village resfieldupgrades");
      this.villageResFieldUpgrades = this.$store.getters.getVillageResFieldUpgrades;

      this.$store.dispatch('fetchVillageResFieldUpgrades')
      .then( () => {
        this.villageResFieldUpgrades = this.$store.getters.getVillageResFieldUpgrades;
        if(this.villageResFieldUpgrades.length < 1) return;
        this.villageResFieldUpgradesTimeLeft[0] = (this.villageResFieldUpgrades[0].timeCompleted - Math.floor(new Date().getTime()/1000));
      });
    },
    fetchVillageOwnTroops(){
      this.villageOwnTroops = this.$store.getters.getVillageOwnTroops;

      this.$store.dispatch('fetchVillageOwnTroops')
      .then( () => {
        this.villageOwnTroops = this.$store.getters.getVillageOwnTroops;
      });
    },
    fetchVillageReinforcements(){
      this.villageReinforcements = this.$store.getters.getVillageReinforcements;

      this.$store.dispatch('fetchVillageReinforcements')
      .then( () => {
        this.villageReinforcements = this.$store.getters.getVillageReinforcements;
      });
    },
    fetchVillageTroopMovements(){
      this.villageOutgoingAttacks = this.$store.getters.getVillageOutgoingAttacks;
      this.villageOutgoingReinforcements = this.$store.getters.getVillageOutgoingReinforcements;
      this.villageIncomingAttacks = this.$store.getters.getVillageIncomingAttacks;
      this.villageIncomingReinforcements = this.$store.getters.getVillageIncomingReinforcements;

      this.$store.dispatch('fetchVillageTroopMovements')
      .then( () => {
        this.villageOutgoingAttacks = this.$store.getters.getVillageOutgoingAttacks;
        this.villageOutgoingReinforcements = this.$store.getters.getVillageOutgoingReinforcements;
        this.villageIncomingAttacks = this.$store.getters.getVillageIncomingAttacks;
        this.villageIncomingReinforcements = this.$store.getters.getVillageIncomingReinforcements;

        if(this.villageIncomingAttacks.length > 0){this.villageIncomingAttacksTimeLeft[0] = (this.villageIncomingAttacks[0].timeArrived - Math.floor(new Date().getTime()/1000));}
        if(this.villageIncomingReinforcements.length > 0){this.villageIncomingReinforcementsTimeLeft[0] = (this.villageIncomingReinforcements[0].timeArrived - Math.floor(new Date().getTime()/1000));}
        if(this.villageOutgoingAttacks.length > 0){this.villageOutgoingAttacksTimeLeft[0] = (this.villageOutgoingAttacks[0].timeArrived - Math.floor(new Date().getTime()/1000));}
        if(this.villageOutgoingReinforcements.length > 0){this.villageOutgoingReinforcementsTimeLeft[0] = (this.villageOutgoingReinforcements[0].timeArrived - Math.floor(new Date().getTime()/1000));}
      });
    },
    startIntervals(){
      var woodInterval = setInterval( ()=> {
        if(parseInt(this.villageResources[0]) < this.villageMaxResources[0]){
          this.$set(this.villageResources, 0, this.villageResources[0]+1);
        }
        else if(this.villageResources[0] == this.villageMaxResources[0]){
          clearInterval(woodInterval);
        }
      }, 1000*3600 / this.villageProduction[0]);

      var clayInterval = setInterval( ()=> {
        if(parseInt(this.villageResources[1]) < this.villageMaxResources[1]){
          this.$set(this.villageResources, 1, this.villageResources[1]+1);
        }
        else if(this.villageResources[1] == this.villageMaxResources[1]){
          clearInterval(clayInterval);
        }
      }, 1000*3600 / this.villageProduction[1]);

      var ironInterval = setInterval( ()=> {
        if(parseInt(this.villageResources[2]) < this.villageMaxResources[2]){
          this.$set(this.villageResources, 2, this.villageResources[2]+1);
        }
        else if(this.villageResources[2] == this.villageMaxResources[2]){
          clearInterval(ironInterval);
        }
      }, 1000*3600 / this.villageProduction[2]);
        
      var cropInterval = setInterval( ()=> {
        if(parseInt(this.villageResources[3]) < this.villageMaxResources[3]){
          this.$set(this.villageResources, 3, this.villageResources[3]+1);
        }
        else if(this.villageResources[3] == this.villageMaxResources[3]){
          clearInterval(cropInterval);
        }
      }, 1000*3600 / this.villageProduction[3]);
    },
    startUpgradeInterval(){
      var upgradeCD1Interval = setInterval( ()=> {
        //if(!this.villageResFieldUpgradesTimeLeft) return;
        if(this.villageResFieldUpgradesTimeLeft[0] > 0){
          this.$set(this.villageResFieldUpgradesTimeLeft, 0, this.villageResFieldUpgradesTimeLeft[0]-1);
        }
        else if(this.villageResFieldUpgradesTimeLeft[0] == 0 ){
          this.fetchVillageResFieldUpgrades();
          this.fetchVillageResFieldLevels();
          this.fetchVillageResources();
          this.fetchVillageProduction();
          clearInterval(upgradeCD1Interval);
        }
      }, 1000);
    },
    startTroopMovementsInterval(){
      setInterval( ()=> {
        //if(!this.villageResFieldUpgradesTimeLeft) return;
        if(this.villageIncomingAttacksTimeLeft[0] > 0){
          this.$set(this.villageIncomingAttacksTimeLeft, 0, this.villageIncomingAttacksTimeLeft[0]-1);
        }
        if(this.villageIncomingReinforcementsTimeLeft[0] > 0){
          this.$set(this.villageIncomingReinforcementsTimeLeft, 0, this.villageIncomingReinforcementsTimeLeft[0]-1);
        }
        if(this.villageOutgoingAttacksTimeLeft[0] > 0){
          this.$set(this.villageOutgoingAttacksTimeLeft, 0, this.villageOutgoingAttacksTimeLeft[0]-1);
        }
        if(this.villageOutgoingReinforcementsTimeLeft[0] > 0){
          this.$set(this.villageOutgoingReinforcementsTimeLeft, 0, this.villageOutgoingReinforcementsTimeLeft[0]-1);
        }
        
        if(this.villageIncomingAttacksTimeLeft[0] == 0 || this.villageIncomingReinforcementsTimeLeft[0] == 0 || this.villageOutgoingAttacksTimeLeft[0] == 0 || this.villageOutgoingReinforcementsTimeLeft[0] == 0){
          this.fetchVillageOwnTroops();
          this.fetchVillageTroopMovements();
        }
      }, 1000);
    }
  }
}
</script>
