  const express = require('express');
  const router = express.Router();
  var fs = require('fs');
  var parse = require('csv-parse')

  var phase = "dev"
  var path = ""

  if(phase == "dev"){
    path = "/Users/itsmypc/meditranslate/server/routes/medi_translate.csv"
  }else{
    path = "/"
  }


  router.get('/getLanguageData',function(req,res,next){

    var language_a = req.query.language_a
    var language_b = req.query.language_b
    console.log('Language Name',language_a,language_b)
    var language_from_rows = []
    var language_to_rows = []
    var language_a_rows = []
    var rows_sort = []
    var response_json = {"a_languagedata":[],"b_languagedata":[],"categories":[]}
    if(language_a == "English" && language_b == "English"){
      res.send(response_json)
    }else if(language_a == "English" && language_b != "English"){
      //get the translations for language b
      //seperate them for english as langauge a and language b
      var language_a_data = []
      var language_b_data = []
      fs.readFile(path, function (err, fileData) {
        parse(fileData, {columns: false, trim: true}, function(err, rows) {

          // Your CSV data is in an array of arrys passed to this callback as rows.
          for(var i = 0 ; i < rows.length ; i++){
            console.log('language_b',language_b)
            console.log('language_b',rows[i][2])
            if(rows[i][2] == language_b){

              language_a_data.push([rows[i][0],rows[i][3]])
              language_b_data.push([rows[i][1],rows[i][3]])
              rows_sort.push(rows[i])
            }
          }

          var categories = ["All"]
          for(var i = 0 ; i < rows_sort.length ; i++){
            categories.push(rows_sort[i][3])
          }
          response_json["a_languagedata"] = language_a_data
          response_json["b_languagedata"] = language_b_data
          response_json["categories"] = categories
          res.send(response_json)

        })
      })

    }else if(language_a != "English" && language_b =="English"){
      var language_a_data = []
      var language_b_data = []
      //get the translations for language a
      //seperate them for language a and english as langauge b
      fs.readFile(path, function (err, fileData) {
        parse(fileData, {columns: false, trim: true}, function(err, rows) {
          // Your CSV data is in an array of arrys passed to this callback as rows.
          for(var i = 0 ; i < rows.length ; i++){

            if(rows[i][2] == language_a){
              language_b_data.push([rows[i][0],rows[i][3]])
              language_a_data.push([rows[i][1],rows[i][3]])
              rows_sort.push(rows[i])
            }

          }
          var categories = ["All"]
          for(var i = 0 ; i < rows_sort.length ; i++){
            categories.push(rows_sort[i][3])
          }
          response_json["a_languagedata"] = language_a_data
          response_json["b_languagedata"] = language_b_data
          response_json["categories"] = categories
          res.send(response_json)

        })
      })

      // res.send(response_json)
    }else if(language_a != "English" && language_b != "English"){
      //get the translations for language a,b
      //seperate them for language a and language a and b
      var language_a_data = []
      var language_b_data = []
      var lang_dict= {}
      var categories = {}
      fs.readFile(path, function (err, fileData) {
        parse(fileData, {columns: false, trim: true}, function(err, rows) {
          // Your CSV data is in an array of arrys passed to this callback as rows.
          for(var i = 0 ; i < rows.length ; i++){
            if(rows[i][2] == language_a){
              lang_dict[rows[i][0]] = {}
            }
            if(rows[i][2] == language_b){
              lang_dict[rows[i][0]] = {}
            }
          }
          for(var i = 0 ; i < rows.length ; i++){
            if(rows[i][2] == language_a){
              lang_dict[rows[i][0]][language_a] = [rows[i][1],rows[i][3]]
              categories[rows[i][3]] = ""
            }
            if(rows[i][2] == language_b){
              lang_dict[rows[i][0]][language_b] = [rows[i][1],rows[i][3]]
              categories[rows[i][3]] = ""
            }
          }
          console.log('Sepearted Translations',lang_dict)
          var final_categories = ["All"]
          console.log('Category JSON',categories)

          for(var i in categories){
            final_categories.push(i)
          }
          for(var i in lang_dict){
            if(lang_dict[i][language_a] != null && lang_dict[i][language_b]!= null ){
              language_a_data.push(lang_dict[i][language_a])
              language_b_data.push(lang_dict[i][language_b])
            }

          }

          response_json["a_languagedata"] = language_a_data
          response_json["b_languagedata"] = language_b_data
          response_json["categories"] = final_categories
          res.send(response_json)

        })
      })
    }else{
      res.send(false)
    }



  })




  router.get('/getSupportedLanguages',function(req,res,next){
    var parse = require('csv-parse')
    console.log(req)
    var languages_supported = ["English"]
    fs.readFile(path, function (err, fileData) {
      parse(fileData, {columns: false, trim: true}, function(err, rows) {
        // Your CSV data is in an array of arrys passed to this callback as rows.
        for(var i = 1 ; i < rows.length ; i++){
            languages_supported.push(rows[i][2])
        }
        //converting to a set
        let mySet = new Set(languages_supported)
        let arr = Array.from(mySet)

        res.send({"supported_lang":arr})
      })
    })

  })

  router.post("/report-violation",function(req, res,next){
    console.log("CSP Violation: ", req.body || "No data received!");
    res.status(200).send("ok");
  });


  module.exports = router;
