<template>
  <div>
    <div class="container">
      <div class="d-flex justify-content-center" id="villageResources">
        <ul class="list-group list-group-horizontal flex-row">
          <li class="list-group-item">
              <img style="width: 1.2rem;height: 0.9rem;" src="/images/wood.gif">
              <span id="currentWood">{{ parseInt(villageResources[0]) }}</span>/<span id="maxWood">{{ villageMaxResources[0] }}</span>
          </li>
          <li class="list-group-item">
              <img style="width: 1.2rem;height: 0.9rem;" src="/images/clay.gif">
              <span id="currentClay">{{ parseInt(villageResources[1]) }}</span>/<span id="maxClay">{{ villageMaxResources[1] }}</span>
          </li>
          <li class="list-group-item">
              <img style="width: 1.2rem;height: 0.9rem;" src="/images/iron.gif">
              <span id="currentIron">{{ parseInt(villageResources[2]) }}</span>/<span id="maxIron">{{ villageMaxResources[2] }}</span>
          </li>
          <li class="list-group-item">
              <img style="width: 1.2rem;height: 0.9rem;" src="/images/crop.gif">
              <span id="currentCrop">{{ parseInt(villageResources[3]) }}</span>/<span id="maxCrop">{{ villageMaxResources[3] }}</span>
          </li>
        </ul>
      </div>
    </div>

    <div class="container mt-4 mb-4">
      <div>
        <h1 class="text-center" >World Map</h1>
      </div>
    </div>

    <div class="container">
        <div class="row">
            <div class="col-md-12">
                <p class="h2 text-center"></p>
                <div class="grid">
                    <ul id="hexGrid" style="padding-left: 0px;">
                        <!-- Row 1 -->
                        <li class="hex hexMap" v-for="(mapTile, index) in mapTiles" :key="index">

                          <div class="hexIn" v-if="index == 15">
                            <router-link class="hexLink" :to="{ path: '/sendTroops/' + 2  }">
                              <div class='img' v-bind:style="'background-color: orange'">
                                  <p style="top:35%;opacity:1;color:black">VillageName2</p>
                              </div>
                              <h1 id="demo1"></h1>
                              <p id="demo2"></p>
                            </router-link>
                          </div>

                          <div class="hexIn" v-else-if="index == 23">
                            <router-link class="hexLink" :to="{ name: 'resources' }">
                              <div class='img' v-bind:style="'background-color: orange'">
                                  <p style="top:35%;opacity:1;color:black">VillageName</p>
                              </div>
                              <h1 id="demo1"></h1>
                              <p id="demo2"></p>
                            </router-link>
                          </div>
                          
                          <div class="hexIn" v-else>
                            <router-link class="hexLink" :to="{ path: '/map/' }">
                              <div class='img' v-bind:style="'background-color: green'">
                                  <p style="top:35%;opacity:1;color:black"></p>
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
</template>


<script>

export default {
  data() {
    return {
      mapTiles : ["","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","",],
      villageResources : [],
      villageMaxResources : [],
    };
  },

  created() {
    this.fetchVillageResources();
    this.fetchVillageMaxResources();
  },

  methods: {
    fetchVillageResources(){
      this.villageResources = this.$store.getters.getVillageResources;

      this.$store.dispatch('fetchVillageResources')
      .then( () => {
        this.villageResources = this.$store.getters.getVillageResources;
      });
    },
    fetchVillageMaxResources(){
      this.villageMaxResources = this.$store.getters.getVillageMaxResources;

      this.$store.dispatch('fetchVillageMaxResources')
      .then( () => {
        this.villageMaxResources = this.$store.getters.getVillageMaxResources;
      });
    },
  }
}
</script>

<style scoped>

  #hexGrid{
    padding-bottom: 4.4%
  }

  .hex {
    width: 10%;
    /* = 100 / 5 */
  }

  .hex:nth-child(19n+11) {
    /* first hexagon of even rows */
    margin-left: 5%;
    /* = width of .hex / 2  to indent even rows */
  }

  .hex:nth-child(9n+6) {
    /* first hexagon of even rows */
    margin-left: 0%;
    /* = */
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