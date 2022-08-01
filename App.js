import React, {useState, useEffect} from 'react';
import { PermissionsAndroid, Button, AsyncStorage } from 'react-native';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  StatusBar,
  Text,FlatList,TouchableOpacity,  Dimensions,  TextInput,
} from 'react-native';
import {Header, Colors} from 'react-native/Libraries/NewAppScreen';
import WifiManager, { getCurrentWifiSSID } from 'react-native-wifi-reborn';
import Modal from 'react-native-modal';
import Toast from 'react-native-simple-toast';


const App = () => {
  let win = Dimensions.get("window");
  let WifiSSID,WifiPassword;
  let  isWEP = false;
  let password
  let [connected,setConnected] = useState(false);
  let [nearbyNetworksList,setNearbyNetworks] = useState([]);
  const [passwords, setPasswords] = useState('')
  const [isVisible, setisVisible] = useState(false)
  const [isModalVisible, setModalVisible] = useState(false);
  const [ssid, setSsid] = useState('');

  const initWifi = async () => {
    try {
      const ssid = await WifiManager.getCurrentWifiSSID();
      setSsid(ssid);
      console.log('Your current connected wifi SSID is ' + ssid);
    } catch (error) {
      setSsid('Cannot get current SSID!' + error.message);
      console.log('Cannot get current SSID!', {error});
    }
  }

  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: "React Native Wifi Reborn App Permission",
          message:
            "Location permission is required to connect with or scan for Wifi networks. ",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK"
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        initWifi();
      } else {
        console.log("Location permission denied");
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const getNearbyNetworks = async () =>{
  await WifiManager.reScanAndLoadWifiList().then(devices=>{
       // List Of Devices [Containing Only SSID]
       console.log(devices_list)
       let devices_list = devices.map(device=>{
           return device.SSID;
       })
       setNearbyNetworks(devices_list);
       }).catch(err=>{
       console.log(err)
   })
  }

  useEffect(() => {
    requestLocationPermission();
   }, []);
   
   useEffect(() => {
     WifiManager.loadWifiList().then(devices=>{
       // List Of Devices [Containing Only SSID]
       let devices_list = devices.map(device=>{;
         return device.SSID;
     })
     setNearbyNetworks(devices_list);
   }).catch(err=>{
     console.log(err)
   })
 }, );

 
const connectToNetwork = async (item,index) =>{
 toggleModal();
 setSsid(item);
 console.log(item);
}

const connectToNetworks = async (item,index)=> { 
 try {
   const data = await WifiManager.connectToProtectedSSID(
     ssid,
     passwords,
     false,
     );
     console.log('Connected successfully!', {data});
     setConnected({connected: true, ssid});
     Toast.show(`connected Successfully to ${ssid}`);
   } catch (error) {
     setConnected({connected: false, error: error.message});
     console.log('Connection failed!', {error});
     Toast.show('Connection failed');
   }
}
const toggleModal = () => {
 setisVisible(!isVisible);
};

const turnWifiOn = async () => {
  try {
    WifiManager.setEnabled(true); //set WiFi ON
    console.log('Wifi Turned on successfully!');
    Toast.show('Wifi Turned on successfully!');
  } catch (error) {
    console.log('Failed! to Turn on Wifi', {error});
    Toast.show('Failed! to Turn on Wifi');
  }
};

const turnWifiOff = async () => {
  try {
    WifiManager.setEnabled(false); //set WiFi OFF
    console.log('Wifi Turned off successfully!');
    Toast.show('Wifi Turned off successfully!');
  } catch (error) {
    console.log('Failed! to Turn off Wifi', {error});
    Toast.show('Failed! to Turn off Wifi');
  }
};

  return (
         <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>

          <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>ssid</Text>
              <Text style={styles.sectionDescription}>
                {JSON.stringify(ssid)}
              </Text>
            </View>
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Connected</Text>
            <Text style={styles.sectionDescription}>
              {JSON.stringify(connected)}
            </Text>
          </View>
          <View style={styles.sectionContainer}>
          <Button title="Turn on Wifi" onPress={turnWifiOn} />
          <Button title="Turn on Wifi" onPress={turnWifiOff} />
          <Button title='SCAN NEARBY NETWORKS' 
           style={{backgroundColor:'#0091ea',borderWidth:0,elevation:5}}
           onPress={()=>{getNearbyNetworks()}}/>
 
          <FlatList 
             data={nearbyNetworksList}
             renderItem={({item,index})=>(
               <TouchableOpacity onPress={()=>connectToNetwork(item,index)} key={index} style={{flexDirection:'row',marginTop:20}}>
                 <Text style={{color:'white',
                 fontWeight:'bold',
                 fontSize:16,
                 textAlignVertical:'bottom'
                 }}> {item} </Text> 
               </TouchableOpacity>
             )}
          />
          <Modal isVisible={isVisible} >
          <TextInput 
          placeholder='password'
          onChangeText={(text)=>{setPasswords(text)}}
          />
          <Button title='connect' onPress={()=>connectToNetworks()} />
          <Button title="Hide modal" onPress={toggleModal} />
         </Modal>
          </View>
    
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
  header:{
   backgroundColor:'#212121',
   flexDirection:'row',
   elevation:0.5,
   alignItems:'flex-end'
},
headerText:{
   color:"#fff",
   fontSize:18,
   fontWeight:'bold'
},
text:{
   fontSize:16,
   fontWeight:'bold',
   marginBottom:2,
},
buttonText:{
   fontSize:18,
   fontWeight:'bold',
   marginBottom:2,
}
});

export default App;
