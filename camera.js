import *as React from 'react';
import {View, Text, Button, Platform} from 'react-native';
import Permissions from 'expo-permissions';
import ImagePicker from 'expo-image-picker';

export default class Camera extends React.Component{
    state = {
        image:null
    }

    componentDidMount(){
        this.getPermissions()
    }

    getPermissions = async() =>{
        if(Platform.OS !== 'web'){
            const {status} = Permissions.askAsync(Permissions.CAMERA_ROLL)
            if(status !== 'granted'){
                alert('Sorry, We Need Camera Permissions To Pick The Image')
            }   
        }
    }

    pickImage = async() =>{
        try{
            var result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes:ImagePicker.mediaTypeOptions.All,
                allowsEditing:true,
                aspect:[4,3],
                quality:1
            });
            if(!result.cancelled){
                this.setState({
                    image:result.data
                })
                this.uploadImage(result.uri)
            }
        } 
        catch(error){
          alert(error)
        }
    }

    uploadImage = async(uri) =>{
        const Data = new FormData()
        let filename = uri.split('/')[uri.split('/').length - 1]
        let type = uri.split('.')[uri.split('.').length - 1]
        const fileToUpload= {
            uri:uri,
            name:filename,
            type:type
        }
        Data.append(fileToUpload)
        fetch('',{
            method:'POST',
            body:Data,
            headers:{
                'content-type':'multipart/form-data'
            }
        })
        .then((response)=>{response.json()})
        .then((result)=>{
            console.log('Success:',result)
        })
        .catch((error)=>{
            console.error(error)
        })
    }

    render(){
        return(
            <View>
                <Button name ='Press To Get Camera Permissions' onPress={this.pickImage()}></Button>
            </View>
        )
    }
}