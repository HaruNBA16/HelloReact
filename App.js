import React from 'react';
import { View,Text,StyleSheet,TouchableOpacity, FlatList, Alert,Keyboard, Pressable, Animated,} from 'react-native';
import AppLoading from 'expo-app-loading';
import { useState } from 'react/cjs/react.development';
import AddTodo from './components/addtodo';
import { Feather } from 'react-native-vector-icons'; 
import Swipeable from 'react-native-gesture-handler/Swipeable';
export default function App(){
  var colors= ["#00ffff","#c0ff00","#ffe200","#ff9b00","#f00","#ff00a2","#7300e6","#bbb"]
  const[filters,setFilters]=useState([]);
  const[activeFilter,setActiveFilter]=useState(1)
  const [selection, setSelection]=useState(false);
  const [selectAll, setSelectAll]=useState(false);

  var is=false
  // ----- LIST OF TASKS 
  const [list,setList] = useState([
    {text:"Tap to change tag color",color:colors[0], oldColor:false, selected:false, icon:0, style:{paddingVertical:3,textAlign:"center", fontSize:17,}, key:Math.floor(Math.random()*10**12).toString()}, 
    {text:"Swipe right to delete to delete",color:colors[1], oldColor:false, selected:false, icon:0, style:{paddingVertical:3,textAlign:"center", fontSize:17,}, key:Math.floor(Math.random()*10**12).toString()},
    {text:"Swipe left to mark as complated ",color:colors[2], oldColor:false, selected:false, icon:0, style:{paddingVertical:3,textAlign:"center", fontSize:17,}, key:Math.floor(Math.random()*10**12).toString()},
    {text:"Swipe left to turn incomplated ",color:colors[colors.length-1], oldColor:colors[0], selected:false, icon:1, style:{paddingVertical:3,textAlign:"center", color:colors[colors.length-1],fontSize:17, textDecorationLine: 'line-through', textDecorationStyle: 'solid'}, key:Math.floor(Math.random()*10**12).toString()},
    {text:"Long press to multiple selection",color:colors[3], oldColor:false, selected:false, icon:0, style:{paddingVertical:3,textAlign:"center", fontSize:17,}, key:Math.floor(Math.random()*10**12).toString()},
])
  

  const getFilters=()=>{
    for(var i=0;i<list.length;i++){
      for(var j=0;j<filters.length;j++){
        if(filters[j]==list[i].color){
          is = true;
          break;
        }
      }
      if(!is){
        filters.push(list[i].color)
      }
      is=false
    }
    for(var i=0;i<filters.length;i++){
      for(var j=0;j<list.length;j++){
        if(filters[i]==list[j].color){
          is = true
          break;
        }
      }
      if(!is){
        filters.splice(i,1)
      }
      is=false;
    }
    return filters;
  }

  // SHOWS FILTERS
  const showFilters=()=>{
    var filterButtons=[]
    filters.forEach(color=>{
      filterButtons.push(
        <Pressable style={{
          backgroundColor:color,
          width:24,
          height:24,
          borderRadius:5,
          marginHorizontal:5,
        }}
        onPress={()=>{setActiveFilter(color),setSelectAll(false)}}
        key={color}
        ><Feather name="check" size={(color==colors[(colors.length-1)]) ? 24:0} color="#fff"
        /></Pressable>
        )
    })
    return filterButtons
  }
 

  // SELECT ALL
  const selectAllHandler=()=>{
    for(var i=0;i<list.length;i++){
      if(!selectAll){
        if(activeFilter===1){
          list[i].selected=true
        }else{
          if(activeFilter==list[i].color){
            list[i].selected=true
          }
        }
      }else{
        if(activeFilter===1){
          list[i].selected=false
        }else{
          if(activeFilter==list[i].color){
            list[i].selected=false
          }
        }
      }
    }
  }
// ----- LONG PRESS
  const longPressed=(val)=>{
    if(!selection){
      setSelection(!selection);
    }else{
      for(var i=0;i<list.length;i++){
        list[i].selected=false
      }
      setSelectAll(false)
      setSelection(!selection)
    }
  }
  // -------- REMOVE FROM LIST
  const remove=(val)=>{
    
      if(val==selection){
        Alert.alert(
          "WARNING!",
          "This action will delete all selected tasks and this can never be undone",
          [
            {
              text: "CANCEL",
              style:styles.alert,
            },
            {
              text: "DELETE",
              onPress: () =>{
                for(var i=0;i<list.length;i++){
                  if(list[i].selected){
                    remove(list[i].key);
                  }
                }
                setSelection(false)
                setSelectAll(false)

              },
              style: "cancel",
            },
          ],
          {
            cancelable: true,
          }
        );
    }else{
      setList((prevList)=>{
        return prevList.filter(person => person.key != val )
      })
    }
    getFilters()
    }
// CLEAR ALL SELECTED VALUES AND SELECTION VAR
    const clearSelections=()=>{
      for(var i=0;i<list.length;i++){
        list[i].selected=false
      }
      setSelectAll(false)
      setSelection(false)
    }
  
//----- ON TAB TRIGGRED
  const tabTriggered = (id,val)=>{
    let newArr = [...list];
      // CHANGE COLOR
      for(var i=0;i<list.length;i++){
        if(list[i].key == id){
          if(selection){
            if(!list[i].selected){
              list[i].selected=true;
            }else{
              list[i].selected=false
            }
          }
          for(var j=0;j<colors.length;j++){
            if(list[i].color==colors[j] && list[i].icon==0 && !selection){
             list[i].color=colors[(j+1)%(colors.length-1)]
              break
            }
          }
        }
    }

// ----- MARK AS COMPLATED
    setList(newArr);
    if(val===true){
      for(var i=0;i<list.length;i++){
        if(list[i].key == id){
          if(list[i].color!=colors[colors.length-1]){
              for(var j=0;j<colors.length;j++){
                if(colors[j]==list[i].color){
                  newArr[i].oldColor=colors[j-1]
                }
              }
            newArr[i].style={paddingVertical:3,textAlign:"center", color:colors[colors.length-1], fontSize:17, textDecorationLine: 'line-through', textDecorationStyle: 'solid'};
            newArr[i].color=colors[colors.length-1];
            newArr[i].icon=1;
          }else{
            newArr[i].style={paddingVertical:3,textAlign:"center", fontSize:17, color:"#000", };
            newArr[i].color=list[i].oldColor;
            newArr[i].icon=0;
          }
        }
    }
    }else if(val=="selection"){
      for(i=0;i<list.length;i++){
        if(list[i].selected && !list[i].icon){
          list[i].oldColor=list[i].color
            list[i].style={paddingVertical:3,textAlign:"center", color:colors[colors.length-1], fontSize:17, textDecorationLine: 'line-through', textDecorationStyle: 'solid'};
            list[i].color=colors[colors.length-1];
            list[i].icon=1;
            list[i].selected=false
        }else if(list[i].selected && list[i].icon){
            list[i].style={paddingVertical:3,textAlign:"center", fontSize:17, color:"#000", };
            list[i].color=list[i].oldColor;
            list[i].icon=0;
            list[i].selected=false
        }
      }
      setSelectAll(false)
      setSelection(false)
      filterButtons=[];
      getFilters();
    }
    
    getFilters()
  }
// ADD NEW TASK
  const submitHandler=(NewText)=>{
    const nullalert = ()=>{Alert.alert("Oops!..","Content must not empty",[{text:"Okay"}])}
    if(NewText==null){
      nullalert()
    }else{
      if(NewText.trim().length > 0){
        Keyboard.dismiss();
        setList(prevList=>{
        return [
          {text:NewText,color:(activeFilter==1)?(colors[0]):(activeFilter),icon:0, oldColor:false, selected:false, style:{paddingVertical:3,textAlign:"center", fontSize:17,}, key:Math.floor(Math.random()*10**12).toString()},
          ...prevList
        ]
      })
    }else{
      nullalert()
    }
  }
  }
  <AppLoading
  onStart={getFilters()}
  />
    return(
    <Pressable style={styles.app} onPress={()=>{Keyboard.dismiss(),clearSelections()}}>
        <View style={{marginTop:60, width:"100%",paddingVertical:5, flexDirection:"row",}}><Text style={styles.title}>Your Tasks</Text> 
        </View>
        {(filters.length>1 && list.length>1)?(
          <View style={{flexDirection:"row",padding:7,marginTop:20,marginBottom:10, backgroundColor:"#f0f7f7", borderRadius:5, shadowOffset:{width:0,height:1},shadowOpacity:0.2, elevation:5,}}>
          <Pressable style={{
            backgroundColor:"#0000",
            width:30,
            height:24,
            borderRadius:5,
            marginHorizontal:5,
            justifyContent:"center",
            alignItems:"center",
          }}
          onPress={()=>setActiveFilter(1)}
          ><Text style={{textAlign:"center",color:"#000", fontSize:15,}}>All</Text></Pressable>
          {showFilters()} 
        </View>):true}
          {(list.length>1 && selection)?(
                    <View style={{flexDirection:"row", width:"100%", marginTop:10,}}>
                      <View style={{marginLeft:20,}}>
                      <TouchableOpacity style={{padding:5, backgroundColor:"#fff", borderRadius:5, shadowColor: "#000",shadowOffset: {width: 2,height:7,},shadowOpacity: 0.45,shadowRadius: 5.14,elevation: 5,  
                  }} onPress={()=>{[setSelectAll(!selectAll),selectAllHandler()]}
                      
                    }> 
                    <Feather name="list" size={30} color="#a0a0a0" />
                    </TouchableOpacity>
                      </View>
                    <View style={{flex:1,justifyContent:"flex-end", flexDirection:"row",  marginRight:20,}}>
                    <TouchableOpacity style={{justifyContent:"center", paddingHorizontal:10, marginHorizontal:5, backgroundColor:"#fff", borderRadius:5, shadowColor: "#000",shadowOffset: {width: 2,height:7,},shadowOpacity: 0.45,shadowRadius: 5.14,elevation: 5,  
                  }} onPress={()=>{remove(selection)}
                  
                }> 
                    <Feather name="trash" size={24} color="#e50000" />
                    </TouchableOpacity>
                    <TouchableOpacity style={{ justifyContent:"center", paddingHorizontal:4, marginHorizontal:5, backgroundColor:"#fff", borderRadius:5, shadowColor: "#000",shadowOffset: {width: 2,height:7,},shadowOpacity: 0.45,shadowRadius: 5.14,elevation: 5,  
                  }} onPress={()=>{tabTriggered(false,"selection")}
                  
                }> 
                    <Feather name="check" size={35} color="#00f000" />
                    </TouchableOpacity>
                  </View>
                </View>
                  ):(true)}
              <FlatList style={{ width:"100%", paddingBottom:10,marginVertical:20,}}
                data={list}
                renderItem={({item})=>(
                  (item.color==activeFilter || activeFilter == 1)?(
                    <Swipeable
                    renderLeftActions={(!selection)?
                      (progress,dragX)=>{
                        const scale=dragX.interpolate({
                          inputRange:[0,50],
                          outputRange:[-1,1],
                          extrapolate:"clamp",
                        })
                        const rotate=dragX.interpolate({
                          inputRange:[0,45],
                          outputRange:["-180deg","0deg"],
                          extrapolate:"clamp",
                          
                        })
                        const opacity= dragX.interpolate({
                          inputRange: [0, 50],
                          outputRange: [-1, 1],
                        })
                        return(
                          <Animated.View style={{marginLeft:20, justifyContent:"center",alignItems:"center", transform:[{scale},{rotate}], opacity:opacity,}}>
                            <Pressable style={{padding:7, backgroundColor:"#c90000", borderRadius:7}} onPress={()=>{remove(item.key)}}> 
                            <Feather name="trash" size={24} color="#fff" />
                            </Pressable>
                          </Animated.View>
                        )
                      }:(()=>{true})
                    }
                    renderRightActions={(!selection)?(
                      (progress,dragX)=>{
                        const scale=dragX.interpolate({
                          inputRange:[-50,0],
                          outputRange:[1,0],
                          extrapolate:"clamp",
                        })
                        const rotate=dragX.interpolate({
                          inputRange:[-45,0],
                          outputRange:["0deg","-180deg"],
                          extrapolate:"clamp",
                        })
                        const opacity= dragX.interpolate({
                          inputRange: [-50, 0],
                          outputRange: [1,-1],
                        })
                        return(
                          <Animated.View style={{marginRight:20, justifyContent:"center",alignItems:"center", transform:[{scale},{rotate}],opacity:opacity}}>
                            <Pressable style={{padding:3, backgroundColor:"#00f000", borderRadius:7}} onPress={()=>{tabTriggered(item.key,true)}}> 
                            <Feather name="check" size={30} color="#fff" />
                            </Pressable>
                          </Animated.View>
                        )
                      }):(()=>{true})
                    }
                    leftThreshold={50}
                    rightThreshold={50}
                    >
                    <TouchableOpacity key={item.key} style={[styles.cont,(item.selected)?{borderColor:item.color,borderWidth:2,}:false]} onPress={()=>{tabTriggered(item.key)}} delayLongPress={350} onLongPress={()=>{longPressed(item.key)}}>
                      <View style={{flex:.2, justifyContent:"center", paddingLeft:5,}}>
                      <View style={{backgroundColor:(selection&&!item.selected)?"#fff0":(item.color),borderColor:(selection)?(item.color):"#fff0", borderWidth:(selection&&!item.selected)?2.2:0, width:24,height:24, borderRadius:5}}><Feather name="check" size={(item.icon) ? 24:0} color="#fff" /></View>
                      </View>
                      <View style={{flex:1}}>
                      <Text style={item.style}>{item.text}</Text>
                      </View>
                    </TouchableOpacity>
                  </Swipeable>):true
                
                )} 
                keyExtractor={item => item.key} 
                />
                {(activeFilter!=colors[colors.length-1])?(<AddTodo submitHandler={submitHandler} />):(false)}
        </Pressable>
  );
}
const styles=StyleSheet.create({
  app:{
    width:"100%",
    flex:1,
    justifyContent:"center",
    alignItems:"center",
    backgroundColor:"#e0e6e7",
  },
  title:{
    flex:1,
    paddingLeft:25,
    fontSize:30,
    fontWeight:"bold",
    
  },
  cont:{
    backgroundColor:"#fff",
    justifyContent:"center",
    alignContent:"center",
    flexDirection:"row",
    padding:10,
    marginHorizontal:20,
    marginVertical:7,
    borderRadius:8,
    elevation:5,
  },
})
