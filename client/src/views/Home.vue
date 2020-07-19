<template>
  <div class="home text-center">
    <div class="jumbotron">
      <h1 class="display-3">Emoji Ramen</h1>
      <p class="lead">
        Exploration.
      </p>
      <hr class="my-4">
      <p>
        Produced by nine industries with the help of other people.
      </p>
      <p class="lead">
        <router-link class="btn btn-primary btn-lg"
          :to="{ name:'signup' }"
          role="button">
           Sign up
        </router-link>
      </p>
    </div>
  </div>
</template>

<script>

export default {
  name: 'home',
};
</script>
