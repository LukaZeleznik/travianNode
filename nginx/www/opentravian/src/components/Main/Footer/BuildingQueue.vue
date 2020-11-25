<template>
    <div>
        <div class="h3 pl-5 ml-4 my-3" v-if="villageResFieldUpgrades.length > 0">Buildings:</div>
        <div class="d-flex justify-content-between pl-5 ml-4 upgrageResFieldData"
            v-if="villageResFieldUpgrades.length > 0">
            <h5><img style="width: 1.0rem;height: 0.9rem;" src="/images/del.gif">
                {{ villageResFieldUpgrades[0].fieldType }}
                (Level {{ villageResFieldUpgrades[0].fieldLevel }})</h5>
            <h5 class="text-center">in <span id="upgradeCD1">{{ villageResFieldUpgradesTimeLeft[0] }}</span>
                seconds</h5>
            <h5 class="text-right">done at
                {{ new Date(villageResFieldUpgrades[0].timeCompleted*1000).toLocaleTimeString('sl-SI')}} </h5>
        </div>
        <div class="d-flex justify-content-between pl-5 ml-4 upgrageResFieldData"
            v-if="villageResFieldUpgrades.length == 2">
            <h5><img style="width: 1.0rem;height: 0.9rem;" src="/images/del.gif">
                {{ villageResFieldUpgrades[1].fieldType }}
                (Level {{ villageResFieldUpgrades[1].fieldLevel }})</h5>
            <!--<h5>in <span id="upgradeCD1">{{ new Date(villageResFieldUpgrades[1].timeCompleted*1000 - Math.floor(new Date().getTime())).toLocaleTimeString() }}</span> hours</h5>-->
            <h5>done at
                {{ new Date(villageResFieldUpgrades[1].timeCompleted*1000).toLocaleTimeString('sl-SI') }}
            </h5>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            villageResFieldUpgrades: this.$store.getters.getVillageResFieldUpgrades,
            villageResFieldUpgradesTimeLeft: [],
        };
    },
    created() {
        this.startUpgradeInterval();
    },
    watch: {
        '$store.getters.getVillageResFieldUpgrades': function() {
            this.villageResFieldUpgrades = this.$store.getters.getVillageResFieldUpgrades;
            if(this.villageResFieldUpgrades.length < 1) return;
            this.villageResFieldUpgradesTimeLeft[0] = (this.villageResFieldUpgrades[0].timeCompleted - Math.floor(new Date().getTime()/1000));
        },
    },
    methods: {
        startUpgradeInterval(){
            var upgradeCD1Interval = setInterval( ()=> {
                if(this.villageResFieldUpgradesTimeLeft[0] > 0){
                    this.$set(this.villageResFieldUpgradesTimeLeft, 0, this.villageResFieldUpgradesTimeLeft[0]-1);
                }
                else if(this.villageResFieldUpgradesTimeLeft[0] == 0 ){
                    clearInterval(upgradeCD1Interval);
                }
            }, 1000);
        },
    }
    
}
</script>