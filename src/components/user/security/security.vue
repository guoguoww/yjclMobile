<template>
    <section>
      <van-nav-bar
        title="账号安全"
        left-arrow
        fixed
        @click-left="$back()"
      />
      <div class="content">
        <ul>
          <li>
            <router-link to="/verified"><i class="icon-verified"></i><p>实名认证</p></router-link>
          </li>
          <li>
            <router-link to="/modifyPhone"><i class="icon-remove"></i><p>绑定手机</p></router-link>
          </li>
          <li>
            <router-link to="/modifyPwd"><i class="icon-pass"></i><p>修改密码</p></router-link>
          </li>
        </ul>
      </div>
    </section>
</template>

<script>
  export default {
    name: "security"
  }
</script>

<style scoped>
  ul {
    margin-top: 0.7rem;
  }
  ul li {
    padding-left: 1rem;
    background-color: #fff;
    border-bottom: 1px solid #f1f2f3;
  }
  ul li a {
    display: flex;
    align-items: center;
    flex-basis: 100%;
    padding: 1.4rem 0;
    position: relative;
  }
  ul li a:after {
    content: "\E930";
    font-family: icomoon;
    color: #e0e0e0;
    font-size: 0.9rem;
    text-align: right;
    padding-right: 1.8rem;
    position: absolute;
    right: 0;
  }
  ul li a i {
    color: #ff5e00;
    font-size: 1.2rem;
    width: 10%;
    display: inline-block;
  }
  ul li a p {
    font-size: 0.8rem;
    color: #212121;
    padding: 0;
    margin: 0;
  }
</style>
