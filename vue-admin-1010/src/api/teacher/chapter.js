import request from '@/utils/request'


export default {
    getTreeChapter(courseId){
        return request({
            url:'/eduService/chapter/getChapterVideo/'+courseId,
            method:'get',
            //teacherQuery条件对象，后端使用RequestBody获取数据
            //data表示把对象转换json
        
        })
    },
    saveChapter(eduChapter){
        return request({
            url:'/eduService/chapter/addChapter/',
            method:'post',
            data:eduChapter 
        })
    },
    getChapterById(chapterId){
        return request({
            url:'/eduService/chapter/getChapterInfo/' + chapterId,
            method:'get',
            
        })
    },
    updateChapter(eduChapter){
        return request({
            url:'/eduService/chapter/updateChapter',
            method:'post',
            data:eduChapter
            
        })
    },
    deleteChapter(id){
        return request({
            url:'/eduService/chapter/deleteChapter/' + id,
            method:'delete',
         })
    },
}