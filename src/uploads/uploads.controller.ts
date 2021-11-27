import { Controller, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import * as AWS from 'aws-sdk';

const BUCKET_NAME = 'sharemusle'

@Controller('uploads')
export class UploadsController {
    @Post('')
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(@UploadedFile() file) {
      AWS.config.update({
        credentials:{
            accessKeyId: process.env.AccessId,
            secretAccessKey:process.env.AccessKey
        },
    });
    try{
      const objectName = `${Date.now() + file.originalname}`
      await new AWS.S3().putObject({
        Bucket: BUCKET_NAME,
        Body: file.buffer,
        Key: objectName,
        ACL: 'public-read'
      }).promise()
      const url = `https://${BUCKET_NAME}.s3.ap-northeast-2.amazonaws.com/${objectName}`
      return {url}
    }catch(error){
      return null;
    }
}
}