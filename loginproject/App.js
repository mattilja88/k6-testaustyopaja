import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Button, StyleSheet, Text, TextInput, TouchableOpacity, View, Alert } from 'react-native';

export default function App() {
  const [registerData, setRegisterData] = useState({
    fname: "",
    lname: "",
    uname: "",
    email: "",
    address: "",
    phone: "",
    password: ""
  });

  const handleChange = (field, value) => {
    setRegisterData(prev => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setRegisterData({
      fname: "",
      lname: "",
      uname: "",
      email: "",
      address: "",
      phone: "",
      password: ""
    });
  };

  const register = async () => {
    try {
      const response = await fetch('http://192.168.1.101:3000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registerData),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("✅ Rekisteröinti onnistui!", data);
        Alert.alert("Onnistui", "Rekisteröinti onnistui!");
        resetForm();
      } else {
        console.warn("⚠️ Virhe:", data.message);
        Alert.alert("Virhe", data.message || "Rekisteröinti epäonnistui");
      }
    } catch (err) {
      console.error("❌ Virhe lähetettäessä:", err.message);
      Alert.alert("Virhe", "Yhteys epäonnistui: " + err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Rekisteröidy sovellukseen</Text>

      <TextInput
        style={styles.textInput}
        placeholder='Etunimi'
        value={registerData.fname}
        onChangeText={(text) => handleChange("fname", text)}
      />
      <TextInput
        style={styles.textInput}
        placeholder='Sukunimi'
        value={registerData.lname}
        onChangeText={(text) => handleChange("lname", text)}
      />
      <TextInput
        style={styles.textInput}
        placeholder='Käyttäjänimi'
        value={registerData.uname}
        onChangeText={(text) => handleChange("uname", text)}
      />
      <TextInput
        style={styles.textInput}
        placeholder='Sähköposti'
        value={registerData.email}
        onChangeText={(text) => handleChange("email", text)}
      />
      <TextInput
        style={styles.textInput}
        placeholder='Osoite'
        value={registerData.address}
        onChangeText={(text) => handleChange("address", text)}
      />
      <TextInput
        style={styles.textInput}
        placeholder='Puhelinnumero'
        value={registerData.phone}
        onChangeText={(text) => handleChange("phone", text)}
      />
      <TextInput
        style={styles.textInput}
        placeholder='Salasana'
        secureTextEntry
        value={registerData.password}
        onChangeText={(text) => handleChange("password", text)}
      />

      <TouchableOpacity style={styles.button} onPress={register}>
        <Text>Rekisteröidy</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    fontSize: 20,
    marginBottom: 20
  },
  textInput: {
    width: "80%",
    borderWidth: 2,
    borderColor: "black",
    borderRadius: 10,
    padding: 10,
    margin: 5
  },
  button: {
    width: "50%",
    height: 50,
    borderWidth: 2,
    borderColor: "black",
    borderRadius: 10,
    marginTop: 20,
    backgroundColor: "lightblue",
    alignItems: 'center',
    justifyContent: 'center',
  }
});
