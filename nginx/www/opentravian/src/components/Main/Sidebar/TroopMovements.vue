<template>
    <div>
        <div class="h3">Troop Movements:</div>
        <div v-if="villageIncomingAttacks.length > 0 || villageOutgoingAttacks.length > 0 || 
            villageIncomingReinforcements.length > 0 || villageOutgoingReinforcements.length > 0">
            <div class="d-flex justify-content-between" v-if="villageIncomingAttacks.length > 0">
                <h5 style="color:Red"><img style="width: 1.2rem;" src="/images/att_inc.gif"><strong>
                        {{villageIncomingAttacks.length}} Attacks</strong></h5>
                <h5>in <span id="incAtt">{{villageIncomingAttacksTimeLeft[0]}}</span> seconds</h5>
            </div>
            <div class="d-flex justify-content-between" v-if="villageOutgoingAttacks.length > 0">
                <h5 style="color:Orange"><img style="width: 1.2rem;" src="/images/att_out.gif"><strong>
                        {{villageOutgoingAttacks.length}} Attacks</strong></h5>
                <h5>in <span id="outAtt">{{villageOutgoingAttacksTimeLeft[0]}}</span> seconds</h5>
            </div>
            <div class="d-flex justify-content-between" v-if="villageIncomingReinforcements.length > 0">
                <h5 style="color:Orange"><img style="width: 1.2rem;" src="/images/reinf_inc.gif"><strong>
                        {{villageIncomingReinforcements.length}} Reinf.</strong></h5>
                <h5>in <span id="incReinf">{{villageIncomingReinforcementsTimeLeft[0]}}</span> seconds</h5>
            </div>
            <div class="d-flex justify-content-between" v-if="villageOutgoingReinforcements.length > 0">
                <h5 style="color:Green"><img style="width: 1.2rem;" src="/images/reinf_out.gif"><strong>
                        {{villageOutgoingReinforcements.length}} Reinf.</strong></h5>
                <h5>in <span id="outReinf">{{villageOutgoingReinforcementsTimeLeft[0]}}</span> seconds</h5>
            </div>
        </div>
        <div class="h5" v-else>
            <div class="text-center">
                <h5>None</h5>
            </div>
        </div>
    </div>
</template>

<script>  
import { fetchMixins } from '../../../mixins/fetchMixins'
export default {
    data() {
        return {

        };
    },

    mixins: [fetchMixins],

    watch: {
    }
}
</script>