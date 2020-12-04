<template>
    <div class="container text-center">
        <form class="form-group w-50 m-auto" id="loginForm" action="#">
            <h2 class="form-signin-heading" >Login</h2>
            <input type="text" name="username" class="form-control w-100 my-2 username-field input-lg" placeholder="Username" required autofocus>
            <input type="password" name="password" id="inputPassword" class="form-control w-100 mb-2" placeholder="Password" required>
            <button class="btn btn-lg btn-primary btn-block" v-on:click="login()">Login</button>
            <a class="btn btn-lg btn-primary btn-block" href="/register">Register</a>
        </form>
    </div>
</template>

<script>
import { apiRequestMixins } from '@/mixins/apiRequestMixins' 
    export default {
        name: 'Login',
        data() {
            return {
            }
        },

        mixins: [apiRequestMixins],

        methods: {
            async login() {
                const loginForm = document.getElementById('loginForm');
                const username  = loginForm.querySelector('input[name=username]').value;
                const password  = loginForm.querySelector('input[name=password]').value;
                let current = this;

                loginForm.addEventListener('submit', async function(e){
                    e.preventDefault();
                    if(username != "" && password != "") {
                        let userResponse = await current.doApiRequest("login?email=" + username + "&password=" + password, "POST", "");
                        let userResponseJson = await userResponse.json();
                        console.log(userResponseJson.token);
                    } else {
                        console.log("A username and password must be present");
                    }
                });
            }
        }
    }

</script>
