// possibly convert this file to a .txt file






const Listicle = async () => {

    const urls = {
        //   cpm: 'https://source.datanerd.us/raw/tech-support/nr-cpm-support-cop/main/useful-commands/nrql.sql',
          cpm: 'https://source.datanerd.us/raw/tech-support/nr-cpm-support-cop/main/useful-commands/nrql.sql?token=AAAAV25COADZL2UIZQ7KDJTBHE4QQ',
        }
    let cosa = "";
    console.log("WE GETTING HEREEEEEEE")

    await fetch(urls['cpm'])
    .then(response =>{
        console.log("THE WEBPAGE FILE IS NEXT \/ ")
        // console.log({response})
        // console.log(response.text())
        cosa = response.text()

        console.log({cosa})

        return cosa
    })
        
    .then(data => { 
        // cosa = data

        console.log('line 31 of downloadFile')
        console.log({data})
        // var partsArray = thing
        cosa = data.split(/\r?\n/);
        return data
    })
        
    .catch(error => {
        console.log("ES UN ERROR")
        console.log(error)});

    return cosa

}


export default Listicle;