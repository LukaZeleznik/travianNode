<template>
  <div>
    <div class="container">
        <div class="justify-content-center text-center">
            <h1 class="my-4" v-if="resFieldTypeLong">{{ resFieldTypeLong + " Level " + resFieldLevel }}</h1>
            <h6 class="my-4" v-if="resourceInfoLookup && resFieldTypeLong">{{resourceInfoLookup[resFieldTypeLong].description}}</h6>
            <h5>
                <div v-if="resourceInfoLookup && resFieldTypeLong">Current production:        {{resourceInfoLookup[resFieldTypeLong].production[resFieldLevel]}} per hour</div>
            </h5>
            <h5 class="mb-3">
                <div v-if="resourceInfoLookup && resFieldTypeLong">Production at Level {{ resFieldLevel+1 }}:        {{resourceInfoLookup[resFieldTypeLong].production[resFieldLevel+1]}} per hour</div>
            </h5>
            <h4> 
                <div class="mb-2">Cost for upgrading to Level {{ resFieldLevel+1 }}:</div>
            </h4>
            <h5 class="mb-3"> 
                <div v-if="resFieldTypeLong && resourceInfoLookup && resFieldLevel">
                    <img style="width: 1.5rem;height: 1rem;" src="/images/resources/wood.gif"> {{resourceInfoLookup[resFieldTypeLong].wood[resFieldLevel]}} |
                    <img style="width: 1.5rem;height: 1rem;" src="/images/resources/clay.gif"> {{resourceInfoLookup[resFieldTypeLong].clay[resFieldLevel]}} |
                    <img style="width: 1.5rem;height: 1rem;" src="/images/resources/iron.gif"> {{resourceInfoLookup[resFieldTypeLong].iron[resFieldLevel]}} |
                    <img style="width: 1.5rem;height: 1rem;" src="/images/resources/crop.gif"> {{resourceInfoLookup[resFieldTypeLong].crop[resFieldLevel]}} |
                    <img style="width: 1.5rem;height: 1rem;" src="/images/consum.gif"> {{resourceInfoLookup[resFieldTypeLong].consumption[resFieldLevel]}} |
                    <img style="width: 1.5rem;height: 1rem;" src="/images/clock.gif"> {{resourceInfoLookup[resFieldTypeLong].constructionTime[resFieldLevel]}}s
                </div>
            </h5>
            <h5 class="mt-4"> 
                <button type="button" class="btn btn-success" @click="upgradeResField()">Upgrade to Level {{ resFieldLevel+1 }}</button> 
            </h5>
            <h5 class="mt-4 text-danger" id="errorMessage">

            </h5>
        </div>
    </div>
  </div>
</template>


<script>

export default {
  data() {
    return {
      resourceInfoLookup: undefined,
      resFieldLevel : 0,
      resFieldType : undefined,
      resFieldTypeLong : undefined,
      refFieldRequirements: [100,100,100,100,1,10]
    };
  },

  created() {
    this.fetchVillageResources();
    this.fetchVillageResFieldTypes();
    this.fetchVillageResFieldLevels();
    this.fetchResourceInfoLookup();
  },

  methods: {
    async upgradeResField(){
      let rfid = this.$route.params.rfid;
      if (rfid > 4) rfid--;
      if (rfid > 10) rfid--;
      if (rfid > 16) rfid--;

      let resourceFieldData = {
        "idVillage": 1,
        "rfid": rfid,
      }

      let resFieldUpgradeResponse = await fetch('http://localhost:8080/api/resFieldUpgrades', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(resourceFieldData),
      });

      let resFieldUpgradeResponseJson = await resFieldUpgradeResponse.json();

      console.log(resFieldUpgradeResponseJson);

      if(resFieldUpgradeResponseJson.message == "New resFieldUpgrade created"){
        this.$router.push({ name: 'resources' });
      }
      else{
        document.getElementById("errorMessage").innerText = resFieldUpgradeResponseJson.message;
      }
    },
    calculateResources(){
      fetch('http://localhost:8080/api/getCurrentResources/1')
      .then(res => res.json())
      .then(res => {
        console.log(res);
        //this.villageResources = [res.currentWood,res.currentClay,res.currentIron,res.currentCrop];
        this.fetchVillageResources();
      })
        .catch(err => console.log(err));
    },
    fetchResourceInfoLookup(){
        fetch('/infoTables/resourceInfoLookup.json')
        .then(res => res.json())
        .then(res => {
          this.resourceInfoLookup = res;
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
    fetchVillageResFieldLevels(){
        fetch('http://localhost:8080/api/villageFieldLevels/1')
        .then(res => res.json())
        .then(res => {
            let rfid = this.$route.params.rfid;
            if (rfid > 4) rfid--;
            if (rfid > 10) rfid--;
            if (rfid > 16) rfid--;
            let key = "resField"+rfid+"Level";
            this.resFieldLevel = res.data[key];
        })
        .catch(err => console.log(err));
    },
    fetchVillageResFieldTypes(){
        fetch('http://localhost:8080/api/villageFieldTypes/1')
        .then(res => res.json())
        .then(res => {
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
    updateFieldRequirements(){
      if(!this.resFieldTypeLong || !this.resFieldLevel || !this.resourceInfoLookup) return;

      let requirementWood = this.resourceInfoLookup[this.resFieldTypeLong]["wood"][this.resFieldLevel];
      let requirementClay = this.resourceInfoLookup[this.resFieldTypeLong]["clay"][this.resFieldLevel];
      let requirementIron = this.resourceInfoLookup[this.resFieldTypeLong]["iron"][this.resFieldLevel];
      let requirementCrop = this.resourceInfoLookup[this.resFieldTypeLong]["crop"][this.resFieldLevel];
      let requirementConsumption = this.resourceInfoLookup[this.resFieldTypeLong]["consumption"][this.resFieldLevel];
      let requirementConstructionTime = this.resourceInfoLookup[this.resFieldTypeLong]["constructionTime"][this.resFieldLevel];
      this.refFieldRequirements = [requirementWood,requirementClay,requirementIron,requirementCrop,requirementConsumption,requirementConstructionTime];
      console.log(this.refFieldRequirements);
    }
  }
}
</script>