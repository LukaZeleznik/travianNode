<template>
    <div>
        <div class="h3">Troop Movements:</div>
        <div v-if="villageIncomingAttacks.length > 0 || villageOutgoingAttacks.length > 0 || 
            villageIncomingReinforcements.length > 0 || villageOutgoingReinforcements.length > 0">
            <div class="d-flex justify-content-between" v-if="villageIncomingAttacks.length > 0">
                <h5 style="color:Red"><img style="width: 1.2rem;" src="/images/att_inc.gif"><strong>
                        {{villageIncomingAttacks.length}} Attacks</strong></h5>
                <h5>in <span id="incAtt">{{villageIncomingAttacksTimeLeft[0].toFixed(0)}}</span> seconds</h5>
            </div>
            <div class="d-flex justify-content-between" v-if="villageOutgoingAttacks.length > 0">
                <h5 style="color:Orange"><img style="width: 1.2rem;" src="/images/att_out.gif"><strong>
                        {{villageOutgoingAttacks.length}} Attacks</strong></h5>
                <h5>in <span id="outAtt">{{villageOutgoingAttacksTimeLeft[0].toFixed(0)}}</span> seconds</h5>
            </div>
            <div class="d-flex justify-content-between" v-if="villageIncomingReinforcements.length > 0">
                <h5 style="color:Orange"><img style="width: 1.2rem;" src="/images/reinf_inc.gif"><strong>
                        {{villageIncomingReinforcements.length}} Reinf.</strong></h5>
                <h5>in <span id="incReinf">{{villageIncomingReinforcementsTimeLeft[0].toFixed(0)}}</span> seconds</h5>
            </div>
            <div class="d-flex justify-content-between" v-if="villageOutgoingReinforcements.length > 0">
                <h5 style="color:Green"><img style="width: 1.2rem;" src="/images/reinf_out.gif"><strong>
                        {{villageOutgoingReinforcements.length}} Reinf.</strong></h5>
                <h5>in <span id="outReinf">{{villageOutgoingReinforcementsTimeLeft[0].toFixed(0)}}</span> seconds</h5>
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
import { fetchMixins } from '@/mixins/fetchMixins'

export default {
    data() {
        return {
            villageOutgoingReinforcements: [],
            villageIncomingReinforcements: [],
            villageIncomingAttacks: [],
            villageOutgoingAttacks: [],
            villageOutgoingReinforcementsTimeLeft: [],
            villageIncomingReinforcementsTimeLeft: [],
            villageIncomingAttacksTimeLeft: [],
            villageOutgoingAttacksTimeLeft: [],
        };
    },

    mixins: [fetchMixins],

    created(){
        this.fetchVillageTroopMovements();
        this.startTroopMovementsInterval();
    },

    watch: {
        'villageOutgoingReinforcements': function(){
            if(this.villageOutgoingReinforcements.length > 0){  
                this.villageOutgoingReinforcementsTimeLeft[0] = (this.villageOutgoingReinforcements[0].timeArrived - Math.floor(new Date().getTime()/1000));
            }
        },
        'villageIncomingReinforcements': function(){
            if(this.villageIncomingReinforcements.length > 0){  
                this.villageIncomingReinforcementsTimeLeft[0] = (this.villageIncomingReinforcements[0].timeArrived - Math.floor(new Date().getTime()/1000));
            }
        },
        'villageIncomingAttacks': function(){
            if(this.villageIncomingAttacks.length > 0){         
                this.villageIncomingAttacksTimeLeft[0] = (this.villageIncomingAttacks[0].timeArrived - Math.floor(new Date().getTime()/1000));
            }
        },
        'villageOutgoingAttacks': function(){
            if(this.villageOutgoingAttacks.length > 0){         
                this.villageOutgoingAttacksTimeLeft[0] = (this.villageOutgoingAttacks[0].timeArrived - Math.floor(new Date().getTime()/1000));
            }
        }
    },

    methods:{
        startTroopMovementsInterval(){
            setInterval( ()=> {
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
                
                if(this.villageIncomingAttacksTimeLeft[0] <= 0 || this.villageIncomingReinforcementsTimeLeft[0] <= 0 || this.villageOutgoingAttacksTimeLeft[0] <= 0 || this.villageOutgoingReinforcementsTimeLeft[0] <= 0){
                    this.fetchVillageOwnTroops();
                    this.fetchVillageTroopMovements();
                    this.fetchSidebarVillageList();
                }
            }, 1000);
        }
    }
}
</script>