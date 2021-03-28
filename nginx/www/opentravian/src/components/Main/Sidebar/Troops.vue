<template>
    <div>
        <div class="h3 mt-3">Troops:</div>
        <div v-if="villageOwnTroops.length > 0">
            <div class="h5" v-if="villageOwnTroops.reduce((accumulator, currentValue) => accumulator + Math.floor(currentValue)) > 0">
                <div class="d-flex align-center" v-for="(villageOwnTroop, index) in villageOwnTroops" :key="index">
                    <h5 v-if="Math.floor(villageOwnTroop)"><img :src="'/images/troops/' + userTribe + '/' + (index+1) + '.gif'">  
                        {{ Math.floor(villageOwnTroop)}} {{ troopInfoLookup[userTribe][index]['name'] }} 
                    </h5>
                </div>
                <span v-if="hasReinforcements()">Reinforcements:</span>
                <div v-for="(troops, tribe) in villageReinforcements" :key="tribe">
                    <div class="d-flex align-center" v-for="(troop, index) of troops" :key="index">
                        <h5 v-if="Math.floor(troop)"><img :src="'/images/troops/' + tribe + '/' + (parseInt(index.match(/\d/g).join(''), 10)) + '.gif'">
                           {{ Math.floor(troop)}} {{ troopInfoLookup[tribe][parseInt(index.match(/\d/g).join(''), 10)-1]['name'] }}
                        </h5>
                    </div>
                </div>
            </div>  
            <div class="h5" v-else>
                <div class="text-center">
                    <h5>None</h5>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { fetchMixins } from '@/mixins/fetchMixins'
import { toolsMixins } from '@/mixins/toolsMixins'

export default {
    data() {
        return {
        };
    },

    mixins: [fetchMixins, toolsMixins],

    watch: {
    },

    created() {
        this.fetchVillageOwnTroops();
        this.fetchVillageReinforcements();
    },

    methods: {
        hasReinforcements(){
            for (let villageReinforcement in this.villageReinforcements) {
                if (Object.values(this.villageReinforcements[villageReinforcement]).reduce((accumulator, currentValue) => accumulator + Math.floor(currentValue)) > 0)
                    return true;
            }
            return false;
        }
    }
}
</script>