<template>
  <div style="margin-top: 10px;margin-left: 10px">
    <a-button type="primary" @click="relaod_cache">刷新缓存</a-button>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {};
  },
  methods: {
      relaod_cache() {
           axios.get("reload_cache")
          .then(response => {
            if (response.data.result === "success") {
                this.$message.success(response.data.msg)
            } else {
                this.$message.error(response.data.msg)
            }
          });
      }
  }
};
</script>