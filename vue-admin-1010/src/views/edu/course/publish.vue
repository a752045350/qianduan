<template>

  <div class="app-container">

    <h2 style="text-align: center;">发布新课程</h2>

    <el-steps :active="3" process-status="wait" align-center style="margin-bottom: 40px;">
      <el-step title="填写课程基本信息"/>
      <el-step title="创建课程大纲"/>
      <el-step title="发布课程"/>
    </el-steps>

    <div class="ccInfo">
      <img :src="coursePublish.cover">
      <div class="main">
        <h2>{{ coursePublish.title }}</h2>
        <p class="gray"><span>共{{ coursePublish.lessonNum }}课时</span></p>
        <p><span>所属分类：{{ coursePublish.subjectLevelOne }} — {{ coursePublish.subjectLevelTwo }}</span></p>
        <p>课程讲师：{{ coursePublish.teacherName }}</p>
        <h3 class="red">￥{{ coursePublish.price }}</h3>
      </div>
    </div>

    <div>
      <el-button @click="previous">返回修改</el-button>
      <el-button :disabled="saveBtnDisabled" type="primary" @click="publish">发布课程</el-button>
    </div>
  </div>
</template>


<script>
import course from '@/api/teacher/course'
import teacher from '@/api/teacher/teacher'
import subject from '@/api/teacher/subject'

export default {
  data() {
    return {
      saveBtnDisabled: false, // 保存按钮是否禁用
      courseId:'',
      coursePublish:{},
  }
  },

  created() {
    if(this.$route.params && this.$route.params.id){
      this.courseId = this.$route.params.id
      this.getPublishCourse()
    }
    console.log('publish created')
  },

  methods: {

    getPublishCourse(){
      course.getPublishCourseInfo(this.courseId)
        .then(response => {
          this.coursePublish = response.data.publishVideo;
        })
    },

   

    previous() {
      console.log('previous')
      this.$router.push({ path: '/course/chapter/'+this.courseId })
    },

    publish() {
      console.log('publish')
       course.publishCourse(this.courseId)
        .then(response => {
          this.$message({
            type:'success',
            messahe:'发布成功'
          })
        this.$router.push({ path: '/course/list' })
        }).catch(response => {
          this.$message({
            type:'error',
            message:'发布失败'
          })
        })
     
    }
  }
}
</script>