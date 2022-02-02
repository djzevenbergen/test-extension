// If your extension doesn't need a background script, just leave this file empty

import Listicle from '../downloadFile';

messageInBackground("first");

// This needs to be an export due to typescript implementation limitation of needing '--isolatedModules' tsconfig
export async function messageInBackground(input) {
  console.log(input);
  console.log('just do not forget, I cannot render anything baby!');

  let thing = await Listicle();

  console.log("THE HEADACHE MAN")
  console.log({thing})
  console.log("HAD A HEADACHE")




  // let partsArray = partsArray[0]

  console.log("####################### post split")
  console.log(thing)

  let newMainObject = {}

  thing.forEach((x)=>{
    console.log(x)
  })
  


  const urls = {
    cpm: 'https://source.datanerd.us/tech-support/nr-cpm-support-cop/blob/main/useful-commands/nrql.sql',
  
  }
  
  
  
  const List = async (url) => {
  
      console.log("WE GETTING HEREEEEEEE")
      await fetch(urls['cpm'])
      .then(response => response.json())
      .then(data => console.log(data));
  
  
  
  }
  
  const results = List(urls)


  



}


