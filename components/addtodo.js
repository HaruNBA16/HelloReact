import React from 'react';
import {View, TextInput,StyleSheet, TouchableOpacity,Animated} from 'react-native';
import { useState,useRef,useEffect} from 'react';
import { AntDesign } from 'react-native-vector-icons'; 
export default function AddTodo({submitHandler}){
    const [newText, setText]=useState("")
    const [showInputBool,setShowInputBool]=useState(false)
    const [emptyText,setEmptyText]=useState(false)
    const [rotateButton,setRotateButton]=useState("0deg")
    const animations=new Animated.Value(10)
    
    const changeText=(val)=>{
        setText(val)
        if(val.length<1){
            setEmptyText(true)
            rotateTo45()
        }else{
            rotateTo0()
            setEmptyText(false)
        }
    }
    const buttonHandler=(val)=>{
        if(emptyText){
            hideInput()
            setText("")
            setEmptyText(false)
            setShowInputBool(false)
            rotateTo0()
        }else{
            rotateTo45()
            if(showInputBool){
            submitHandler(val)
            if(newText.length>0){
                setShowInputBool(false)
                hideInput()
                rotateTo0()
                setEmptyText(false)
                setText("")
            }
        }else{
            setShowInputBool(true)
            showInput()
            setEmptyText(true)
        }
        }
        
    }
    const toOne=useRef(new Animated.Value(0)).current
    const showInput=()=>{
        Animated.timing(toOne,{
            toValue:1,
            duration:300,
            useNativeDriver:false
        }).start()
    }
    const hideInput=()=>{
        Animated.timing(toOne,{
            toValue:0,
            duration:300,
            useNativeDriver:false
        }).start()
    }

    
    const rotateTo45=()=>{
    setRotateButton(animations.interpolate({
            inputRange:[0,1],
            outputRange:["0deg","45deg"],
            extrapolate:"clamp",
        }))
    }
    const rotateTo0=()=>{
    setRotateButton(animations.interpolate({
            inputRange:[-1,0],
            outputRange:["45deg","0deg"],
            extrapolate:"clamp",
        }))
    }
    
    return(   
        <View style={styles.add}>
            <View style={styles.cont}>
                <Animated.View style={{width:"75%",opacity:toOne,transform:[{scale:toOne}]}}>
                    <TextInput style={(showInputBool)?[styles.inp]:{marginRight:1000,}} placeholder='e.g. "Read Platon- Politeia"' onChangeText={changeText} value={newText}></TextInput>
                </Animated.View>
                <Animated.View style={{transform:[{rotateZ:rotateButton}]}}>
                    <TouchableOpacity style={styles.btn} onPress={()=>buttonHandler(newText)}><AntDesign name="plus" style={styles.text} /></TouchableOpacity>
                </Animated.View>
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
add:{
    position:"absolute",
    height:"100%",
    justifyContent:"flex-end",
},
cont:{
    width:"100%",
    marginBottom:40,
    paddingHorizontal:10,
    marginTop:20,
    justifyContent:"space-around",
    alignItems:"center",
    flexDirection:"row",
},
inp:{
    width:"100%",
    padding:5,
    paddingHorizontal:10,
    zIndex:0,
    height:45,
    backgroundColor:"#fff",
    fontSize:15,
    borderRadius:30,
    borderWidth:3,
    borderColor:"#0005",
    shadowColor: "#000",
    shadowOffset: {
        width: 2,
        height:4,
    },
    shadowOpacity: 0.95,
    shadowRadius: 5.14,
    elevation: 10,
    marginHorizontal:6,
},
btn:{
    borderRadius:100,
    padding:1,
    shadowColor: "#000",
    shadowOffset: {
        width: 2,
        height:7,
    },
    shadowOpacity: 0.45,
    shadowRadius: 5.14,
    elevation: 5,
},
text:{
    textAlign:"center",
    color:"#fff",
    fontSize:30,
    backgroundColor:"#005",
    borderRadius:50,
    padding:5,
}
})