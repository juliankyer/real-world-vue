<template>
  <div>
    <h1>Dangarang</h1>
    <h3>The {{ resource }} you're looking for isn't a thing</h3>
    <router-link :to="{ name: 'event-list' }">Go back home</router-link>
  </div>
</template>
<script>
export default {
  props: {
    resource: {
      type: String,
      required: true,
    },
  },
};
</script>
