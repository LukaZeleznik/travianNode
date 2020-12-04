<template>
  <div>
    <navbarResources></navbarResources>
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
                                  <p style="top:35%;opacity:1;color:black">{{ mapTiles[index] }}</p>
                              </div>
                              <h1 id="demo1"></h1>
                              <p id="demo2"></p>
                            </router-link>
                          </div>

                          <div class="hexIn" v-else-if="index == 47">
                            <router-link class="hexLink" :to="{ name: 'resources' }">
                              <div class='img' v-bind:style="'background-color: orange'">
                                  <p style="top:35%;opacity:1;color:black">{{ mapTiles[index] }}</p>
                              </div>
                              <h1 id="demo1"></h1>
                              <p id="demo2"></p>
                            </router-link>
                          </div>
                          
                          <div class="hexIn" v-else>
                            <router-link class="hexLink" :to="{ path: '/map/' + index }">
                              <div class='img' v-bind:style="'background-color: green'">
                                  <p style="top:35%;opacity:1;color:black">{{ mapTiles[index] }}</p>
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
      mapTiles : [],
    };
  },

  created() {
    this.test();
  },

  methods: {
    test(){
      let testTiles = [];
      let width = 11;
      let height = 9;
      let increment = 0;

      for(let y = 0; y < height; y++){
        testTiles[y] = [];
        for(let x = 0; x < width; x++){
          if (y % 2 && x == width-1) break;
          testTiles[y][x] = (x - Math.floor(width/2)) + ", " + -(y - Math.floor(height/2));
          this.mapTiles[increment] = testTiles[y][x];
          increment++;
        }
      }
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