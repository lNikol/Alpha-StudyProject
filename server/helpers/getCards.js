import {server_folder} from '../config'
import createCards from './createCards';
export default function getCards(req, res, fs){
    let {userFile} = req.files;
    if (userFile){
        fs.existsSync(server_folder)?"":fs.mkdirSync(server_folder);
        let filePath = `${server_folder}/${userFile.name}`;
        userFile.mv(filePath, (err)=>{
            if(err) res.status(400).json({message:"Error in save userFile"});
        })
        createCards(filePath);
    }
    else{
        res.status(400).json({message:"UserFile wasn't found"})
    }
}