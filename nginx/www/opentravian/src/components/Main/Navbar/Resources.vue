<template>
   <div class="container" v-if="checkIfLoggedIn(false)">
        <div class="d-flex justify-content-center" id="villageResources">
        <ul class="list-group list-group-horizontal flex-row">
            <li class="list-group-item">
                <img style="width: 1.2rem;height: 0.9rem;" src="/images/resources/wood.gif" alt="wood">
                <span id="currentWood">{{ parseInt(villageResources[0]) }}</span>/<span id="maxWood">{{ villageMaxResources[0] }}</span>
            </li>
            <li class="list-group-item">
                <img style="width: 1.2rem;height: 0.9rem;" src="/images/resources/clay.gif" alt="clay">
                <span id="currentClay">{{ parseInt(villageResources[1]) }}</span>/<span id="maxClay">{{ villageMaxResources[1] }}</span>
            </li>
            <li class="list-group-item">
                <img style="width: 1.2rem;height: 0.9rem;" src="/images/resources/iron.gif" alt="iron">
                <span id="currentIron">{{ parseInt(villageResources[2]) }}</span>/<span id="maxIron">{{ villageMaxResources[2] }}</span>
            </li>
            <li class="list-group-item">
                <img style="width: 1.2rem;height: 0.9rem;" src="/images/resources/crop.gif" alt="crop">
                <span id="currentCrop">{{ parseInt(villageResources[3]) }}</span>/<span id="maxCrop">{{ villageMaxResources[3] }}</span>
            </li>
        </ul>
        </div>
    </div>
</template>

<script>
import { fetchMixins } from '@/mixins/fetchMixins'

export default {
    data() {
        return {
            maxResources: undefined,
            woodInterval: undefined,
            clayInterval: undefined,
            ironInterval: undefined,
            cropInterval: undefined,
        };
    },

    mixins: [fetchMixins],

    watch: {
         'villageProduction': function(){     if (this.villageMaxResources[0] > 0) this.startIntervals(); },
         'villageMaxResources': function(){   if (this.villageProduction[0] > 0) this.startIntervals(); }
    },

    created() {
        this.loadMethods();
    },

    methods: {   
        loadMethods(){
            if (this.checkIfLoggedIn(false)){
                this.fetchVillageResources();
                this.fetchVillageMaxResources();
                this.fetchVillageProduction();
            }
        },
        startIntervals(){
            if (this.woodInterval) return;

            this.woodInterval = setInterval( ()=> {
                if(parseInt(this.villageResources[0]) < this.villageMaxResources[0]){
                    this.$set(this.villageResources, 0, this.villageResources[0]+1);
                }
            }, 1000*3600 / this.villageProduction[0]);

            this.clayInterval = setInterval( ()=> {
                if(parseInt(this.villageResources[1]) < this.villageMaxResources[1]){
                    this.$set(this.villageResources, 1, this.villageResources[1]+1);
                }
            }, 1000*3600 / this.villageProduction[1]);

            this.ironInterval = setInterval( ()=> {
                if(parseInt(this.villageResources[2]) < this.villageMaxResources[2]){
                    this.$set(this.villageResources, 2, this.villageResources[2]+1);
                }
            }, 1000*3600 / this.villageProduction[2]);
                
            this.cropInterval = setInterval( ()=> {
                if(parseInt(this.villageResources[3]) < this.villageMaxResources[3]){
                    this.$set(this.villageResources, 3, this.villageResources[3]+1);
                }
            }, 1000*3600 / this.villageProduction[3]);
        },
    }
}
</script>