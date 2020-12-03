<template>
   <div class="container">
        <div class="d-flex justify-content-center" id="villageResources">
        <ul class="list-group list-group-horizontal flex-row">
            <li class="list-group-item">
                <img style="width: 1.2rem;height: 0.9rem;" src="/images/resources/wood.gif">
                <span id="currentWood">{{ parseInt(villageResources[0]) }}</span>/<span id="maxWood">{{ villageMaxResources[0] }}</span>
            </li>
            <li class="list-group-item">
                <img style="width: 1.2rem;height: 0.9rem;" src="/images/resources/clay.gif">
                <span id="currentClay">{{ parseInt(villageResources[1]) }}</span>/<span id="maxClay">{{ villageMaxResources[1] }}</span>
            </li>
            <li class="list-group-item">
                <img style="width: 1.2rem;height: 0.9rem;" src="/images/resources/iron.gif">
                <span id="currentIron">{{ parseInt(villageResources[2]) }}</span>/<span id="maxIron">{{ villageMaxResources[2] }}</span>
            </li>
            <li class="list-group-item">
                <img style="width: 1.2rem;height: 0.9rem;" src="/images/resources/crop.gif">
                <span id="currentCrop">{{ parseInt(villageResources[3]) }}</span>/<span id="maxCrop">{{ villageMaxResources[3] }}</span>
            </li>
        </ul>
        </div>
    </div>
</template>

<script>
import { fetchMixins } from '../../../mixins/fetchMixins'

export default {
    data() {
        return {
            maxResources: undefined,
        };
    },

    mixins: [fetchMixins],

     watch: {
    },

    created() {
        this.fetchVillageResources();
        this.fetchVillageMaxResources();
        this.fetchVillageProduction();
        this.startIntervals();
    },

    methods: {    
        startIntervals(){
            var woodInterval = setInterval( ()=> {
                if(parseInt(this.$store.getters.getVillageResources[0]) < this.villageMaxResources[0]){
                    this.$set(this.$store.getters.getVillageResources, 0, this.$store.getters.getVillageResources[0]+1);
                }
                else if(this.$store.getters.getVillageResources[0] == this.villageMaxResources[0]){
                    clearInterval(woodInterval);
                }
            }, 1000*3600 / this.villageProduction[0]);

            var clayInterval = setInterval( ()=> {
                if(parseInt(this.$store.getters.getVillageResources[1]) < this.villageMaxResources[1]){
                    this.$set(this.$store.getters.getVillageResources, 1, this.$store.getters.getVillageResources[1]+1);
                }
                else if(this.$store.getters.getVillageResources[1] == this.villageMaxResources[1]){
                    clearInterval(clayInterval);
                }
            }, 1000*3600 / this.villageProduction[1]);

            var ironInterval = setInterval( ()=> {
                if(parseInt(this.$store.getters.getVillageResources[2]) < this.villageMaxResources[2]){
                    this.$set(this.$store.getters.getVillageResources, 2, this.$store.getters.getVillageResources[2]+1);
                }
                else if(this.$store.getters.getVillageResources[2] == this.villageMaxResources[2]){
                    clearInterval(ironInterval);
                }
            }, 1000*3600 / this.villageProduction[2]);
                
            var cropInterval = setInterval( ()=> {
                if(parseInt(this.$store.getters.getVillageResources[3]) < this.villageMaxResources[3]){
                    this.$set(this.$store.getters.getVillageResources, 3, this.$store.getters.getVillageResources[3]+1);
                }
                else if(this.$store.getters.getVillageResources[3] == this.villageMaxResources[3]){
                    clearInterval(cropInterval);
                }
            }, 1000*3600 / this.villageProduction[3]);
        },
    }
}
</script>