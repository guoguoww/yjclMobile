<template>
    <section>
      <van-nav-bar
        title="忘记密码"
        left-arrow
        fixed
        @click-left="$back()"
      />
      <div class="content">
        <ul class="form">
          <li>
            <span>手机号</span>
            <input type="text" placeholder="请输入您的手机号" v-model="submitData.phone">
          </li>
          <li>
            <span>图片验证码</span>
            <input type="text" placeholder="请输入验证码" class="code" v-model="submitData.code">
            <img :src="yamPic" alt="" @click="getPicYzm">
          </li>
          <li>
            <span>短信验证码</span>
            <input type="text" placeholder="请输入验证码" class="code" v-model="submitData.phoneCode">
            <button class="border-btn code-btn" :class="!codedisable? '':'disabled'"  :disabled='codedisable' @click="getPhoneCode()">{{isNaN(codetext) ? codetext : codetext + '秒'}}</button>
          </li>
          <li>
            <span>新密码设置</span>
            <input :type="pwdVisual? 'text': 'password'" placeholder="请输入新密码" v-model="submitData.password">
            <i :class="pwdVisual? 'icon-visible' : 'icon-invisible'" @click="pwdVisual = !pwdVisual"></i>
          </li>
        </ul>
        <ul class="form">
          <li>
            <span>新密码确认</span>
            <input :type="confirmPwdVisual? 'text': 'password'" placeholder="请再次输入新密码" v-model="confirmPwd">
            <i :class="confirmPwdVisual? 'icon-visible' : 'icon-invisible'" @click="confirmPwdVisual = !confirmPwdVisual"></i>
          </li>
        </ul>
        <div class="submitBtn">
          <button class="forget_btn" @click="forget">确定</button>
        </div>
      </div>
    </section>
</template>

<script>
  export default {
    name: "forget",
    data() {
      return {
        yamPic: '', //图片验证码
        pwdVisual: false, //密码查看
        confirmPwdVisual: false, //确认密码查看
        submitData: {
          phone: '', //手机号
          password: '', //新密码
          code: '', //图片验证码
          phoneCode: '', //短信验证码
        },
        confirmPwd: '', //用于确认密码
        timer: null, //短信验证码定时器
        codetext: '获取验证码', //短信验证码文字信息
        codedisable: false ,//验证码按钮禁用
      }
    }, mounted() {
      this.getPicYzm()
    },
    methods: {
      getPicYzm() { //获取图片验证码
        this.yamPic = `${process.env.BASEURL}/api/common/verify?v=${Math.random()}`;
      },
      getPhoneCode() { //获取短信验证码
        if(!this.submitData.phone) {
          this.$toast('手机号不能为空');
          return
        }
        if(!/^[1][3,4,5,6,7,8][0-9]{9}$/.test(this.submitData.phone)) {
          this.$toast('手机号码格式不正确');
          return
        }
        if(!this.submitData.code) {
          this.$toast('图片验证码不能为空');
          return
        }
        this.$axios({
          url: "/api/common/sendCode",
          method: "post",
          params: {
            phone: this.submitData.phone,
            code: this.submitData.code,
          }
        }).then(res=> {
          if (res.data.code === 0) {
            this.$toast('发送成功');
            this.codedisable = true;
            this.codetext = 300;
            this.timer = setInterval(() => {
              if (this.codetext > 0 && this.codetext <= 300 > 0 && this.codetext <= 300) {
                this.codetext--
              } else {
                this.codedisable = false;
                this.codetext = '重新获取';
                this.submitData.code = '';
                this.getPicYzm();
                clearInterval(this.timer);
                this.timer = null
              }
            }, 1000)
          }
        })
      },
      forget() {
        if(!this.submitData.phone) {
          this.$toast('手机号不能为空');
          return
        }
        if(!/^[1][3,4,5,6,7,8][0-9]{9}$/.test(this.submitData.phone)) {
          this.$toast('手机号码格式不正确');
          return
        }
        if(!this.submitData.code) {
          this.$toast('图片验证码不能为空');
          return
        }
        if(!this.submitData.phoneCode) {
          this.$toast('手机验证码不能为空');
          return
        }
        if(!this.submitData.password) {
          this.$toast('密码不能为空');
          return
        }
        if(this.confirmPwd !== this.submitData.password) {
          this.$toast('两次密码输入不同');
          return
        }
        this.$axios({
          url: '/api/user/rePwd',
          method: 'post',
          data: this.submitData
        }).then(res => {
          if(res.data.code === 0) {
            this.$toast('密码重置成功')
            this.$router.push('/login')
          }
        })
      }
    },
  }
</script>

<style scoped>
  /*输入框*/
  .form {
    background-color: #fff;
    margin-bottom: 0.8rem;
  }
  .form li {
    display: flex;
    align-items: center;
    padding: 0 1.35rem;
    border-bottom: 1px solid #f1f2f3;
    font-size: 1rem;
    height: 3.3rem;
  }
  .form li span {
    display: inline-block;
    width: 30%;
    font-size: 0.9rem;
    text-align: left;
  }
  .form li input {
    width: 70%;
    font-size: 0.9rem;
    outline: none;
    border: none;
    padding: 0;
    border-radius: 0.3rem;
    box-sizing: border-box;
    line-height: 1;
  }
  /*获取验证码列的input*/
  .form li input.code {
    width: 45%;
  }
  .form li i {
    color: #ff5e00;
    font-size: 0.9rem;
  }
  .form li img {
    width: 26%;
    height: 70%;
  }
  /*获取验证码按钮*/
  .form li .code-btn{
    border-radius: 100px;
    width: 27%;
    font-size: 0.6rem;
    height: 2rem;
    line-height: 2rem;
    background-color: #ff5e00;
    padding: 0 0.5rem;
    text-align: center;
    outline: none;
    color: #fff;
    border: 1px solid #ff5e00;
    overflow:hidden;
    text-overflow:ellipsis;
    white-space:nowrap;
  }
  /*提交按钮*/
  .submitBtn {
    padding: 1.3rem;
  }
  .submitBtn .forget_btn {
    background-color: #ff5e00;
    border-radius: 0.3rem;
    color: #fff;
    height: 2.6rem;
    line-height: 2.6rem;
    padding: 0 0.8rem;
    font-size: 0.9rem;
    text-align: center;
    outline: none;
    border: none;
    display: block;
    width: 100%;
  }

  .disabled {
    background: #c7c7c7 !important;
    border: 1px solid #c7c7c7 !important;
    color: #fff !important;
  }
</style>
