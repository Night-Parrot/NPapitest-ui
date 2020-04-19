<template>
  <div class="homepage-hero-module">
    <div class="video-container">
      <div :style="fixStyle" class="filter">
      <video :style="fixStyle" autoplay loop class="fillWidth" v-on:canplay="canplay">
        <source src="../assets/golden-gate-bridge.mp4" type="video/mp4"/>
        浏览器不支持 video 标签，建议升级浏览器。
      </video>
      </div>
        <a class="link link--kukuri" href="#" data-letters="Night-Parrot·Api·Test" style="left: 22.5%;margin-top: 10%;margin-bottom: 0px">Night-Parrot·Api·Test</a>
        <div style="width: 600px;height: 350px;margin: 0 auto;transform: translateY(1%);" class="content">
          <div style="width: 500px;margin-left: 50px;padding-top: 50px">
            <p>(●′ω`●)需要账户请联系梁磊</p>
            <p>(●′ω`●)需要新增项目请联系梁磊，提供项目名称、所属开发团队、所属测试团队</p>
            <a-form 
              id="components-form-demo-normal-login"
              :form="form"
              class="login-form"
              @submit="handleSubmit"
            >
              <a-form-item>
                <a-input
                  v-decorator="[
                  'username',
                  { rules: [{ required: true, message: '请输入用户名!(..•˘_˘•..)' }] }
                ]"
                  placeholder="请输入用户名"
                >
                  <a-icon slot="prefix" type="user" style="color: rgba(0,0,0,.25);" />
                </a-input>
              </a-form-item>
              <a-form-item>
                <a-input
                  v-decorator="[
                  'password',
                  { rules: [{ required: true, message: '请输入密码! (￢_￢)' }] }
                ]"
                  type="password"
                  placeholder="请输入密码"
                >
                  <a-icon slot="prefix" type="lock" style="color: rgba(0,0,0,.25);" />
                </a-input>
              </a-form-item>
              <a-form-item>
                <a-button type="primary" html-type="submit" class="login-form-button" style="width: 45%;"  @click="guest_login">我是游客</a-button>
                <a-button type="primary" html-type="submit" class="login-form-button" style="width: 45%;margin-left: 50px">登录</a-button>
              </a-form-item>
            </a-form>
          </div>
          <!-- <a-button type="primary" html-type="submit" class="login-form-button" @click="logout">登 出</a-button> -->
        </div>
      <div class="poster hidden" v-if="!vedioCanPlay">
        <img :style="fixStyle" src="../assets/golden-gate-bridge.jpg" alt="">
      </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";
