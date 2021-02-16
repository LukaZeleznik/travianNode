<template>
    <div v-if="checkIfLoggedIn(false)">
        <div class="container">
            <div class="row">
                <table class="table table-bordered" aria-describedby="report">
                    <tbody>
                        <tr>
                            <th scope="col" class="text-center"><img src="/images/troops/teuton/1.gif" alt="1"></th>
                            <th scope="col" class="text-center"><img src="/images/troops/teuton/2.gif" alt="2"></th>
                            <th scope="col" class="text-center"><img src="/images/troops/teuton/3.gif" alt="3"></th>
                            <th scope="col" class="text-center"><img src="/images/troops/teuton/4.gif" alt="4"></th>
                            <th scope="col" class="text-center"><img src="/images/troops/teuton/5.gif" alt="5"></th>
                            <th scope="col" class="text-center"><img src="/images/troops/teuton/6.gif" alt="6"></th>
                            <th scope="col" class="text-center"><img src="/images/troops/teuton/7.gif" alt="7"></th>
                            <th scope="col" class="text-center"><img src="/images/troops/teuton/8.gif" alt="8"></th>
                            <th scope="col" class="text-center"><img src="/images/troops/teuton/9.gif" alt="9"></th>
                            <th scope="col" class="text-center"><img src="/images/troops/teuton/10.gif" alt="10"></th>
                        </tr>
                        <tr>
                            <td class="text-center">0</td>
                            <td class="text-center">0</td>
                            <td class="text-center">0</td>
                            <td class="text-center">0</td>
                            <td class="text-center">0</td>
                            <td class="text-center">0</td>
                            <td class="text-center">0</td>
                            <td class="text-center">0</td>
                            <td class="text-center">0</td>
                            <td class="text-center">0</td>
                        </tr>
                    </tbody>
                </table>
                <table class="table table-bordered" aria-describedby="report">
                    <tbody>
                        <tr>
                            <th scope="col" class="text-center"><img src="/images/troops/teuton/1.gif" alt="1"></th>
                            <th scope="col" class="text-center"><img src="/images/troops/teuton/2.gif" alt="2"></th>
                            <th scope="col" class="text-center"><img src="/images/troops/teuton/3.gif" alt="3"></th>
                            <th scope="col" class="text-center"><img src="/images/troops/teuton/4.gif" alt="4"></th>
                            <th scope="col" class="text-center"><img src="/images/troops/teuton/5.gif" alt="5"></th>
                            <th scope="col" class="text-center"><img src="/images/troops/teuton/6.gif" alt="6"></th>
                            <th scope="col" class="text-center"><img src="/images/troops/teuton/7.gif" alt="7"></th>
                            <th scope="col" class="text-center"><img src="/images/troops/teuton/8.gif" alt="8"></th>
                            <th scope="col" class="text-center"><img src="/images/troops/teuton/9.gif" alt="9"></th>
                            <th scope="col" class="text-center"><img src="/images/troops/teuton/10.gif" alt="10"></th>
                        </tr>
                        <tr>
                            <td class="text-center">0</td>
                            <td class="text-center">0</td>
                            <td class="text-center">0</td>
                            <td class="text-center">0</td>
                            <td class="text-center">0</td>
                            <td class="text-center">0</td>
                            <td class="text-center">0</td>
                            <td class="text-center">0</td>
                            <td class="text-center">0</td>
                            <td class="text-center">0</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>


<script>
import { fetchMixins } from '@/mixins/fetchMixins'
import { toolsMixins } from '@/mixins/toolsMixins'


export default {
    data() {
        return {
            
        };
    },

    props: ["reportsData"],

    mixins: [toolsMixins,fetchMixins],

    created() {
        this.loadMethods();
    },

    methods: {
        loadMethods(){
            if(this.checkIfLoggedIn(true)){
                //console.log(this.data);
            }
        },
    }
}
</script>

<style>


</style>