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

export default {
    data() {
        return {
            villageResources : this.$store.getters.getVillageResources,
            maxResources : undefined,
        };
    },

     watch: {
        '$store.getters.getVillageResources': function() {
            this.villageResources = this.$store.getters.getVillageResources;
        },
    },

    created() {
        this.fetchVillageResources();
        this.fetchVillageMaxResources();
        this.fetchVillageProduction();
    },

    methods: {
        fetchVillageResources(){
            this.villageResources = this.$store.getters.getVillageResources;

            this.$store.dispatch('fetchVillageResources')
            .then( () => {
                this.villageResources = this.$store.getters.getVillageResources;
            })
        },
        fetchVillageMaxResources(){
            this.villageMaxResources = this.$store.getters.getVillageMaxResources;

            this.$store.dispatch('fetchVillageMaxResources')
            .then( () => {
                this.villageMaxResources = this.$store.getters.getVillageMaxResources;
            });
        },
        fetchVillageProduction(){
            this.villageProduction = this.$store.getters.getVillageProduction;

            this.$store.dispatch('fetchVillageProduction')
            .then( () => {
                this.villageProduction = this.$store.getters.getVillageProduction;
            })
            .then( () => {
                this.startIntervals();
            });
        },
        startIntervals(){
            var woodInterval = setInterval( ()=> {
                if(parseInt(this.villageResources[0]) < this.villageMaxResources[0]){
                    this.$set(this.villageResources, 0, this.villageResources[0]+1);
                }
                else if(this.villageResources[0] == this.villageMaxResources[0]){
                    clearInterval(woodInterval);
                }
            }, 1000*3600 / this.villageProduction[0]);

            var clayInterval = setInterval( ()=> {
                if(parseInt(this.villageResources[1]) < this.villageMaxResources[1]){
                    this.$set(this.villageResources, 1, this.villageResources[1]+1);
                }
                else if(this.villageResources[1] == this.villageMaxResources[1]){
                    clearInterval(clayInterval);
                }
            }, 1000*3600 / this.villageProduction[1]);

            var ironInterval = setInterval( ()=> {
                if(parseInt(this.villageResources[2]) < this.villageMaxResources[2]){
                    this.$set(this.villageResources, 2, this.villageResources[2]+1);
                }
                else if(this.villageResources[2] == this.villageMaxResources[2]){
                    clearInterval(ironInterval);
                }
            }, 1000*3600 / this.villageProduction[2]);
                
            var cropInterval = setInterval( ()=> {
                if(parseInt(this.villageResources[3]) < this.villageMaxResources[3]){
                    this.$set(this.villageResources, 3, this.villageResources[3]+1);
                }
                else if(this.villageResources[3] == this.villageMaxResources[3]){
                    clearInterval(cropInterval);
                }
            }, 1000*3600 / this.villageProduction[3]);
        },
    }
}
</script>