// import the library
import excel from 'xlsx';
import axios from 'axios';
import {props__export} from '../App.js'

const website_url = "http://localhost:8080"

export function getSupportedLanguages(){
  axios.get(website_url+'/userroutes/getSupportedLanguages').then(res => {
    var supported_langs = res.data["supported_lang"]
    props__export.setState({supported_langs:supported_langs})
  })
}

export function getLanguageData(lang_a,lang_b){
  // console.log("Language A",e.target.value)
  // var lang = e.target.value

  axios.get(website_url+'/userroutes/getLanguageData?language_a='+lang_a+'&language_b='+lang_b).then(res => {
    console.log('A data',res.data)
    var data = res.data
    console.log(data)
    props__export.setState({a_languagedata:data["a_languagedata"]})
    props__export.setState({a_language:lang_a})
    props__export.setState({b_languagedata:data["b_languagedata"]})
    props__export.setState({b_language:lang_b})
    props__export.setState({categories:data["categories"]})
  })
}


export function getLanguageData_A(e){
  console.log("Language A",e.target.value)
  var lang = e.target.value
  axios.get(website_url+'/userroutes/getLanguageData?language='+e.target.value).then(res => {
    console.log('A data',res.data)
    props__export.setState({a_languagedata:res.data})
    props__export.setState({a_language:lang})
  })
}

export function getLanguageData_B(e){
  console.log("Language B",e.target.value)
  var lang = e.target.value
  axios.get(website_url+'/userroutes/getLanguageData?language='+e.target.value).then(res => {
    console.log('B data',res.data)
    props__export.setState({b_languagedata:res.data})
    props__export.setState({b_language:lang})
    console.log('Blang',this.state.b_language)
  })
}

export function onChangeCategory(item){
  this.setState({category_selected:item})
}

export function onChangeSearch(e){
  this.setState({search_input:e.target.value})
}
