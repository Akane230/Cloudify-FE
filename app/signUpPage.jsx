import { View, Text } from 'react-native'
import React from 'react'
import { useState } from 'react'; 

const signUpPage = () => {

  const [signUpFirstName, setSignUpFirstName] = useState("");
  const [signUpLastName, setSignUpLastName] = useState("");
  const [signUpUsername, setSignUpUsername] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [signUpConfirmPassword, setSignUpConfirmPassword] = useState("");

  return (
    <View>
      <Text>signUpPage</Text>
    </View>
  )
}

export default signUpPage