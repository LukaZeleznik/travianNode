<template>
    <div v-if="!$route.params.tileid">
        <div v-if="checkIfLoggedIn(false)">
            <div class="container mt-4 mb-4">
                <div>
                    <h1 class="text-center" >World Map</h1>
                </div>
            </div>
            <div class="container mb-4">
                <div class="row">
                    <div class="col-md-12">
                        <p class="h2 text-center"></p>
                        <div class="grid">
                            <ul id="hexGrid" style="padding-left: 0px;">
                                <li class="hex hexMap" v-for="(tile, index) in tileData" :key="index">
                                    <div class="hexIn" v-tooltip="{ 
                                            content: tooltipData(tile),
                                            delay: {
                                                show: 500,
                                                hide: 300,
                                            }}">
                                        <router-link class="hexLink" :to="{ path: '/map/' + (index+1) }">
                                            <div class='img' v-bind:style="getTileColour(tile)">
                                                <img v-if="tile['owner']" style="width: 2.5rem;height: 2.5rem;" class="mt-4" src="/images/map/village.png">
                                                <img v-else style="width: 2rem;height: 2rem; opacity: .5;" class="mt-4" src="/images/map/trees.svg">
                                            </div>
                                            <h1 id="demo1"></h1>
                                            <p id="demo2"></p>
                                        </router-link>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <mapTile v-else></mapTile>
</template>


<script>
import { fetchMixins } from '@/mixins/fetchMixins'
import { toolsMixins } from '@/mixins/toolsMixins'

export default {
    data() {
        return {
            tileData: [],
        };
    },

    mixins: [toolsMixins,fetchMixins],

    created() {
        this.loadMethods();
    },

    methods: {
        loadMethods(){
            if(this.checkIfLoggedIn(true)){
                this.loadTileData();
                this.fetchReportNotifications();
            }
        },
        async loadTileData(){
            this.tileData = await(await(await this.doApiRequest("villages","GET","",false)).json()).data;
        },
        getTileColour(tile){
            const userId = this.getCookie('userId');
            let style = 'background-color:';

            if (tile['owner']=='') return style += '#14bd58';
            if (tile['owner']==userId) {
                return style += 'CornflowerBlue';
            } else {
                return style += 'orange';
            }
        },
        tooltipData(tile){
            let tooltipHTML = '(' + tile['xCoordinate'] + '|' + tile['yCoordinate'] + ')';
            tooltipHTML += '</br>';
            if (tile['name']=='') return tooltipHTML += 'Abandoned valley';
            return tooltipHTML += tile['name'];
        }
        
    }
}

</script>

<style scoped>

  #hexGrid{
    padding-bottom: 4.4%
  }

  .hex {
    width: 9.09%;
    /* 100% / width */
  }
  .hex:nth-child(9n+6) {
    /* first hexagon of even rows */
    margin-left: 0%;
    /* = */
  }

  .hex:nth-child(21n+12) {
    /* first hexagon of even rows */
    margin-left: 4.5%;
    /* = width of .hex / 2  to indent even rows */
  }


  .hex p {
      font-size: 0.8em;
  }

  @media (max-width: 600px) {
    #hexGrid {
      width: 100%;
    }
    .hex p {
      font-size: 0.4em;
    }
}

</style>