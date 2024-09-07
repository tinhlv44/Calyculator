import { StatusBar } from 'expo-status-bar';
import React , {useState} from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Vibration, ScrollView } from 'react-native';
import {Entypo} from '@expo/vector-icons';
import AntDesign from '@expo/vector-icons/AntDesign';
import Octicons from '@expo/vector-icons/Octicons';
import Feather from '@expo/vector-icons/Feather';
import Ionicons from '@expo/vector-icons/Ionicons';
import { evaluate, log } from 'mathjs'

export default App = () => {

  const [darkMode, setDarkMode] = useState(false);
  const [currentNumber, setCurrentNumber] = useState('');
  const [currentMath, setCurrentMath] = useState('');
  const [lastNumber, setLastNumber] = useState('');
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDegreeMode, setIsDegreeMode] = useState(true);

  const buttons = ['C', 'DEL', '%', '/', 7, 8, 9, '*', 4, 5, 6, '-', 1, 2,3, '+', '00', 0, '.', '=']
  const buttonEx = ['(', ')', 'log','ln','sqrt','!','^','exp','sin','cos','tan','pi']

  const styles = StyleSheet.create({
    container: {
      flexDirection:'column',
      width:'100%',
      height:'100%',
    },
    results: {
      backgroundColor: darkMode ? '#05090c' : '#f5f5f5',
      flex:5,
      alignItems: 'flex-end',
      justifyContent: 'flex-end',
    },
    resultText: {
      maxHeight: 45,
      color: '#00b9d6',
      margin: 15,
      fontSize: 36,
    },
    historyText: {
      color: darkMode ? '#B5B7BB' : '#7c7c7c',
      fontSize: 28,
      marginRight: 10,
      alignSelf: 'flex-end',
    },
    rowButtonTheme:{
      flexDirection:'row',
      flex:1, 
      marginTop:36}
    ,
    themeButton: {
      alignSelf: 'flex-start',
      margin: 15,
      backgroundColor: darkMode ? '#7b8084' : '#e5e5e5',
      alignItems: 'center',
      justifyContent: 'center',
      width: 50,
      height: 50,
      borderRadius: 25,
    },
    buttons: {
      flex:7,
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    button: {
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: '24%',
      minHeight: '20%',
      flex: 2,
    },
    buttonEX: {
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: '24%',
      minHeight: '12.5%',
      flex: 1,
    },
    textButton: {
      color: darkMode ? '#b5b7bb' : '#7c7c7c',
      fontSize: 28,
    },
    historyContainer: {
      backgroundColor: darkMode ? '#05090c' : '#f5f5f5',
      flex:6,
    },
    historyTitle: {
      fontSize: 24,
      color: darkMode ? 'white' : '#333',
      marginBottom: 5,
      fontWeight:'bold'
    },
    historyItem: {
      borderBottomWidth: 1,
      borderBottomColor: darkMode ? '#3f4d5b' : '#e5e5e5',
      paddingVertical: 5,
    },
    historyExpression: {
      color: darkMode ? '#b5b7bb' : '#333',
      fontSize: 20,
      paddingHorizontal:10,
    },
    historyButton: {
      alignSelf: 'center',
      marginVertical: 10,
      padding: 10,
      backgroundColor: darkMode ? '#3f4d5b' : '#e5e5e5',
      borderRadius: 5,
    },
    buttonHistoryText: {
      color: darkMode ? '#b5b7bb' : '#333',
      fontSize: 16,
    },
    expandedSection:{
      flex:1
    },
  })
  function calculator() {
    const lastChar = currentNumber[currentNumber.length - 1];
    try {
      let result;  
      let expression = currentNumber;
      if (isDegreeMode) {
        expression = expression
          .replace(/sin\((.*?)\)/g, 'sin(unit($1, "deg"))')
          .replace(/cos\((.*?)\)/g, 'cos(unit($1, "deg"))')
          .replace(/tan\((.*?)\)/g, 'tan(unit($1, "deg"))');
      }
      expression = expression
          .replace(/log\((.*?)\)/g, 'log($1, 10)')
          .replace(/ln\((.*?)\)/g, 'log($1)')
      expression = expression
        .replace('π','pi')
        .replace('√','sqrt')
      result = evaluate(expression.replaceAll('%', '/100')).toString();
      if (result === 'Infinity') {
        setLastNumber('Không thể chia cho 0');
      } else {
        setCurrentNumber(result);
        setHistory([...history, { expression: currentNumber, result }]);
      }
    } catch (error) {
      //console.error("Lỗi biểu thức: ", error);
      setLastNumber("Không hợp lệ");
    }
  }
  
  function handleInput(buttonPressed) {
    const operators = ['+', '-', '*', '/'];
    const numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '00', '.'];
    const addParenthes = ['log', 'ln','exp','sin','cos','tan']
    const lastChar = currentNumber[currentNumber.length - 1];  
    Vibration.vibrate(35);
    if (['Không thể chia cho 0', 'Không hợp lệ', 'Đạt giới hạn ký tự'].includes(lastNumber)) {
      setLastNumber('');
    }
    if (currentNumber.length >= 14) {
      if (buttonPressed === 'DEL' || buttonPressed === 'C' || buttonPressed === '='){
        switch (buttonPressed) {
          case 'DEL':
            setCurrentNumber(currentNumber.slice(0, -1));
            break;
          case 'C':
            setLastNumber('');
            setCurrentNumber('');
            break;
          case '=':
            if (currentNumber && !operators.includes(lastChar)) {
              setLastNumber(currentNumber + '=');
              calculator();
            }
            break;
          default:
            setCurrentNumber(currentNumber + buttonPressed);
        }
        return
      }
      else setLastNumber('Đạt giới hạn ký tự');
      return;
    }
    if (!currentNumber && buttonPressed === '.') {
      setCurrentNumber('0.');
      return;
    }
    if ((operators.includes(lastChar) && buttonPressed === '%') || (lastChar === '%' && buttonPressed === '%')) {
      return;
    }
    if (operators.includes(buttonPressed) || buttonPressed === '%') {
      if (!currentNumber && (buttonPressed === '*' || buttonPressed === '/' || buttonPressed === '%')) {
        return;
      }
      if (currentNumber.length === 1 && operators.includes(buttonPressed) && (currentNumber === '+' || currentNumber === '-')) {
        if ((buttonPressed === '+' || buttonPressed === '-')) setCurrentNumber(buttonPressed);
        return;
      }
      setCurrentNumber(currentNumber + buttonPressed);
      return;
    }
    if (addParenthes.includes(buttonPressed)){
      setCurrentNumber(currentNumber + buttonPressed +'(');
      return
    }
    if (buttonPressed === 'pi'){
      setCurrentNumber(currentNumber + 'π');
      return
    }
    if (buttonPressed === 'sqrt'){
      setCurrentNumber(currentNumber + '√(');
      return
    }
    if (buttonPressed === '00'){
      return
    }
    if (numbers.includes(buttonPressed.toString())) {
      setCurrentNumber(currentNumber + buttonPressed.toString());
      return;
    }
    switch (buttonPressed) {
      case 'DEL':
        setCurrentNumber(currentNumber.slice(0, -1));
        break;
      case 'C':
        setLastNumber('');
        setCurrentNumber('');
        break;
      case '=':
        if (currentNumber && !operators.includes(lastChar)) {
          setLastNumber(currentNumber + '=');
          calculator();
        }
        break;
      default:
        setCurrentNumber(currentNumber + buttonPressed);
    }
    return
  }
  
  
  return(
    <View style={styles.container}>
      <StatusBar style={darkMode?'light':'dark'}/>
      <View style={styles.results}>
        <View style={styles.rowButtonTheme}>
          <TouchableOpacity style={styles.themeButton}>
            <Entypo name={darkMode ? 'light-up': 'moon'} size={24} color={darkMode ? 'white' : 'black'} 
              onPress={() => darkMode ? setDarkMode(false) : setDarkMode(true)}/>

          </TouchableOpacity>
          <TouchableOpacity style={styles.themeButton}>
            <Text style={[styles.buttonHistoryText, {fontWeight:'bold'}]} 
              onPress={() => setIsDegreeMode(!isDegreeMode)}>
                {isDegreeMode?'DEG':'RAD'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowHistory(!showHistory) } style={styles.themeButton}>
            <Text style={styles.buttonHistoryText}>
              {showHistory?
              (<AntDesign name="back" size={24} color={!darkMode?'black':'white'} />)
              :
              (<Octicons name="history" size={24} color={!darkMode?'black':'white'} />)}
            </Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.historyText}>{lastNumber}</Text>
        <Text style={styles.resultText}>{currentNumber}</Text>        
      </View>
      {showHistory
      ?
      (<View style={styles.historyContainer}>      
        <Text style={styles.historyTitle}>{history.length >0 ?'Lịch sử tính toán':'Không có lịch sử tính toán nào'}</Text>
        <ScrollView >
          {history.reverse().map((item, index) => (
            <View key={index} style={styles.historyItem}>
              <Text style={styles.historyExpression}>
                {item.expression} = {item.result}
              </Text>
            </View>
          ))}          
        </ScrollView>
      </View>

      ):(
        <View style={styles.buttons}>
          {isExpanded && (
              buttonEx.map((button) => (
                <TouchableOpacity
                  key={button}
                  style={[
                    styles.buttonEX,
                    {
                      backgroundColor:
                        darkMode ? '#2f2f2f' : '#ededed',
                    }
                  ]}
                  onPress={() => handleInput(button)}
                >
                  <Text style={[styles.textButton, { color: darkMode ? 'white' : 'black' }]}>
                    {button === 'sqrt' ? '√'
                    : button === 'pi' ? 'π'                   
                    : button}
                  </Text>
                </TouchableOpacity>
              ))
          )}

          {buttons.map((button) => (
              <TouchableOpacity
                key={button}
                style={[
                  !isExpanded? styles.button:styles.buttonEX,
                  {
                    backgroundColor:
                      typeof button === 'number' || button === '.' || button === '00' 
                        ? darkMode ? 'black' : '#f8fffe'
                        : button === 'C' || button === 'DEL' ? '#e6202a' 
                        : button === '='  ? '#0084ff' 
                        : darkMode ? '#2f2f2f' : '#ededed',
                  }
                ]}
                onPress={button === '00' ? () => setIsExpanded(!isExpanded) : () => handleInput(button)}
              >
                <Text style={[styles.textButton, { color: darkMode ? 'white' : 'black' }]}>
                  {button === 'DEL' ? <Feather name="delete" size={24} color={darkMode ? 'white' : 'black'} /> 
                  : button === '00' ? !isExpanded ? (<Ionicons name="expand" size={24} color='red' />) 
                  : (<Ionicons name="contract" size={24} color='red' />)
                  : button}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
      )}
    </View>
  )
}
