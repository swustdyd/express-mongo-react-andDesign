import nodemailer from 'nodemailer'

/**
 * 公共邮箱
 */
const accountFrom = 'swustdyd@163.com';
/**
 * 公共邮箱密码
 */
const pwd = 'qwertyuiop123';
/**
 * 邮件发送
 */
const transporter = nodemailer.createTransport({
    host: 'smtp.163.com',
    port: 465,
    secure: true, // secure:true for port 465, secure:false for port 587
    auth: {
        user: accountFrom, // generated ethereal user
        pass: pwd // generated ethereal password
    }
});


export default class EmailUtil{
    /**
     * 发送邮件
     * @param {*} mailOption 邮件配置
     */
    static sendEmail(mailOption){
        const finaloption = {
            from: accountFrom,
            ...mailOption
        }
        return new Promise((resolve, reject) => {          
            transporter.sendMail(finaloption, (error, info) => {
                if(error){
                    reject(error);
                }
                resolve(info);
            })
        })
    }
}