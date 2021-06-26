/*global chrome*/

//todo

// add the section to local.sync for persistent previous position
// add favorites to local.sync ass object - https://stackoverflow.com/questions/15717334/chrome-sync-storage-to-store-and-update-array
// pull from github and parse on client

import logo from './logo.svg';
import { useEffect, useState } from 'react';
import './App.css';
import firebase from 'firebase';

import { messageInBackground } from './background/index.js'

function App() {

  var db = firebase.firestore();

  const [thing, setThing] = useState()
  const [color, setColor] = useState('blue')
  const [chosenCop, setChosenCop] = useState();
  const [chosenSection, setChosenSection] = useState()
  const [sectionDropdown, setSectionDropdown] = useState(false);

  const doThing = async (cop) => {
    setChosenCop(cop)

    chrome.storage.sync.set({'cop': cop}, function() {
      console.log('Value is set to ' + cop);
    });
    // cop = cop.toLowerCase()

    var docRef = db.collection("cops").doc(cop);
    // setColor('red')
    // setThing(true)
    messageInBackground("wungus");
    await docRef.get().then((doc) => {

      // console.log({ doc })
      // console.log(doc.data())
      // let a = doc.data()
      // setColor('red')
      // setThing(a)

      console.log('thing: ')
      console.log({ thing })
      console.log('cop:::' + cop)
      console.log("doc:")
      // console.log(JSON.stringify(doc.data()))
      console.log({doc})
      doc = doc.data()
      let list = {}
      Object.keys(doc).map((d) => {
        // console.log(`${d.id} => ${d.data()}`);
        console.log(d + '=>' + doc[d])

        list[d] = doc[d]
        // setThing(doc.id)


      });
      console.log(list)
      setThing(list)


    }).catch((error) => {

      messageInBackground(error)
    });
  }

  const doSectionThing = (e) =>{
    setChosenSection(e)
  } 

  const [visibleQuery, setVisibleQuery] = useState(null)

  const showQuery = (query) => {
    setVisibleQuery(query)
  }

  const cops = ['CPM', 'Lambda']

  const goToUrl = (url) => {
    chrome.tabs.query({ active: true, currentWindow: false }, function (tabs) {
    chrome.tabs.update(tabs[0], { url: url });
    });
  }

  const favoriteItem = (key, item) =>{

        chrome.storage.sync.set({'favorites': {key: item}}, function() {
      console.log('Value is set to ' + key);
      console.log(item)
    });

  }


useEffect(()=>{

  const key = 'cop'
  console.log("before first chrome thing")

    console.log("before second chrome thing")
  chrome.storage.sync.get([key], function(result) {
      console.log("after second chrome thing")
    console.log('Value currently is ' + result);
    console.log({result})
    // setChosenCop(result[key])
    doThing(result[key])
    console.log(chosenCop + "is the chosen cOP")
  });


}, [])

  useEffect(() => {



  }, [thing, visibleQuery])

    useEffect(() => {



  }, [sectionDropdown])

  useEffect(()=>{
    console.log("chosenCOP: " + chosenCop)
    if (!chosenCop){
      setSectionDropdown(false)
    } else {
      setSectionDropdown(true)
    }
  }, [chosenCop])

  // const toggleClass = (key) =>{

  // }



  return (
    <div className="App">
      <header className="App-header">
        {/* <img src={logo} className="App-logo" alt="logo" /> */}
        <p style={thing ? { color: "red" } : { color: "blue" }}>
          {thing ? chosenCop : "Choose a COP"}.
        </p>

        <select onChange={(e) => doThing(e.target.value)} value={chosenCop} >

          <option value={""}>Select a COP</option>
          {cops.map((x) => {
            return (

              <option value={x}
              >
                {x}
              </option>
            )
          })}

        </select>
        {/* {cops.map((x) => {
          return (

            <button onClick={() => doThing(x)}
            >
              {x}
            </button>
          )
        })} */}

              { sectionDropdown ? 
        <select onChange={(e) => setChosenSection(e.target.value)} value={chosenSection} >

          <option value={""}>Select a Topic</option>
          {thing ? Object.keys(thing).map((x) => {
            return (

              <option value={x}
              >
                {x}
              </option>
            )
          }) : ""}

        </select>
        : 
        ""
      }


      <p>---------------------------------------------------------------------------------</p>
{/* 
        <div>
          <p>{visibleQuery == null ? "" : visibleQuery}</p>
          {visibleQuery == null ? "" : <button onClick={() => showQuery(null)}>Close</button>}
        </div> */}



        <ul>
          {/* <li>First</li> */}
          {chosenSection ? Object.keys(thing[chosenSection]).map((item) => {
            return (
              // <li key={thing[item]['url']}>{thing[item]['url']}</li>
              <div>
{/*               
                <div id={item} className="query">{thing[chosenSection][item]['query']}</div> */}

                {visibleQuery == item ? <div><p>{thing[chosenSection][item]['query']}</p> <button onClick={() => setVisibleQuery(null)}>Close</button></div>: ""}
                <a onClick={() => goToUrl(thing[chosenSection][item]['url'])}>{item}</a>
                <button onClick={() => { showQuery(item) }}>Show Query</button>
                <button onClick={() => { favoriteItem(item, thing[chosenSection][item]) }}>*Favorite*</button>
                <p>__________________________________________________________________________________________</p>
              </div>)

          }) : ""}
          {/* <li>Last</li> */}

        </ul>



        {/* <button onClick={() => doThing('cpm')}
        >
          CPM
        </button>
        <button onClick={() => doThing('lambda')}
        >
          Lambda
        </button> */}
      </header>
    </div>
  );
}

export default App;
