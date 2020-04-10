<template>

  <div class="app-container">

    <h2 style="text-align: center;">发布新课程</h2>

    <el-steps :active="1" process-status="wait" align-center style="margin-bottom: 40px;">
      <el-step title="填写课程基本信息"/>
      <el-step title="创建课程大纲"/>
      <el-step title="提交审核"/>
    </el-steps>

    <el-form label-width="120px">

        <el-form-item label="课程标题">
            <el-input v-model="courseInfo.title" placeholder=" Java基础学习"/>
        </el-form-item>

        <!-- 所属分类 TODO -->

        <!-- 课程讲师 TODO -->
        <el-form-item label="课程讲师">
        <el-select
            v-model="courseInfo.teacherId"
            placeholder="讲师名称">
            <el-option
            v-for="teacher in teacherList"
            :key="teacher.id"
            :label="teacher.name"
            :value="teacher.id"/>
        </el-select>
        </el-form-item>

        <el-form-item label="课程分类">
        <el-select
            v-model="courseInfo.subjectParentId"
            placeholder="一级分类"
            @change="subjectLevelOneChange">
            <el-option
            v-for="subject in subjectOneList"
            :key="subject.id"
            :label="subject.title"
            :value="subject.id"/>
        </el-select>
       
        <el-select
            v-model="courseInfo.subjectId"
            placeholder="二级分类">
            <el-option
            v-for="subject in subjectTwoList"
            :key="subject.id"
            :label="subject.title"
            :value="subject.id"/>
        </el-select>
        </el-form-item>


        <el-form-item label="总课时">
            <el-input-number :min="0" v-model="courseInfo.lessonNum" controls-position="right" placeholder="请填写课程的总课时数"/>
        </el-form-item>

        <!-- 课程简介 TODO -->
       <el-form-item label="课程简介">
          <tinymce :height="300" v-model="courseInfo.description"/> 
      </el-form-item>

        <!-- 课程封面 TODO -->
        <!-- 课程封面-->
      <el-form-item label="课程封面">

        <el-upload
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            :action="BASE_API+'/eduoss/fileoss/upload'"
            class="avatar-uploader">
            <img :src="courseInfo.cover">
        </el-upload>

    </el-form-item>


        <el-form-item label="课程价格">
            <el-input-number :min="0" v-model="courseInfo.price" controls-position="right" placeholder="免费课程请设置为0元"/> 元
        </el-form-item>

        <el-form-item>
            <el-button :disabled="saveBtnDisabled" type="primary" @click="next">保存并下一步</el-button>
        </el-form-item>
    </el-form>
  </div>
</template>
<script>
import course from '@/api/teacher/course'
import teacher from '@/api/teacher/teacher'
import subject from '@/api/teacher/subject'
import Tinymce from '@/components/Tinymce'
const defaultForm = {
  title: '',
  subjectId: '',
  subjectParentId:'',
  teacherId: '',
  lessonNum: 0,
  description: '',
  cover: '/static/uu.jpg',
  price: 0
}

export default {
  components:{Tinymce},
  data() {
    return {
      saveBtnDisabled: false, // 保存按钮是否禁用
      courseInfo:defaultForm,
      teacherList:[],
      subjectOneList:[],
      subjectTwoList:[],
      BASE_API: process.env.BASE_API, // 接口API地址
      courseId:'',
    }
  },

  created() {
   console.log('info created')

   
   this.init(),
   this.getTree()
  },

   watch:{
          $route(to,from){
            //路由发生变化，方法就会执行
            this.inits()
          }
        },


  methods: {
      //上传文件之前
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg'
        const isLt2M = file.size / 1024 / 1024 < 2

        if (!isJPG) {
            this.$message.error('上传头像图片只能是 JPG 格式!')
        }
        if (!isLt2M) {
            this.$message.error('上传头像图片大小不能超过 2MB!')
        }
        return isJPG && isLt2M
        },

    handleAvatarSuccess(res, file) {
        console.log(res)// 上传响应
        console.log(URL.createObjectURL(file.raw))// base64编码
        this.courseInfo.cover = res.data.url
        },    

     //获取二级目录
     subjectLevelOneChange(id){
         for(let i = 0;i < this.subjectOneList.length;i++){
             if(id == this.subjectOneList[i].id){
                 this.subjectTwoList = this.subjectOneList[i].children
                 this.courseInfo.subjectId =''
             }
         }
     } ,
    //获取所有讲师
    init(){
         teacher.getAllTeacher()
            .then(response =>{
                this.teacherList = response.data.item;
                 console.log("ssssssssss",this.teacherList)
                 if(this.$route.params && this.$route.params.id){
                    const id = this.$route.params.id
                    console.log("idsssssssss",id)
                    this.getInfo(id)
                 }
            })
            .catch(response => {
                this.$message({
                type: 'error',
                message: '网络不好，请稍后'
             })
            })
     },
    //获取所有课程分类
     getTree(){
         subject.getTreeSubject()
            .then(response =>{
                this.subjectOneList = response.data.items;
            })
        },

    //保存课程
     saveOrUpdate(){
        course.addCourseInfo(this.courseInfo)
         .then(response =>{
             console.log(response.data.id)
              this.$message({
               type:'success',
               message:'添加成功'
          })
          return response
          })
          .then(response =>{
            console.log(response.data)
            this.$router.push({ path: '/course/chapter/' + response.data.id })
          })
          .catch(response =>{
              this.$message({
                type: 'error',
                message: response.message
            })
          })
      },

      inits(){
          if(!(this.$route.params && this.$route.params.id)){
            this.courseInfo = {};
          }
        },

      getInfo(id){
        course.getCourseInfo(id)
          .then(response =>{
              this.courseInfo = response.data.courseInfo;
              console.log("consloe",this.courseInfo)
              //1.查询所有的分类，包含一级和二级
              subject.getTreeSubject()
                .then(response => {
                  this.subjectOneList = response.data.items;
                  for(let i =0;i<this.subjectOneList.length;i++){
                      //获取每个一级分类
                      var onesubject = this.subjectOneList[i];
                      if(this.courseInfo.subjectParentId == onesubject.id){
                        //获取一级分类所有二级菜单
                        console.log("sss",onesubject.children)
                        this.subjectTwoList = onesubject.children
                      }
                  }
                })


          })
      },      

    next() {
      console.log('next')
      this.saveBtnDisabled = true
      if (!this.courseInfo.id) {
        this.saveOrUpdate()
      } else {
        this.updateData()
      }
    },

     updateData() {
       course.updateCourseInfo(this.courseInfo)
       .then(response => {
         this.$message({
            type:"success", 
            message:'修改课程成功'
          })
          return response
          })
          .then(response =>{
             this.$router.push({ path: '/course/chapter/' +this.$route.params.id})
          }).catch(response =>{
                  this.$message({
                  type:"success", 
                  message:'修改课程失败'
          })
          })


     
    }
  }
}
</script>
<style scoped>
.tinymce-container {
  line-height: 29px;
}
</style>