
<template>    
    <div class="outerGrid">
        <div class="grid">
            <ul id="hexGrid" style="padding-left: 0px;">
                <li class="hex" v-for="index in 22" :key="index">
                    <div class=" " v-if="index == 1 || index == 5 || index == 19"></div>
                    <div class="hexIn" v-else-if="index == 12">
                        <router-link class="hexLink" :to="{ name: 'village' }">
                            <div class='img' v-bind:style="'background-color: White'">
                                <p style="top:35%;opacity:1;color:black">Village</p>
                            </div>
                            <h1 id="demo1"></h1>
                            <p id="demo2"></p>
                        </router-link>
                    </div>
                    <div class="hexIn" v-else>
                        <router-link class="hexLink" :to="{ path: '/resourceField/' + realIndexes[index] }">
                            <div class='img' v-bind:style="'background-color:' + villageResourceFieldColors[realIndexes[index]-1]">
                                <p style="top:35%;opacity:1;color:black">{{ villageResourceFieldLevels[realIndexes[index]-1] }}</p>
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
import { fetchMixins } from '../../mixins/fetchMixins'

export default {
    data() {
        return {
            realIndexes: [1,1,1,2,3,3,4,5,6,7,8,9,10,10,11,12,13,14,15,16,16,17,18],
        };
    },

    mixins: [fetchMixins],

    created(){
        this.fetchvillageResourceFields();
    },

    watch: {
    },

    methods: {
    }
}
</script>