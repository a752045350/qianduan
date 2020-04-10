<template>

  <div class="app-container">

    <h2 style="text-align: center;">发布新课程</h2>

    <el-steps :active="2" process-status="wait" align-center style="margin-bottom: 40px;">
      <el-step title="填写课程基本信息"/>
      <el-step title="创建课程大纲"/>
      <el-step title="提交审核"/>
    </el-steps>

    <el-form label-width="120px">


      <el-button type="text" @click="openAndFlush">添加章节</el-button>
      <!-- 章节 -->
      <ul class="chanpterList">
          <li
              v-for="chapter in chapterNestedList"
              :key="chapter.id">
              <p>
                  {{ chapter.title }}

                  <span class="acts">
                      <el-button type="text" @click="openVideo(chapter.id)">添加课时</el-button>
                      <el-button style="" type="text" @click="openEdirChapter(chapter.id)">编辑</el-button>
                      <el-button type="text" @click="deleteChapter(chapter.id)">删除</el-button>
                  </span>
              </p>

              <!-- 视频 -->
              <ul class="chanpterList videoList">
                  <li
                      v-for="video in chapter.children"
                      :key="video.id">
                      <p>{{ video.title }}
                          <span class="acts">
                              <el-button type="text" @click="openEditVideo(video.id)">编辑</el-button>
                              <el-button type="text" @click="removeVideo(video.id)">删除</el-button>
                          </span>
                      </p>
                  </li>
              </ul>
          </li>
      </ul>
        <el-dialog :visible.sync="dialogChapterFormVisible" title="添加章节">
            <el-form :model="chapter" label-width="120px">
                <el-form-item label="章节标题">
                    <el-input v-model="chapter.title"/>
                </el-form-item>
                <el-form-item label="章节排序">
                    <el-input-number v-model="chapter.sort" :min="0" controls-position="right"/>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogChapterFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveOrUpdate">确 定</el-button>
            </div>
        </el-dialog>
        
        <el-dialog :visible.sync="dialogVideoFormVisible" @click="openVideo(chapter.id)" title="添加课时">
          <el-form :model="video" label-width="120px">
            <el-form-item label="课时标题">
              <el-input v-model="video.title"/>
            </el-form-item>
            <el-form-item label="课时排序">
              <el-input-number v-model="video.sort" :min="0" controls-position="right"/>
            </el-form-item>
            <el-form-item label="是否免费">
              <el-radio-group v-model="video.free">
                <el-radio :label="true">免费</el-radio>
                <el-radio :label="false">默认</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="上传视频">
              <!-- TODO -->
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogVideoFormVisible = false">取 消</el-button>
            <el-button :disabled="saveVideoBtnDisabled" type="primary" @click="saveOrUpdateVideo">确 定</el-button>
          </div>
        </el-dialog>

      <el-form-item>
        <el-button @click="previous">上一步</el-button>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="next">下一步</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import chapter from '@/api/teacher/chapter'
import video from '@/api/teacher/video'
export default {
  data() {
    return {
      courseId: '', // 所属课程
      chapterNestedList: [], // 章节嵌套课时列表
      saveBtnDisabled: false, // 保存按钮是否禁用
      dialogChapterFormVisible:false,
      dialogVideoFormVisible: false,
      chapter:{
         title: '',
         sort: 0
       },
       video: {// 课时对象
        title: '',
        sort: 0,
        free: 0,
        videoSourceId: '',
        chapterId:''
      },
      saveVideoBtnDisabled:false

  }
  },

  created() {
    console.log('chapter created')
    if(this.$route.params && this.$route.params.id){
      this.courseId = this.$route.params.id
    }
    this.getChapterList(this.courseId)
  },

  methods: {

    removeVideo(videoId){
       this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          return video.removeVideoById(videoId)
        }).then(() => {
          this.getChapterList(this.courseId)
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        }).catch((response) => { // 失败
          if (response === 'cancel') {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          }
        })
    },


    openVideo(chapterId){
      console.log("aa",chapterId)
      this.dialogVideoFormVisible = true
      this.chapterId = chapterId
    },

    saveOrUpdateVideo(){
      console.log(this.video.id)
      if(this.video.id){
        this.updateVideo()
      }else{
        this.addVideo();
      }

    },

    //添加小节
    addVideo(){
      this.video.courseId = this.courseId
      this.video.chapterId = this.chapterId
      console.log(this.chapter.id)
      console.log("video",this.video)
      video.addVideo(this.video)
        .then(response =>{
           this.$message({
              type:'success',
              message:'添加成功'
           })
         this.getChapterList(this.courseId)
         this.dialogVideoFormVisible = false;  

        })
    },
    //修改小节
    updateVideo(){
      video.updateVideo(this.video)
        .then(response => {
          this.$message({
            type:'success',
            message:'修改成功'
          })
           this.dialogVideoFormVisible = false;  
            this.getChapterList(this.courseId)
        }).catch(response => {
           this.$message({
             type:'error',
             message:'修改失败'
           }) 
           
        })
    },
    openEditVideo(id){
      this.dialogVideoFormVisible = true
      video.getVideoById(id)
        .then(response => {
          this.video = response.data.videos
        })

      console.log(this.video)
    },


     //=====================================章节部分===========================
    //编辑章节
    openEdirChapter(id){
      this.dialogChapterFormVisible = true
      console.log("sssa",id)
      chapter.getChapterById(id)
        .then(response => {
          this.chapter = response.data.eduChapter

        })
    },

    //获取课程分类列表
    getChapterList(id){
      chapter.getTreeChapter(id)
        .then(response => {
          this.chapterNestedList = response.data.items
        }).catch({

        })
    },
    
    openAndFlush(){
      this.chapter = {}
      console.log(this.chapter)
      this.dialogChapterFormVisible = true;
      
    },
    
    addChapter(){
      this.chapter.courseId = this.$route.params.id
      chapter.saveChapter(this.chapter)
        .then(response => {
            this.$message({
              type:'success',
              message:'添加成功'
            });
        this.dialogChapterFormVisible = false
        this.getChapterList(this.courseId)
        }).catch(response => {
             this.$message({
              type:'error',
              message:'添加失败'
            })
        })
    },

    updateChapters(){
      chapter.updateChapter(this.chapter)
        .then(response => {
          this.$message({
            type:'success',
            message:'成功'
          })
         this.dialogChapterFormVisible = false 
         this.getChapterList(this.courseId)
        })
    },

    saveOrUpdate(){
      console.log("dassadas",this.chapter.id)
      if(this.chapter.id){
        console.log(this.chapter.id)
        this.updateChapters()
      }else{
        this.addChapter()
      }
      
     },
     
     deleteChapter(id){
        chapter.deleteChapter(id)
          .then(response => {
             this.$message({
               type:'success',
               message:'删除成功'
             })
             this.getChapterList(this.courseId)
          })
     },

    previous() {
      console.log('previous')
      this.$router.push({ path: '/course/info/'+this.courseId })
    },

    next() {
      console.log('next')
      this.$router.push({ path: '/course/publish/'+this.courseId })
    }
   
  }
}
</script>