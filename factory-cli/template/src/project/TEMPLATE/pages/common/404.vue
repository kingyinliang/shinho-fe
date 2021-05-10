<template>
    <div>
        <div class="error clearfix">
            <img src="@/assets/img/layout/404.png" alt="">
            <div class="errortxt">
                <h3>404</h3>
                <p>抱歉，你访问的页面不存在</p>
                <el-button type="primary" size="small" @click="$router.push({ name: 'home' })">
                    返回首页
                </el-button>
            </div>
        </div>
    </div>
</template>

<script>
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'Error404'
})
</script>

<style lang="scss" scoped>
.error {
    width: 790px;
    margin: auto;
    margin-top: 50px;
    padding: 30px 0;
    img {
        float: left;
        width: 443px;
        height: 340px;
    }
    .errortxt {
        float: left;
        width: 300px;
        margin-top: 120px;
        margin-left: 40px;
    }
    h3 {
        font-weight: 600;
        font-size: 60px;
        letter-spacing: 5px;
        text-align: left;
    }
    p {
        color: #8a979e;
        font-size: 20px;
        line-height: 45px;
        text-align: left;
    }
}
</style>
