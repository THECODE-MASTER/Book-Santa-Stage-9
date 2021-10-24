import React,{Component} from 'react';
import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  StyleSheet,
  TouchableOpacity,
  Alert} from 'react-native';
import db from '../config';
import firebase from 'firebase';
import MyHeader from '../components/MyHeader'

export default class BookRequestScreen extends Component{
  constructor(){
    super();
    this.state ={
      userId : firebase.auth().currentUser.email,
      bookName:"",
      reasonToRequest:"",
      isBookRequestActive:"",
      requestedBookName:"",
      bookStatus:"",
      requestId:"",
      userDocId:"",
      docId:"",
    }
  }

  createUniqueId(){
    return Math.random().toString(36).substring(7);
  }



  addRequest =(bookName,reasonToRequest)=>{
    var userId = this.state.userId
    var randomRequestId = this.createUniqueId()
    db.collection('requested_books').add({
        "user_id": userId,
        "book_name":bookName,
        "reason_to_request":reasonToRequest,
        "request_id"  : randomRequestId,
    })

    this.setState({
        bookName :'',
        reasonToRequest : ''
    })

    return Alert.alert("Book Requested Successfully")
  }

   recievedBooks =(bookName)=>{
     var userId = this.state.userId
     var requestId = this.state.requestId
     db.collection("recievedBooks").add({
       "user_Id":userId,
       "book_Name":bookName,
       "request_Id":requestId,
       "book_Status":bookStatus,
     })
   }
   
  getIsBookRequestActive=()=>{
    db.collection("users").where("email_Id", "==", this.state.userId)
    .onSnapshot(querySnapshot=>{
      querySnapshot.forEach(doc=>{
        this.setState({
          isBookRequestActive:doc.data().isBookRequestActive,
          userDocId:doc.id,
        })
      })
    })
  }
  
  getBookRequest=()=>{
    var BookRequest = db.collection("requestedBooks").where("userId", "==", this.state.userId).get()
    .then((snapshot)=>{
      snapshot.forEach((doc)=>{
        if(doc.data().book_Status !== "recieved"){
          this.setState({
            requestId:doc.data().request_id,
            requestedBookName:doc.data().book_Name,
            bookStatus:doc.data().book_Status,
            docId:doc.id,
          })
        }
      })
    })
  }

  sendNotification=()=>{
    db.collection("users").where("email_Id", "==", this.state.userId).get()
    .then((snapshot)=>{
      snapshot.forEach((doc)=>{
        var name = doc.data().first_name
        var lastname = doc.data().last_name
        db.collection("all_notifications").where("request_Id", "==", this.state.request_Id).get()
        .then((snapshot)=>{
          snapshot.forEach((doc)=>{
            db.collection("users").doc(doc.id).update({isBookRequestActive:false,})
          })
        })
      })
    })
  }

  render(){
    return(
        <View style={{flex:1}}>
          <MyHeader title="Request Book" navigation ={this.props.navigation}/>
            <KeyboardAvoidingView style={styles.keyBoardStyle}>
              <TextInput
                style ={styles.formTextInput}
                placeholder={"enter book name"}
                onChangeText={(text)=>{
                    this.setState({
                        bookName:text
                    })
                }}
                value={this.state.bookName}
              />
              <TextInput
                style ={[styles.formTextInput,{height:300}]}
                multiline
                numberOfLines ={8}
                placeholder={"Why do you need the book"}
                onChangeText ={(text)=>{
                    this.setState({
                        reasonToRequest:text
                    })
                }}
                value ={this.state.reasonToRequest}
              />
              <TouchableOpacity
                style={styles.button}
                onPress={()=>{this.addRequest(this.state.bookName,this.state.reasonToRequest)}}
                >
                <Text>Request</Text>
              </TouchableOpacity>
            </KeyboardAvoidingView>
        </View>
    )
  }
}

const styles = StyleSheet.create({
  keyBoardStyle : {
    flex:1,
    alignItems:'center',
    justifyContent:'center'
  },
  formTextInput:{
    width:"75%",
    height:35,
    alignSelf:'center',
    borderColor:'#ffab91',
    borderRadius:10,
    borderWidth:1,
    marginTop:20,
    padding:10,
  },
  button:{
    width:"75%",
    height:50,
    justifyContent:'center',
    alignItems:'center',
    borderRadius:10,
    backgroundColor:"#ff5722",
    shadowColor: "#000",
    shadowOffset: {
       width: 0,
       height: 8,
    },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,
    elevation: 16,
    marginTop:20
    },
  }
)