axios.defaults.withCredentials = true;
  export default {
    beforeCreate() {
      this.form = this.$form.createForm(this);
    },
    data() {
      return {
        vedioCanPlay: false,
        fixStyle: '',
        spell: ['Alchemy','Animagi','Apparating','Avada','Cruciatus','Imperious','Dark','Dark','Disapparate','Divination','Fidelius','Four','Impediment','Leprechaun','Occlumency','Parseltongue','Patronus','Polyjuice','Reductor','Shield','Side','Splinched','Transfiguration','Unbreakable','Morsmordre','Unforgivable','Aguamenti','Alohomora','Aparecium','Avada','Avis','Cave','Colloportus','Comfundo','Crucio','Deletrius','Densaugeo','Diffindo','Disillusionment','Dissendium','Enervate','Engorgio','Evanesco','Expecto','Expelliarmus','Ferula','Finite','Finite','Flagrate','Furnunculus','Homenum','Impedimenta','Imperio','Impervius','Incarcerous','Incendio','Liberacorpus','Legilimens','Levicorpus','Locomotor','Locomotor','Lumos','Metelojinx','Mobiliarbus','Mobilicorpus','Morsmordre','Nox','Obliviate','Orchideus','Pack','Peskipiksi','Petrificus','Point','Portus','Prior','Protego','Protego','Quietus','Reducio','Reducto','Relashio','Reparo','Repello','Rictusempra','Riddikulus','Salvio','Scourgify','Sectumsempra','Serpensortia','Silencio','Sonorus','Stupefy','Tarantallegra','Unplottable','Waddiwasi','Wingardium','Glisseo','Duro'],
      }
    },
    methods: {
      canplay() {
        this.vedioCanPlay = true
      },
      handleSubmit(e) {
        e.preventDefault();
        this.form.validateFields((err, values) => {
          if (!err) {
            axios.post("login", values).then(res => {
              if (res.data.result === "success") {
                // this.$cookies.set("status", "logined", 30 * 60); // 设置cookie中存放的生命周期
                let redirect = decodeURIComponent(this.$route.query.redirect || "/");
                this.$router.push({path: redirect});
              }else (
                this.$message.error(res.data.msg)
              ) 
            })
          }
        });
    },
    guest_login() {
      axios.post('login', { username: 'guest', password: '111111'}).then( res => {
        if (res.data.result === "success") {
          let redirect = decodeURIComponent(this.$route.query.redirect || "/");
          this.$router.push({path: redirect});
        }else (
          this.$message.error(res.data.msg)
        ) 
      })
    },
    },
    mounted: function() {
      window.onresize = () => {
        const windowWidth = document.body.clientWidth
        const windowHeight = document.body.clientHeight
        const windowAspectRatio = windowHeight / windowWidth
        let videoWidth
        let videoHeight
        if (windowAspectRatio < 0.5625) {
          videoWidth = windowWidth
          videoHeight = videoWidth * 0.5625
          this.fixStyle = {
            height: windowWidth * 0.5625 + 'px',
            width: windowWidth + 'px',
            'margin-bottom': (windowHeight - videoHeight) / 2 + 'px',
            'margin-left': 'initial'
          }
        } else {
          videoHeight = windowHeight
          videoWidth = videoHeight / 0.5625
          this.fixStyle = {
            height: windowHeight + 'px',
            width: windowHeight / 0.5625 + 'px',
            'margin-left': (windowWidth - videoWidth) / 2 + 'px',
            'margin-bottom': 'initial'
          }
        }
      }
      window.onresize();
    },
    Boring() {
      for(let i = 0; i<10; i++) {
          let x = Math.floor(Math.random() * (97 - 0 + 1)) + 0;
      }
    }
  }
</script>
<style scoped>
.homepage-hero-module,
.video-container {
  position: relative;
  bottom: 0%;
  left: 0%;
  height: 100%;
  width: 100%;
  overflow: hidden;
  background: #000;
}

.video-container .poster img,
.video-container video {
  z-index: 0;
  position: absolute;
}

.video-container .filter {
  position: absolute;
  background: rgba(0, 0, 0, 0.4);
}

#components-form-demo-normal-login .login-form {
  max-width: 300px;
}
#components-form-demo-normal-login .login-form-forgot {
  float: right;
}
#components-form-demo-normal-login .login-form-button {
  width: 45%;
}

.link {
  outline: none;
  text-decoration: none;
  position: relative;
  font-size: 8em;
  line-height: 1.5;
  color: #c2a712;
  display: inline-block;
}
.link--kukuri {
  /* text-transform: uppercase; */
  font-weight: 500;
  overflow: hidden;
  line-height: 1.5;
  color: #9db3a9;
}
 
.link--kukuri:hover {
  color: #b2b0a9;
}
 
.link--kukuri::after {
  content: '';
  position: absolute;
  height: 16px;
  width: 100%;
  top: 50%;
  margin-top: -8px;
  right: 0;
  background: #F9F9F9;
  transform: translate3d(-100%,0,0);
  transition: transform 0.4s;
  transition-timing-function: cubic-bezier(0.7,0,0.3,1);
}
 
.link--kukuri:hover::after {
  transform: translate3d(100%,0,0);
}
 
.link--kukuri::before {
  content: attr(data-letters);
  position: absolute;
  z-index: 2;
  overflow: hidden;
  color: #424242;
  white-space: nowrap;
  width: 0%;
  transition: width 0.4s 0.3s;
}
 
.link--kukuri:hover::before {
  width: 100%;
}

.content {
    z-index: 1;
}
.content:after {
    content: '';
    position: absolute;
    filter: blur(40px);
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(255, 230, 230, 0.8);
    z-index: -1;
}
</style>