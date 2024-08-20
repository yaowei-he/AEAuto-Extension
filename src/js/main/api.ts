import axios from "axios";

const baseUrl = "http://localhost:8000"

interface msgFormat {
    id: string;
    content: string;
    user: string;
}

interface autoFormat {
    content: string;
    category: string;
    time: string;
}

// AE测试用
export const fakeApi = async({id,content,user}:msgFormat) => {
    try {
        const t = localStorage.getItem("token");
        if(t){

            const res = await axios.post(baseUrl+`/api/msgs/ae/`,{
                id,content,user
            },
        {
            headers:{
                "Authorization":t,
                "Content-Type": "application/json",
                "accept":"application/json",
            }
        });
            // current usage + 1
            return res.data;
        }
    } catch (error) {
        console.error(error);
    }
};


// AE表达式---示例
export const expressionApi = async({time,content,category}:autoFormat) => {
    try {
        const t = localStorage.getItem("token");
        if(t){
            const uid = localStorage.getItem("uid");
            const res = await axios.post(baseUrl+`/api/msgs/${uid}/expressions/`,{
                time,content,category
            },
        {
            headers:{
                "Authorization":t,
                "Content-Type": "application/json",
                "accept":"application/json",
            }
        });
            return res.data;
        }
    } catch (error) {
        console.error(error);
    }
};


  
// AE自动化MG
export const autoApi = async({time,content,category}:autoFormat) => {
    try {
        const t = localStorage.getItem("token");
        if(t){
            const uid = localStorage.getItem("uid");
            const res = await axios.post(baseUrl+`/api/msgs/${uid}/ae/`,{
                time,content,category
            },
        {
            headers:{
                "Authorization":t,
                "Content-Type": "application/json",
                "accept":"application/json",
            }
        });
            console.log(res.data);
            return res.data;
        }
    } catch (error) {
        console.error(error);
    }
};


// 用户聊天机器人
export const chatApi = async({time,content,category}:autoFormat) => {
    try {

        const t = localStorage.getItem("token");
        if(t){
            const uid = localStorage.getItem("uid");
            await axios.post(baseUrl+`/api/msgs/${uid}/chat/`,{
                time,content,category
            },
            {
                headers:{
                    "Authorization":t,
                }
            });

            // return res.data;

            // 发送stream请求

        }
    } catch (error) {
        console.error(error);
    }

};


interface userFormat {
    username: string;
    password: string;
}

// 用户添加
export const addUser = async({username,password}:userFormat) => {
    try {
        const res = await axios.post(baseUrl+`/api/users/`,{
            username,password
        });

        // 用户自动认证
        if(res.data) {

            // id存储
            const uid = res.data.id;
            localStorage.setItem('uid', uid);

            // 存储用户信息
            const userInfor = {
                "username": res.data.username,
                "level": res.data.level,
                "is_admin": res.data.is_admin,
                "current_usage": res.data.current_usage,
                "max_usage": res.data.max_usage
            }
            localStorage.setItem('userInfor',JSON.stringify(userInfor));
            // 获取token
            const data = new URLSearchParams();
            data.append('username',username);
            data.append('password',password);

            const rawToken = await fetch(baseUrl+"/token",{
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: data
            });
            const token = await rawToken.json();
            const access_token = token.access_token;
            const bearToken = "Bearer "+access_token;

            //存储在localstorage中
            localStorage.setItem("token", bearToken);
        } else {
            console.log("失败");
        }
    } catch (error) {
        console.error(error);
    }
}


// 用户登录
export const authUser = async({username,password}:userFormat) => {
try {

    // 获取token
    const data = new URLSearchParams();
    data.append('username',username);
    data.append('password',password);

    const rawToken = await fetch(baseUrl+"/token",{
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: data
    });

    if(rawToken){

    
    const token = await rawToken?.json();

    const access_token = token.access_token;
    const bearToken = "Bearer "+access_token;

    //存储在localstorage中
    localStorage.setItem("token", bearToken);

    // 获取用户信息

    const res = await axios.get(baseUrl+"/api/users/me/", {
        headers:{
            "Authorization":bearToken,
            "Content-Type": "application/json",
            "accept":"application/json",
        }
    })

    if(res.data){
        // 用户信息存储

        // 存储用户信息
        const userInfor = {
            "username": res.data.username,
            "level": res.data.level,
            "is_admin": res.data.is_admin,
            "current_usage": res.data.current_usage,
            "max_usage": res.data.max_usage
        }
        localStorage.setItem('uid', res.data.id);
        localStorage.setItem('userInfor',JSON.stringify(userInfor));
    
    } else {
        console.log("用户未找到!");
    }
} else {
        console.log("错误");
    }
} catch (error) {
    console.error(error);
}
};

// 实时监测usage
export const getUserUsage = async() => {

    try {
        const t = localStorage.getItem("token");
        if(t){
            const res = await axios.get(baseUrl+"/api/users/me/", {
                headers:{
                    "Authorization":t,
                    "Content-Type": "application/json",
                    "accept":"application/json",
                    }
            })
            let usage = res.data.current_usage;
            let maxUsage = res.data.max_usage;
            return {usage, maxUsage};
        }
    } catch (error) {
        
    }
}

