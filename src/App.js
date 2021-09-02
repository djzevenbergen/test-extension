/*global chrome*/

//todo

// add the section to local.sync for persistent previous position (still needs to remember section)
// pull from github and parse on client
// test favorites functionality
// get url creation code from scotto

import Listicle from './downloadFile';
import logo from './logo.svg';
import { useEffect, useState } from 'react';
import './App.css';
import firebase from 'firebase';

import { Button, Divider, List, ListItem, ListItemText, Grid, GridItem, Card, CardHeader, CardContent } from '@material-ui/core';

import { messageInBackground } from './background/index.js'

function App() {

  var db = firebase.firestore();

  const [thing, setThing] = useState()
  const [color, setColor] = useState('blue')
  const [chosenCop, setChosenCop] = useState();
  const [chosenSection, setChosenSection] = useState()
  const [sectionDropdown, setSectionDropdown] = useState(false);
  const [favoritesOpen, setFavoritesOpen] = useState(false)
  const [favorites, setFavorites] = useState({});
  const [switcher, setSwitcher] = useState(true)

  const [cosa, setCosa] = useState()





  //     chrome.storage.sync.get(['favorites'], function(result) { 
  // setFavorites(result['favorites'])
  // })

  const doThing = async (cop) => {
    setChosenCop(cop)


    let cosa = await Listicle();


    console.log("APP COMPONENT DATA")
    console.log(cosa)


    chrome.storage.sync.set({ 'cop': cop }, function () {
      console.log('Value is set to ' + cop);
    });
    // cop = cop.toLowerCase()
    if (cop != 'favorites') {
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
        console.log({ doc })
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
  }

  const doSectionThing = (e) => {
    setChosenSection(e)
  }

  const [visibleQuery, setVisibleQuery] = useState(null)

  const showQuery = (query) => {
    setVisibleQuery(query)
  }

  const cops = ['CPM']

  const goToUrl = (url) => {

    console.log(url)

    //make this so it opens a new tab

    chrome.tabs.query({ active: true, currentWindow: false }, function (t) {
      chrome.tabs.update({ url: url });
    });
  }

  const favoriteItem = (key, item) => {

    if (favorites === undefined) {
      setFavorites({})

    }

    chrome.storage.sync.get(['favorites'], function (result) {
      if (result['favorites'] === undefined) {
        result['favorites'] = {}
      }
      let tmp = result['favorites']

      tmp[key] = item
      console.log('TMP')
      console.log({ tmp })

      chrome.storage.sync.set({ 'favorites': tmp }, function () {
        console.log('Value is set to ' + key);
        console.log(item)
      });

      setFavorites(result['favorites'])

      console.log("127 - favorites: ")
      console.log(favorites)
    })




    chrome.storage.sync.get(['favorites'], function (result) {

      console.log('Favorites: ');
      console.log({ result })

    });

  }




  useEffect(() => {
    if (favorites === undefined) {
      setFavorites({})
    }
    chrome.storage.sync.get(['favorites'], function (result) {
      if (result['favorites']) {
        setFavorites(result['favorites'])
      }

    })

    const key = 'cop'
    console.log("before first chrome thing")

    console.log("before second chrome thing")
    chrome.storage.sync.get([key], function (result) {
      console.log("after second chrome thing")
      console.log('117 Value currently is ' + result);
      console.log({ result })
      // setChosenCop(result[key])
      doThing(result[key])
      console.log(chosenCop + "is the chosen cOP")
    });

    //   chrome.storage.sync.get(['favorites'], function(result) { 
    // setFavorites(result['favorites'])
    // })


    // chrome.storage.sync.get(['favorites'], function(result) { 
    // setFavorites(result['favorites'])
    // })


  }, [])

  useEffect(() => {

    console.log("13 0this is firing")

  }, [thing, visibleQuery])

  useEffect(() => {

    console.log("favorites load hook this is firing")

  }, [switcher])


  const removeFavorite = (key) => {
    let tmp = favorites

    delete tmp[key]

    console.log("new faves")
    console.log({ tmp })

    chrome.storage.sync.set({ 'favorites': tmp }, function () {
      console.log('Value is set to ' + key);


    });

    setFavorites(tmp)
    setFavoritesOpen(true)
    setSwitcher(!switcher)
    console.log("210 FAVORITES ")
    console.log({ favorites })

  }

  useEffect(() => {



  }, [sectionDropdown])

  useEffect(() => {
    console.log("chosenCOP: " + chosenCop)
    if (!chosenCop) {
      setSectionDropdown(false)
    } else {
      setSectionDropdown(true)
    }

    if (chosenCop == "favorites") {
      setFavoritesOpen(true)



    } else {
      setFavoritesOpen(false)
    }
  }, [chosenCop])



  useEffect(() => {
    console.log('favorites open?', favoritesOpen)
    console.log('favirites type', typeof favorites)
    console.log('THE HOOK FAVES:')
    console.log({ favorites })

    chrome.storage.sync.get(['favorites'], function (result) {
      setFavorites(result['favorites'])
    })

    console.log('favorites open?', favoritesOpen)
    console.log('THE HOOK FAVES:')
    console.log({ favorites })

  }, [favoritesOpen])

  // const toggleClass = (key) =>{

  // }



  return (
    <div className="App" style={{ width: "600px" }}>
      <Grid container >
        <Grid item xs={12}>
          <header className="App-header">
            {/* <img src={logo} className="App-logo" alt="logo" /> */}
            <p style={thing ? { color: "red" } : { color: "blue" }}>
              {thing ? chosenCop : "Choose a COP"}.
            </p>
          </header>
        </Grid>
        <Grid className="content" item xs={12}>
          <select onChange={(e) => doThing(e.target.value)} value={chosenCop} >

            <option value={""}>Select a COP</option>
            {favorites ? <option value={"favorites"}>Favorites</option> : ''}
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



          {/* this should be a component!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! */}
          {favoritesOpen ? "" : <>
            {sectionDropdown ?

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
          </>
          }
        </Grid>
        <Divider />
        {/* 
        <div>
          <p>{visibleQuery == null ? "" : visibleQuery}</p>
          {visibleQuery == null ? "" : <button onClick={() => showQuery(null)}>Close</button>}
        </div> */}



        <List className='content' style={{ alignItems: "center" }}>
          {/* <li>First</li> */}
          {favoritesOpen ?

            /* <>
            
             
            
            
                      { chrome.storage.sync.get(['favorites'], function(result) { 
                        return(
                          <>
                            <p>Hey</p>
                        {Object.values(result['favorites']).map((item) => {
                        console.log({item})
                        console.log("INSIDE THE REACT")
                        return (
                          <li>
                          <div>
                            
                            <div id={item} className="query">{item['query']}</div>
                            <p>{item['key']}</p>
                            {visibleQuery == item ? <div><p>{item['query']}</p> <button onClick={() => setVisibleQuery(null)}>Close</button></div>: ""}
                            <a onClick={() => goToUrl(item['url'])}>{item}</a>
                            <button onClick={() => { showQuery(item) }}>Show Query</button>
            
                            <p>__________________________________________________________________________________________</p>
                          </div></li>)
            
                      })}
                      </>
                      )}) }
                      </>  */


            <>

              {/* 
             {Object.keys(favorites)?.map((item) => {
            console.log({item})
            console.log("INSIDE THE REACT")
            return (
              <li>
              <div>
                
                <div id={item} className="query">{favorites[item]['query']}</div>
                <p>{item['key']}</p>
                {visibleQuery == item ? <div><p>{favorites[item]['query']}</p> <button onClick={() => setVisibleQuery(null)}>Close</button></div>: ""}
                <a onClick={() => goToUrl(favorites[item]['url'])}>{favorites[item]}</a>
                <button onClick={() => { showQuery(item) }}>Show Query</button>

                <p>__________________________________________________________________________________________</p>
              </div></li>)

          })} */}

              {Object.keys(favorites)?.map((item) => {

                console.log(item)

                return (
                  /* <><p>{item}</p></> */

                  /*      <li>
          <div>
            
            <div id={item} className="query">{favorites[item]['query']}</div>
            <p>{item['key']}</p>
            {visibleQuery == item ? <div><p>{favorites[item]['query']}</p> <button onClick={() => setVisibleQuery(null)}>Close</button></div>: ""}
            <a onClick={() => goToUrl(favorites[item]['url'])}>{item}</a>
            <button onClick={() => { showQuery(item) }}>Show Query</button>

            <p>__________________________________________________________________________________________</p>
          </div></li>*/


                  ///////////////////////******************************************************************* THIS SHOULD BE A COMPONENT */
                  <ListItem>

                    <Card style={{ width: '600px', alignItems: "center" }}>



                      <CardHeader title={item}>
                        {/* {item} */}
                        {/* <Grid item xs={12} justifyContent="center"><ListItemText style={{color: "green", fontSize:"20px"}} justifyContent="center" primary={item.replace(/_/g, ' ').toUpperCase()} /></Grid> */}
                      </CardHeader>
                      {visibleQuery == item ? <Grid item xs={12}><div><ListItemText>{favorites[item]['query']}</ListItemText> <Button variant="contained" color="primary" onClick={() => setVisibleQuery(null)}>Close</Button><Divider></Divider></div></Grid> : ""}

                      {/* <CardContent> */}
                      <Grid container>


                        {/* <Grid item xs={12}>{item}</Grid> */}

                        <Grid item xs={12}><Button variant="contained" color="primary" onClick={() => { showQuery(item) }}>Show Query</Button></Grid>
                        <Grid item xs={6}><Button variant="contained" color="primary" onClick={() => goToUrl(favorites[item]['url'])}>Query Builder</Button></Grid>
                        <Grid item xs={6}><Button variant="contained" color="primary" onClick={() => removeFavorite(item)}>Remove from favorites</Button></Grid>
                        {/* <Grid item xs={4}><Button variant="contained" color="primary" onClick={() => { favoriteItem(item, favorites[item]) }}>*Favorite*</Button></Grid> */}
                      </Grid>
                      {/* </CardContent> */}


                    </Card>

                  </ListItem>


                )

              })}

            </>



            : <>

              {chosenSection ? Object.keys(thing[chosenSection]).map((item) => {
                return (
                  // <li key={thing[item]['url']}>{thing[item]['url']}</li>
                  <ListItem>

                    <Card style={{ width: '600px', alignItems: "center" }}>
                      <Grid container>


                        <CardHeader >

                          {/* <Grid item xs={12} justifyContent="center"><ListItemText style={{color: "green", fontSize:"20px"}} justifyContent="center" primary={item.replace(/_/g, ' ').toUpperCase()} /></Grid> */}
                        </CardHeader>
                        {visibleQuery == item ? <Grid item xs={12}><div><ListItemText>{thing[chosenSection][item]['query']}</ListItemText> <Button variant="contained" color="primary" onClick={() => setVisibleQuery(null)}>Close</Button><Divider></Divider></div></Grid> : ""}

                        <CardContent>
                          <Grid item xs={12}>


                            <Grid item xs={4}><Button variant="contained" color="primary" onClick={() => { showQuery(item) }}>Show Query {item}</Button></Grid>
                            <Grid item xs={4}><Button variant="contained" color="primary" onClick={() => goToUrl(thing[chosenSection][item]['url'])}>Query Builder</Button></Grid>
                            <Grid item xs={4}><Button variant="contained" color="primary" onClick={() => { favoriteItem(item, thing[chosenSection][item]) }}>*Favorite*</Button></Grid>
                          </Grid>
                        </CardContent>

                      </Grid>
                    </Card>

                  </ListItem>

                )

              }) : ""}

            </>
          }
        </List>



        {/* <button onClick={() => doThing('cpm')}
        >
          CPM
        </button>
        <button onClick={() => doThing('lambda')}
        >
          Lambda
        </button> */}

      </Grid>
    </div>
  );
}

export default App;
