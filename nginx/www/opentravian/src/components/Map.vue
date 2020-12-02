<template>
  <div>
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
                        <!-- Row 1 -->
                        <li class="hex hexMap" v-for="(mapTile, index) in mapTiles" :key="index">

                          <div class="hexIn" v-if="index == 31">
                            <router-link class="hexLink" :to="{ path: '/sendTroops/' + 2  }">
                              <div class='img' v-bind:style="'background-color: orange'">
                                  <p style="top:35%;opacity:1;color:black">VillageName2</p>
                              </div>
                              <h1 id="demo1"></h1>
                              <p id="demo2"></p>
                            </router-link>
                          </div>

                          <div class="hexIn" v-else-if="index == 51">
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
      mapTiles : ["","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","",
      "","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","",],
    };
  },

  created() {

  },

  methods: {
    
  }
}
</script>

<style scoped>

  #hexGrid{
    padding-bottom: 4.4%
  }

  .hex {
    width: 8.33%;
    /* = 100 / 5 */
  }
  .hex:nth-child(9n+6) {
    /* first hexagon of even rows */
    margin-left: 0%;
    /* = */
  }

  .hex:nth-child(23n+13) {
    /* first hexagon of even rows */
    margin-left: 4.2%;
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