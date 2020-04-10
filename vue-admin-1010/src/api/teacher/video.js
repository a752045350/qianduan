import request from '@/utils/request'


export default {
    getVideos(chapterId){
        return request({
            url:'/eduService/video/getVideo' + chapterId,
            method:'get',
            //teacherQuery条件对象，后端使用RequestBody获取数据
            //data表示把对象转换json
        
        })
    },

    addVideo(video){
        return request({
            url:'/eduService/video/addVideo',
            method:'post',
            //teacherQuery条件对象，后端使用RequestBody获取数据
            //data表示把对象转换json
            data:video
        })
    },
    updateVideo(video){
        return request({
            url:'/eduService/video/update',
            method:'post',
            //teacherQuery条件对象，后端使用RequestBody获取数据
            //data表示把对象转换json
            data:video
        })
    },
    removeVideoById(id){
        return request({
            url:'/eduService/video/deleteVideo/' + id,
            method:'delete',
            //teacherQuery条件对象，后端使用RequestBody获取数据
            //data表示把对象转换json
          
        })
    },

    getVideoById(id){
        return request({
            url:'/eduService/video/getVideoById/' + id,
            method:'get',
            //teacherQuery条件对象，后端使用RequestBody获取数据
            //data表示把对象转换json
          
        })

    }
}