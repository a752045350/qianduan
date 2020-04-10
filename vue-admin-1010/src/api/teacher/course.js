import request from '@/utils/request'


export default {
    addCourseInfo(courseInfo){
        return request({
            url:'/eduService/course/addCourse',
            method:'post',
            //teacherQuery条件对象，后端使用RequestBody获取数据
            //data表示把对象转换json
            data:courseInfo
        
        })
    },

    updateCourseInfo(courseInfo){
        return request({
            url:'/eduService/course/updateCourse',
            method:'post',
            //teacherQuery条件对象，后端使用RequestBody获取数据
            //data表示把对象转换json
            data:courseInfo
        
        })
    },
    getCourseInfo(courseId){
        return request({
            url:'/eduService/course/getCourseInfo/' + courseId,
            method:'get',
            //teacherQuery条件对象，后端使用RequestBody获取数据
            //data表示把对象转换json
         })
    },
    getPublishCourseInfo(courseId){
        return request({
            url:'/eduService/course/getPublishCourseInfo/' + courseId,
            method:'get',
            //teacherQuery条件对象，后端使用RequestBody获取数据
            //data表示把对象转换json
         })
    },

    publishCourse(courseId){
        return request({
            url:'/eduService/course/publishCourse/' + courseId ,
            method:'get',
            //teacherQuery条件对象，后端使用RequestBody获取数据
            //data表示把对象转换json
         })
    },

    getCoursePagetList(current,limit,courseQuery){
        return request({
            url:'/eduService/course/listCourse/'+current+'/'+limit,
            method:'post',
            //teacherQuery条件对象，后端使用RequestBody获取数据
            //data表示把对象转换json
            data:courseQuery
        })
    },

    removeCourseById(id){
        return request({
            url:'/eduService/course/deleteCourse/' + id,
            method:'delete',
            //teacherQuery条件对象，后端使用RequestBody获取数据
            //data表示把对象转换json
          
        })
    },
}