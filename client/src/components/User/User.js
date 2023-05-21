import axios from 'axios';
import {useState} from 'react'
const User = ()=>{
    const [userInfo, setUserInfo] = useState('');

    const getReq = axios.create({baseURL:"http://localhost:5000/auth"})

    const handler = ()=>{
        getReq.post('test').then((res)=>{console.log(res.data);
            setUserInfo(res.data);console.log(userInfo)})
            .catch((err)=>console.log(err))
    }
    return(
        <>
        <button onClick ={handler}>Check</button>
        </>
    )
}
export default User;