import request from '@/utils/request'


export default {
    getTeacherPagetList(current,limit,teacherQuery){
        return request({
            url:'/eduService/teacher/pageTeacher/'+current+'/'+limit,
            method:'post',
            //teacherQuery条件对象，后端使用RequestBody获取数据
            //data表示把对象转换json
            data:teacherQuery
        })
    },

    removeById(teacherId) {
        return request({
            url: '/eduService/teacher/' + teacherId,
            method: 'delete'
        })
    },

    addTeacher(teacher){
        return request({
            url: '/eduService/teacher/addTeacher',
            method: 'post',
            data:teacher
        })
    },
    getTeacherInfo(id){
        return request({
            url:'/eduService/teacher/getTeacher/' + id,
            method:'get',

        })
    },
    getAllTeacher(){
        return request({
            url:'/eduService/teacher/findAll',
            method:'get',
        })
    },
    updateTeacherInfo(teacher){
        return request({
            url:'/eduService/teacher/updateTeacher/',
            method:'post',
            data:teacher
        })
    }

}