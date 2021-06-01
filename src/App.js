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

  const doThing = async (cop) => {
    setChosenCop(cop)
    cop = cop.toLowerCase()

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
      console.log(JSON.stringify(doc.data()))
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

  const [visibleQuery, setVisibleQuery] = useState(null)

  const showQuery = (query) => {
    setVisibleQuery(query)
  }

  const cops = ['CPM', 'Lambda']

  const goToUrl = (url) => {
    window.chrome.tabs.query({ active: true, currentWindow: false }, function (tabs) {
      window.chrome.tabs.update(tabs[0], { url: url });
    });
  }


  useEffect(() => {

  }, [thing, visibleQuery])

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

        <div>
          <p>{visibleQuery == null ? "" : visibleQuery}</p>
          {visibleQuery == null ? "" : <button onClick={() => showQuery(null)}>Close</button>}
        </div>

        <ul>
          {/* <li>First</li> */}
          {thing ? Object.keys(thing).map((item) => {
            return (
              // <li key={thing[item]['url']}>{thing[item]['url']}</li>
              <div>
                <a onClick={() => goToUrl(thing[item]['url'])}>{item}</a>
                <button onClick={() => { showQuery(thing[item]['query']) }}>Show Query</button>
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
