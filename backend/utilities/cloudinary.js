import { v2 as cloudinary } from "cloudinary";
import fs from "fs"

// Configuration
cloudinary.config({ 
    cloud_name: 'dlmfptlwz', 
    api_key: '975941284518855', 
    api_secret: "F5jNJIA4k5VjRzBzAoeIFzVEJ-c"// Click 'View API Keys' above to copy your API secret
})
export const uploadOnClodinary = async(localFilePath) => {
    try{
        if(!localFilePath) return null;

        //upload
        const response = await cloudinary.uploader.upload(localFilePath , {
            resource_type : "auto"
        })
        fs.unlinkSync(localFilePath);
        console.log("Connection success");
        return response;

    }
    catch(error){
        
        return null;
    }
      
    
    // catch(error){
        

    //     return null;
    // }
}