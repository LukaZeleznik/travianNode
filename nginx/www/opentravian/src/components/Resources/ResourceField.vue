<template>
    <div>
        <div class="container">
            <div class="justify-content-center text-center" v-if="resourceInfoLookup && villageResourceLevel">
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
                <div v-if=" (villageResourceType == WOOD || villageResourceType == IRON && villageResourceLevel < 20) || 
                            (villageResourceType == CLAY || villageResourceType == CROP && villageResourceLevel < 21)">
                    <h5 class="mb-3"> 
                        <div>
                            <img style="width: 1.5rem;height: 1rem;" src="/images/resources/wood.gif">  {{ resourceInfoLookup[villageResourceType]['wood'][villageResourceLevel] }} |
                            <img style="width: 1.5rem;height: 1rem;" src="/images/resources/clay.gif">  {{ resourceInfoLookup[villageResourceType]['clay'][villageResourceLevel] }} |
                            <img style="width: 1.5rem;height: 1rem;" src="/images/resources/iron.gif">  {{ resourceInfoLookup[villageResourceType]['iron'][villageResourceLevel] }} |
                            <img style="width: 1.5rem;height: 1rem;" src="/images/resources/crop.gif">  {{ resourceInfoLookup[villageResourceType]['crop'][villageResourceLevel] }} |
                            <img style="width: 1.5rem;height: 1rem;" src="/images/consum.gif">          {{ resourceInfoLookup[villageResourceType]['consumption'][villageResourceLevel] }} |
                            <img style="width: 1.5rem;height: 1rem;" src="/images/clock.gif">           {{ $root.secondsToTimeRemaining(resourceInfoLookup[villageResourceType]['constructionTime'][villageResourceLevel] * 1000) }}
                        </div>
                    </h5>
                    <h5 class="mt-4"> 
                        <button type="button" class="btn btn-success" @click="upgradeResField()">Upgrade to Level {{ villageResourceLevel+1 }}</button> 
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
            WOOD: 0,
            CLAY: 1,
            IRON: 2,
            CROP: 3,
        };
    },

    created() {
        this.fetchResourceFieldsData();
    },

    methods: {
        fetchResourceFieldsData(){
            fetch('http://localhost:8080/api/villageResourceFields/1')
            .then(res => res.json())
            .then(res => {
                let rfid = this.$route.params.rfid;
                let keyType = "field"+rfid+"Type";
                let keyLevel = "field"+rfid+"Level";

                this.villageResourceType = res.data[keyType];
                this.villageResourceLevel = res.data[keyLevel];
                console.log("this.villageResourceType",this.villageResourceType,"this.villageResourceLevel",this.villageResourceLevel);
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
    }
}
</script>