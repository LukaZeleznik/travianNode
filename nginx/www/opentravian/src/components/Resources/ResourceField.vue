<template>
    <div>
        <div class="container">
            <div class="justify-content-center text-center" v-if="resourceInfoLookup">
                <h1 class="my-4" v-if="villageResourceType > -1">{{ resourceInfoLookup[villageResourceType]['name'] + " Level " + villageResourceLevel }}</h1>
                <h6 class="my-4" v-if="resourceInfoLookup && villageResourceType">{{ resourceInfoLookup[villageResourceType]['description'] }}</h6>
                <h5>
                    Current production: {{resourceInfoLookup[villageResourceType]['production'][villageResourceLevel]}} per hour
                </h5>
                <h5 class="mb-3">
                    Production at Level {{ villageResourceLevel+1 }}: {{resourceInfoLookup[villageResourceType]['production'][villageResourceLevel+1]}} per hour
                </h5>
                <h4> 
                    <div class="mb-2">Cost for upgrading to Level {{ villageResourceLevel+1 }}:</div>
                </h4>
                <div v-if=" (villageResourceType == WOODCUTTER || villageResourceType == IRON_MINE && villageResourceLevel < 20) || 
                            (villageResourceType == CLAY_PIT || villageResourceType == CROPLAND && villageResourceLevel < 21)">
                    <h5 class="mb-3"> 
                        <div>
                            <img style="width: 1.5rem;height: 1rem;" src="/images/resources/wood.gif">  {{ resourceInfoLookup[villageResourceType]['wood'][villageResourceLevel+1] }} |
                            <img style="width: 1.5rem;height: 1rem;" src="/images/resources/clay.gif">  {{ resourceInfoLookup[villageResourceType]['clay'][villageResourceLevel+1] }} |
                            <img style="width: 1.5rem;height: 1rem;" src="/images/resources/iron.gif">  {{ resourceInfoLookup[villageResourceType]['iron'][villageResourceLevel+1] }} |
                            <img style="width: 1.5rem;height: 1rem;" src="/images/resources/crop.gif">  {{ resourceInfoLookup[villageResourceType]['crop'][villageResourceLevel+1] }} |
                            <img style="width: 1.5rem;height: 1rem;" src="/images/consum.gif">          {{ resourceInfoLookup[villageResourceType]['consumption'][villageResourceLevel+1] }} |
                            <img style="width: 1.5rem;height: 1rem;" src="/images/clock.gif">           {{ $root.secondsToTimeRemaining(resourceInfoLookup[villageResourceType]['constructionTime'][villageResourceLevel+1] * 1000) }}
                        </div>
                    </h5>
                    <h5 class="mt-4"> 
                        <button v-if="hasRequiredResources()" type="button" class="btn btn-success" @click="upgradeResField()">Upgrade to Level {{ villageResourceLevel+1 }}</button> 
                        <span v-else>Not enough resources</span>
                    </h5>
                </div>
                <div v-else>
                    <h5 class="mt-4">Already at maximum level</h5>
                </div>
                <h5 class="mt-4 text-danger" id="errorMessage"></h5>
            </div>
        </div>
    </div>
</template>


<script>
import * as infoLookup from '../../assets/js/infoLookupTools.js';

export default {
    data() {
        return {
            resourceInfoLookup: infoLookup.resourceInfoLookup,
            villageResourceType: undefined,
            villageResourceLevel: undefined,
            villageResources: this.$store.getters.getVillageResources,
            WOODCUTTER: 0,
            CLAY_PIT: 1,
            IRON_MINE: 2,
            CROPLAND: 3,
        };
    },

    watch: {
        '$store.getters.getVillageResources': function() {
            this.villageResources = this.$store.getters.getVillageResources;
        },
    },
    
    created() {
        this.fetchResourceFieldsData();
        this.fetchVillageResources();
    },

    methods: {
        fetchVillageResources(){
            this.villageResources = this.$store.getters.getVillageResources;

            this.$store.dispatch('fetchVillageResources')
            .then( () => {
                this.villageResources = this.$store.getters.getVillageResources;
            });
        },
        fetchResourceFieldsData(){
            fetch('http://localhost:8080/api/villageResourceFields/1')
            .then(res => res.json())
            .then(res => {
                let rfid = this.$route.params.rfid;
                let keyType = "field"+rfid+"Type";
                let keyLevel = "field"+rfid+"Level";

                this.villageResourceType = res.data[keyType];
                this.villageResourceLevel = res.data[keyLevel];
            })
            .catch(err => console.log(err));
        },
        async upgradeResField(){
            let rfid = this.$route.params.rfid;

            let resourceFieldData = {
                "idVillage": 1,
                "rfid": rfid,
            }

            let villageResFieldUpgradeResponse = await this.$root.doApiRequest("villageResFieldUpgrades", "POST", resourceFieldData)
            let villageResFieldUpgradeResponseJson = await villageResFieldUpgradeResponse.json();

            if(villageResFieldUpgradeResponseJson.message == "villageResFieldUpgrade success"){      
                this.$router.push({ name: 'resources' });
            }
            else{
                document.getElementById("errorMessage").innerText = villageResFieldUpgradeResponseJson.message;
            }
        },
        hasRequiredResources(){
            console.log(this.villageResourceLevel+1,this.resourceInfoLookup[this.villageResourceType]['wood'][this.villageResourceLevel+1]);
            let woodRequired = this.resourceInfoLookup[this.villageResourceType]['wood'][this.villageResourceLevel+1];
            let clayRequired = this.resourceInfoLookup[this.villageResourceType]['clay'][this.villageResourceLevel+1];
            let ironRequired = this.resourceInfoLookup[this.villageResourceType]['iron'][this.villageResourceLevel+1];
            let cropRequired = this.resourceInfoLookup[this.villageResourceType]['crop'][this.villageResourceLevel+1];

            if (this.villageResources[0] >= woodRequired && this.villageResources[1] >= clayRequired && 
                this.villageResources[2] >= ironRequired && this.villageResources[3] >= cropRequired){
                return true;
            } else {
                return false;
            }
        },
    }
}
</script>