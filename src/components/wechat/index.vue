<template>
    <div>
        <van-nav-bar
            title="网站公告"
            fixed
        />
        <div class="content">
            <h4>{{content[0].title}}</h4>
            <div class="insCon" v-html="content[0].content"></div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "index",
        data() {
            return {
                content: '',
            }
        },
        created() {
            this.$axios.post('/api/article/getInfoByType',{type:6})
                .then(res => {
                    if(!res.data.code){
                        this.content = res.data.data;
                    }
                })
                .catch(err => {
                    this.$toast(err)
                })
        },
    }
</script>

<style scoped>
    .content {
        background: #fff;
    }
    h4 {
        height: 3rem;
        line-height: 3rem;
        font-size: 1rem;
    }
    div.insCon {
        padding: 0 0.85rem;
        text-align: left;
        line-height: 1.8rem;
        font-size: 0.9rem;
    }
</style>