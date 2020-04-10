import request from '@/utils/request'


export default {
    getTreeSubject(){
        return request({
            url:'/eduService/subject/getTree',
            method:'get',
            //teacherQuery条件对象，后端使用RequestBody获取数据
            //data表示把对象转换json
        
        })
    },
}