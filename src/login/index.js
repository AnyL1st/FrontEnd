import { checkPhone, checkCode } from "@/utils/check.js";
import { myAlert } from "@/utils/alert.js"
import axios from "@/utils/request.js"

if (process.env.NODE_ENV === 'production') {
    console.log = function () { }
}

console.log(checkPhone('17608901506'));
console.log(checkCode('199910'));

document.querySelector('.btn').addEventListener('click', e => {
    const phone = document.querySelector('[name="mobile"]').value
    const code = document.querySelector('[name="code"]').value
    if (!checkPhone(phone)) {
        myAlert(false, '手机号须为11位数字！')
        return
    }
    if (!checkCode(code)) {
        myAlert(false, '验证码须为6位数字！')
        return
    }
    axios({
        url: '/v1_0/authorizations',
        method: 'post',
        data: {
            mobile: phone,
            code: code
        }
    }).then((res) => {
        myAlert(true, '登录!')
        localStorage.setItem('token',res.data.token)
        setTimeout(() => {
            location.href='../content/index.html'
        }, 1500);
    }).catch(error => {
        myAlert(false, error)
        console.log(error);
    })
})


import "bootstrap/dist/css/bootstrap.min.css"
import "./index.css"
