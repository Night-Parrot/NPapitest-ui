<template>
    <iframe id="edit_page" style="height: 99.5%;width:100%;border:0;"></iframe>
</template>

<script>
export default {
    mounted() {
        this.ylmc = this.$router.history.current.query.ylmc;
        this.ylbh = this.$router.history.current.query.ylbh;
        // document.getElementById('edit_page').src = 'http://172.18.17.116/apitest/edit_page/' + this.ylbh + '/' + this.ylmc
        document.getElementById('edit_page').src = 'http://172.18.48.41:8585/view_page/' + this.ylbh + '/' + this.ylmc
    },
    data() {
        return {
           ylbh: '',
           ylmc: '',
        }
    }
}
</script>

