<template>
  <a-result status="403" subTitle="你已经被封印了！щ(゜ロ゜щ)">
    <template v-slot:extra>
      <a-button type="primary" @click="back_index" >解除封印！(*￣∇￣*)</a-button>
    </template>
  </a-result>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {
      back_index() {
          this.$router.replace({path: '/'})
      }
  }
};
</script>