<template>
    <div>
        <div class="container">
            <div class="justify-content-center text-center" v-if="resourceInfoLookup">
                <h1 class="my-4" v-if="villageResourceType > -1">{{ resourceInfoLookup[villageResourceType]['name'] + " Level " + villageResourceLevel }}</h1>
                <h6 class="my-4" v-if="resourceInfoLookup && villageResourceType">{{ resourceInfoLookup[villageResourceType]['description'] }}</h6>
                <h5 v-if="resourceInfoLookup[villageResourceType]">
                    Current production: {{ resourceInfoLookup[villageResourceType]['production'][villageResourceLevel]*config.SERVER_SPEED }} per hour
                </h5>
                <h5 class="mb-3" v-if="resourceInfoLookup[villageResourceType]">
                    Production at Level {{ villageResourceLevel+1 }}: {{ resourceInfoLookup[villageResourceType]['production'][villageResourceLevel+1]*config.SERVER_SPEED }} per hour
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
                            <img style="width: 1.5rem;height: 1rem;" src="/images/clock.gif">           {{ secondsToTimeRemaining(resourceInfoLookup[villageResourceType]['constructionTime'][villageResourceLevel+1]/config.SERVER_SPEED * 1000) }}
                        </div>
                    </h5>
                    <h5 class="mt-4">
                        <span v-if="villageResFieldUpgrades.length > 0">Another resource field is already being upgraded</span>
                        <button v-else-if="hasRequiredResFieldResources()" type="button" class="btn btn-success" @click="upgradeResField($route.params.rfid)">Upgrade to Level {{ villageResourceLevel+1 }}</button> 
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

import { fetchMixins } from '@/mixins/fetchMixins'
import { upgradeMixins } from '@/mixins/upgradeMixins'
import { hasMixins } from '@/mixins/hasMixins'
import { toolsMixins } from '@/mixins/toolsMixins'

export default {
    data() {
        return {
            villageResourceType: undefined,
            villageResourceLevel: undefined,
            WOODCUTTER: 0,
            CLAY_PIT: 1,
            IRON_MINE: 2,
            CROPLAND: 3,
        };
    },

    mixins: [
        fetchMixins,
        
        upgradeMixins,
        hasMixins,
        toolsMixins
        ],

    watch: {
    },
    
    created() {
        this.fetchResourceFieldsData(this.$route.params.rfid);
        this.fetchVillageResFieldUpgrades();
    },

    methods: {
    }
}
</script>