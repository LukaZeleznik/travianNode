<template>    
    <div> 
        <div class="grid">
            <ul id="hexGrid" style="padding-left: 0px;">
                <li class="hex" v-for="(villageResFieldColor, index) in villageResFieldColors" :key="index">
                    <div class="hexIn" v-if="index == 0 || index == 4 || index == 18">
                    </div>

                    <div class="hexIn" v-else-if="index == 11">
                    <router-link class="hexLink" :to="{ name: 'village' }">
                        <div class='img' v-bind:style="'background-color:'+villageResFieldColor">
                            <p style="top:35%;opacity:1;color:black">{{villageResFieldLevels[index]}}</p>
                        </div>
                        <h1 id="demo1"></h1>
                        <p id="demo2"></p>
                    </router-link>
                    </div>
                    
                    <div class="hexIn" v-else>
                    <router-link class="hexLink" :to="{ path: '/resourceField/' + index }">
                        <div class='img' v-bind:style="'background-color:'+villageResFieldColor">
                            <p style="top:35%;opacity:1;color:black">{{villageResFieldLevels[index]}}</p>
                        </div>
                        <h1 id="demo1"></h1>
                        <p id="demo2"></p>
                    </router-link>
                    </div>
                </li>
            </ul>                
        </div>   
    </div>
</template>

<script>
export default {
    data() {
        return {
            villageResFieldColors: this.$store.getters.getVillageResFieldColors,
            villageResFieldLevels: this.$store.getters.getVillageResFieldLevels,
        };
    },
    watch: {
        '$store.getters.getVillageResFieldColors': function() {
            this.villageResFieldColors = this.$store.getters.getVillageResFieldColors;
        },
        '$store.getters.getVillageResFieldLevels': function() {
            this.villageResFieldLevels = this.$store.getters.getVillageResFieldLevels;
        },
    }
}
</script>