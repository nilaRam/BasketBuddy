import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import React, { useState, useEffect } from 'react'
import { createWorker } from 'tesseract.js';
import Tesseract from 'tesseract.js';

const inter = Inter({ subsets: ['latin'] })

export default function Home() {


  const funFacts = [
    "Bananas are technically berries, while strawberries are not.",
    "Honey never spoils. Sealed honey found in tombs over 3,000 years old is still safe to eat.",
    "Carrots were originally purple before the 17th century. Dutch growers developed the orange variety we know today.",
    "It takes almost 3 years for a single pineapple to reach maturation.",
    "Dark chocolate contains antioxidants and can improve heart health when consumed in moderation.",
    "You can test an egg's freshness by placing it in a bowl of water. Fresh eggs will sink, while older ones will float.",
    "If you eat something too spicy, milk or yogurt can help soothe the burn better than water.",
    "Corn Flakes were originally developed to discourage masturbation. Dr. Kellogg believed spicy foods increased sexual desire, so he made a bland cereal.",
    "The world's most expensive coffee, Kopi Luwak, is made from beans digested and excreted by a civet.",
    "Tomatoes are fruits, but in 1893, the U.S. Supreme Court ruled them as vegetables for tariff purposes.",
    "Hawaii consumes the most SPAM per capita in the U.S. It's even served at McDonald's and Burger King there.",
    "Black, green, and white peppercorns are all from the same plant. The difference in color is a result of harvesting and processing methods.",
    "Peanuts can be used to make dynamite.",
    "The oldest known popcorn was discovered in New Mexico and is over 5,000 years old.",
    "The Wrigley Company originally sold soap and baking powder. They offered free chewing gum with their products, and the gum became more popular than the original products!",
    "The two 'M's on M&M's candies stand for Mars and Murrie, the founders of the candy.",
    "Chewing gum's base is made from a form of synthetic rubber.",
    "Eating garlic can repel mosquitoes. This might be where the myth about garlic repelling vampires comes from!",
    "The jackfruit is the largest tree-borne fruit, weighing up to 80 pounds.",
    "The original Coca-Cola formula contained cocaine, but it was removed in the early 1900s.",
    "Supermarkets play slower music to encourage shoppers to spend more time and buy more.",
    "The barcode was first used on Wrigley's gum in 1974.",
    "The first grocery store to offer self-service was Piggly Wiggly in 1916.",
    "Ice cream was sold in grocery stores for the first time in 1930.",
    "The longest receipt from a grocery store measured 18.80 m (61 ft 8.38 in) in the UK.",
    "There's a grocery store in Canada where everything is free. It's called 'The Really, Really Free Market'.",
    "Potatoes were the first food to be grown in space, in 1996.",
    "The most stolen food item in the world is cheese.",
    "The stickers on fruits are edible, although not recommended.",
    "Apples can float because 25% of their volume is air.",
    "Almonds are members of the peach family.",
    "Broccoli contains more protein than steak per calorie.",
    "The world's largest grocery store is the Superdome in New Orleans, spanning over 127,000 sq ft.",
    "The fear of cooking is known as Mageirocophobia.",
    "The average person will eat around 35 tons of food in a lifetime.",
    "Cranberries can be tested for ripeness by bouncing them.",
    "The twist tie on bread packages represents the day it was baked. Different colors for different days.",
    "There are more possible iterations of a game of chess than there are atoms in the known universe.",
    "Onions are the only food that can make you cry.",
    "The most popular grocery store item in the U.S. is bananas.",
    "In Japan, there's a museum entirely dedicated to instant ramen.",
    "The world's spiciest chili pepper is the Carolina Reaper.",
    "There's a fruit called 'Miracle Fruit' that makes sour things taste sweet when eaten.",
    "Pound cake is named so because the original recipe required a pound of each ingredient.",
    "White chocolate isn't technically chocolate because it doesn't contain cocoa solids.",
    "In ancient Rome, flamingo tongues were a delicacy.",
    "The word 'avocado' comes from the Aztec word 'ahuacatl' which means 'testicle'.",
    "The average lifespan of a taste bud is about 10 to 14 days.",
    "Blueberries are the only natural food that is truly blue in color.",
    "Coffee beans aren't beans. They're fruit pits."
  ];


  const [currentFact, setCurrentFact] = useState(funFacts[Math.floor(Math.random() * funFacts.length)]);

useEffect(() => {
  const interval = setInterval(() => {
    const randomIndex = Math.floor(Math.random() * funFacts.length);
    setCurrentFact(funFacts[randomIndex]);
  }, 8000); // change every 5 seconds, adjust as needed

  return () => {
    clearInterval(interval);
  };
}, []);


  const [selectedCharacterDetails, setSelectedCharacterDetails] = useState(null);
  const [receiptData, setReceiptData] = useState("")
  const [step, setStep] = useState(0)
  const [selectedCharacterA, setSelectedCharacterA] = useState(undefined)
  const [selectedCharacterB, setSelectedCharacterB] = useState(undefined)
  const [selectedFile, setSelectedFile] = useState(null);
  const [receiptItems, setReceiptItems] = useState([]);
  const [playerOneItems, setPlayerOneItems] = useState([]);
  const [playerTwoItems, setPlayerTwoItems] = useState([]);
  const [whoPaid, setWhoPaid] = useState("A");

  const [generateButtonDisabled, setGenerateButtonDisabled] = useState(true);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
  
    setSelectedFile(file);
    console.log('File is set:', file);
  
    // Handle text generation
    await handleGenerateText(file).then(async(info) => {
      console.log(info)
      console.log("now we're doing AI")
      const receiptDataUnusable = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer -nila-put-your-token-here-',
        },
        body: JSON.stringify(
            {
                'model': 'gpt-4',
                'messages': [
                    {
                        'role': 'user',
                        'content': `
                        YOU ARE TO ONLY RESPOND WITH JSON. DO NOT LEAD OR END WITH ANY ADDITIONAL TEXT.
  
                        I am going to provide you a receipt and you're going to return json with the following properties for each item purchased on the receipt: name, price, healthRate (scale of 0 to 1 where 0 is least healthy type of food and 1 is most healthy type of food and make decimals. Don't be afraid to make all of the items large or small, don't make them relative to each other but rather relative to average human diet), and pricePerServing
  
                      DO NOT ALLOW THE BALANCE TOTAL OR ANYTHING WITH A 0 DOLLAR COST.

                        Please make assumptions about what abbreviated names mean and provide the complete assumed name inside the JSON. 
                        Make sure all of the names are spelled correctly and are english words capitalized like a title
                        Return simply a list of objects (do not wrap them in an items property)
  
                        Here's your receipt, do your thing <3:  
                        ${info}
                        `
                    }
                ],
            }
        ),
    });
      //code for image to text 
      const receiptDataComplete = await receiptDataUnusable.json();
      console.log("Receipt Data Below")
      const jsonObject = JSON.parse(receiptDataComplete.choices[0].message.content);
      console.log(jsonObject)
      setReceiptItems(jsonObject)
  

    })
  
    console.log(receiptData)

    // Now, set the state for the disabled button
    setGenerateButtonDisabled(false);
  };
  

  const handleGenerateText = async (selectedFile) => {
    if (!selectedFile) {
      // Handle the case when no file is selected
      console.log("doingthis")

      return; 
    }
  

    const imageUrl = URL.createObjectURL(selectedFile);

    try {
      const result = await Tesseract.recognize(imageUrl, 'eng', {
        logger: (info) => console.log(info),
      });
      setReceiptData(result.data.text);
      return(result.data.text)

    } catch (error) {
      console.error('Error during OCR:', error);
    }
  };
  

  const characters = [
    {
      name: "Magical Mushroom",
      bgcolor: "#FFFCAC",
      image: "https://cloud-ggda21t78-hack-club-bot.vercel.app/2magical_mushroom.png"
    },
    {
      name: "Braggy Banana",
      bgcolor: "#FFDDBD",
      image: "https://cloud-ggda21t78-hack-club-bot.vercel.app/0braggy_banana.png"
    },
    {
      name: "Cheeky Coconut",
      bgcolor: "#CBFCFF",
      image: "https://cloud-ggda21t78-hack-club-bot.vercel.app/1cheeky_coconut_.png"
    },
    {
      name: "Pretty Potato",
      bgcolor: "#C8FFC7",
      image: "https://cloud-ggda21t78-hack-club-bot.vercel.app/3pretty_potato.png"
    },
    {
      name: "Tech-Bro Tomato",
      bgcolor: "#FFABAB",
      image: "https://cloud-ggda21t78-hack-club-bot.vercel.app/4tech-bro_tomato.png"
    }
  ]

  return (
    <div style={{margin: 0}}>
      <Head>
        <title>Basket Buddy</title>
        <meta name="description" content="Lovely tool" />
        <meta property="og:image" content="https://cloud-7kzt1euh8-hack-club-bot.vercel.app/0basketbuddy.png" />
        <meta name="twitter:image" content="https://cloud-7kzt1euh8-hack-club-bot.vercel.app/0basketbuddy.png" />

        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main style={{margin: 0}}>
          <div 
          onClick={() => setStep(0.5)}
          style={{
            backgroundSize: "cover",
            opacity: step != 0 ? 0 : 1,
            display: step != 0 ? "none" : "flex",
            height: step != 0 ? "0vh" : "100vh",

            transition: 'opacity 0.5s ease-in-out, display 0.5s ease-in-out',
          color: "white", margin: 0, justifyContent: "space-between", flexDirection: "column", width: "100vw", backgroundImage: "url(https://cloud-j18ftolxs-hack-club-bot.vercel.app/1basketbuddysaturated.png)"}}>
            <p style={{fontWeight: 600, marginLeft: "20px", textAlign: "left", marginTop: "20px", fontFamily: "Helvetica, sans-serif", fontSize: "48px", margin: 0, textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)"}}></p>
            <p style={{fontFamily: "Helvetica", alignItems: "center", display: "flex", width: "100%", justifyContent: "center", color: "#fff", fontSize: 18}}>tap to start uwu</p>
         </div>
         {step == 0.5 && (
          <div style={{backgroundColor: "#FFFFF6", display: "flex", flexDirection: "column", height: "100vh", fontFamily: "Helvetica"}}>
            <div style={{backgroundColor: "#D7604B",padding: "24px", borderRadius: "0px 0px 32px 32px"}}>
            <h1 style={{margin: 0, fontSize: 32, color: "#fff"}}>-Scan Your Receipt</h1>
            <h1 style={{fontSize: 32, color: "#fff"}}>-Choose Items To Split Or Keep Separate</h1>
            <h1 style={{fontSize: 32, color: "#fff"}}>-Quickly Calculate Costs</h1>
            <h1 style={{fontSize: 32, color: "#fff"}}>-See Who Spends Wisely</h1>
            </div>
            <div style={{height: "100%", alignItems: "center", display: "flex", flexDirection: "column", justifyContent: "space-around"}}>
            <img style={{width: 300}}  src="https://cloud-b3sxb3io4-hack-club-bot.vercel.app/0coolcharacter.png"/>
            <div 
            onClick={() => setStep(1)}
            style={{backgroundColor: "#7CD45D", cursor: "pointer", color: "#fff", width: "calc(100% - 32px)", borderRadius: 16,  alignItems: "center", justifyContent: "center", display: "flex",marginLeft: 16, marginRight: 16}}>
            <h1>Get Started Ya</h1>
            </div>
            </div>

          </div>
         )}
         {step == 1 && (
      <div style={{fontFamily: "Helvetica"}}>
            <div style={{backgroundColor: "#D7604B",padding: "24px", borderRadius: "0px 0px 32px 32px"}}>
            <h1 style={{margin: 0, fontSize: 32, color: "#fff", textAlign: "center"}}>SCAN YO RECEIPT</h1>
            
            
            </div>
            <div style={{display: "flex", flexDirection: "column", justifyContent: "center", marginTop: 64, alignItems: "center"}}>
            
            
            {selectedFile != null ? (

            <div style={{display: "flex", cursor: "pointer", borderRadius: 16, flexDirection: "column", alignItems: "center"}}>
            <img src={URL.createObjectURL(selectedFile)} style={{width: "250px", cursor: "pointer", aspectRatio: "9/16", border: "1px solid #000", borderRadius: 16, objectFit: "contain", alignItems: "center"}}/>
            {/* <img  style={{width: 128, marginTop: 48, height: 128}} src="https://cloud-5r7ek9q75-hack-club-bot.vercel.app/0uploadbutton.png"/> */}
            </div>

            ) : 
            <label htmlFor="fileInput">
            <input
    type="file"
    id="fileInput"
    style={{ display: 'none' }}
    onChange={handleFileChange}
  />
            <div style={{display: "flex", borderRadius: 16, width: "250px", cursor: "pointer", backgroundColor: "#ECECEC", aspectRatio: "9/16", flexDirection: "column", alignItems: "center"}}>
            {/* <img src={URL.createObjectURL(selectedFile)} style={{width: "250px", aspectRatio: "9/16", border: "1px solid #000", borderRadius: 16, objectFit: "contain", alignItems: "center"}}/> */}
            {/* <img  style={{width: 128, marginTop: 48, height: 128}} src="https://cloud-5r7ek9q75-hack-club-bot.vercel.app/0uploadbutton.png"/> */}
            </div>
            </label>
          }

            </div>
            <div style={{display: "flex", justifyContent: "center", marginTop: 42}}>
            {selectedFile == null ? (
              <label htmlFor="fileInput">
  <img
    style={{ width: 128, height: 128, cursor: 'pointer' }}
    src="https://cloud-5r7ek9q75-hack-club-bot.vercel.app/0uploadbutton.png"
    alt="Upload Button"
  />
  <input
    type="file"
    id="fileInput"
    style={{ display: 'none' }}
    onChange={handleFileChange}
  />
</label>
            ) : (
              <div onClick={() => setStep(2)}>
              <img  style={{width: 128, cursor: 'pointer', height: 128}} src="https://cloud-g7cefyvds-hack-club-bot.vercel.app/0next.png"/>
            </div>
            )}

</div>
        {/* <input type="file" onChange={handleFileChange}> */}
        {/* <button onClick={handleGenerateText} disabled={generateButtonDisabled}>
          Generate Text
        </button> */}
        {/* <p>{receiptData}</p>
          {receiptData != "" && (
            <button onClick={() => setStep(4)
            
            }>Continue</button>
          )} */}

      </div>
        )}
        {/* Dieter HANDLE HERE */}
        {(step == 2 || step == 3)  && (
          <div>

            <div style={{width: "100%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
            <p style={{fontSize: 32, marginBottom: 0, marginLeft: 16, marginRight: 16, display: 'flex', flexDirection: 'column'}}>
              {step == 2 ? ("Player A ") : ("Player B ")}
              Select Your Character
            </p>
            <br/>
            {step == 2 &&
            <p >Player A is the player who paid</p>
            }
            </div>

{selectedCharacterDetails && (
  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginBottom: '20px' }}>
    <img 
      src={selectedCharacterDetails.image} 
      alt={selectedCharacterDetails.name}
      style={{
        width: '128px',
        height: '128px',
        borderRadius: '50%',
        backgroundColor: selectedCharacterDetails.bgcolor,
        marginBottom: '10px'
      }}
    />
    <span>{selectedCharacterDetails.name}</span>
  </div>
)}

<div style={{display: 'flex', flexDirection: 'row', flexWrap:"wrap", justifyContent: 'center', alignItems: 'center', marginBottom: '20px' }}>
{characters.map((character) => 
  <div 
    onClick={() => {
      if(step === 2) {
        setSelectedCharacterA(character.name);
        setSelectedCharacterDetails(character); // Set the character details for display at the top
        // setStep(3);
      } else {
        setSelectedCharacterB(character.name);
        setSelectedCharacterDetails(character); // Set the character details for display at the top
      }
    }}
    style={{
      width: '128px',
      height: '128px',
      borderRadius: '50%',
      backgroundColor: character.bgcolor,
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      boxShadow: selectedCharacterA === character.name || selectedCharacterB === character.name? '0 4px 12px rgba(0, 0, 0, 0.2)' : '0 4px 8px rgba(0, 0, 0, 0.1)', 
      border: selectedCharacterA === character.name || selectedCharacterB === character.name ? '3px solid black' : 'none', 
      overflow: 'hidden',
      margin: '10px',
      cursor: 'pointer'
    }}
  >
    <img 
      src={character.image} 
      alt="Character" 
      style={{
        width: '90%',
        height: '90%'
      }}
    />
  </div>
)}
</div>
{selectedCharacterA !== undefined && selectedCharacterB !== undefined && (
  
  <div 
  onClick={() => setStep(4)}
  style={{backgroundColor: "#7CD45D", cursor: "pointer", color: "#fff", width: "calc(100% - 32px)", borderRadius: 16,  alignItems: "center", justifyContent: "center", display: "flex",marginLeft: 16, marginRight: 16}}>
  <h1>Continue</h1>
  </div>
)}

{selectedCharacterA !== undefined && selectedCharacterB == undefined && (
  <div 
  onClick={() => setStep(3)}
  style={{backgroundColor: "#7CD45D", cursor: "pointer", color: "#fff", width: "calc(100% - 32px)", borderRadius: 16,  alignItems: "center", justifyContent: "center", display: "flex",marginLeft: 16, marginRight: 16}}>
  <h1>Continue</h1>
  </div>
)}
{/* END OF CHAR */}





          </div>
        )}




{(step == 4 && receiptItems.length == 0) && (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
    {/* Your app's icon here, if you have one */}
    <img src="https://cloud-89oonvyav-hack-club-bot.vercel.app/0icon_official.png" alt="Basket Buddy Icon" style={{ borderRadius: 20, width: 150, height: 150 }} />
    <p>Loading... but meanwhile...</p>
    <h1 style={{fontWeight: 800, fontSize: 32, color: 'black', textAlign: 'center', marginTop: 20 }}>Fun Facts!!</h1>
    <p style={{fontWeight: 500, fontSize: 20, color: 'gray', textAlign: 'center', marginTop: 5 }}>{currentFact}</p>
  </div>
)}

      {((step == 4 || step == 5) && receiptItems.length != 0) && (
        <div>
          <div style={{display: "flex", padding: 16, borderRadius: "0px 0px 32px 32px", backgroundColor: step == 4 ? ("#7CD45D") : ("#D7604B"), color: "#fff"}}>          
            {step == 4 && 
          <img onClick={() => console.log(characters.filter(character => character.name === selectedCharacterA))} style={{width: 128, backgroundColor: characters.filter(character => character.name === selectedCharacterA)[0].bgcolor, borderRadius: "50%", height: 128}} src={characters.filter(character => character.name === selectedCharacterA)[0].image}/>
          }
          {step == 5 && 
          <img style={{width: 128, borderRadius: "50%", backgroundColor: characters.filter(character => character.name === selectedCharacterA)[0].bgcolor, height: 128}} src={characters.filter(character => character.name === selectedCharacterB)[0].image}/>
          }

          <h1 style={{fontFamily: "Helvetica", marginLeft: 16}}>CHOOSE YOUR<br/> FOOD BASKET</h1>

          </div>

          {/* <p>{step == 4 ? (selectedCharacterA) : (selectedCharacterB)}, CHOOSE YOUR FOOD BASKET</p> */}
          {receiptItems.map((item, index) => (
        <div key={index} style={{ display: 'flex', alignItems: "center", fontFamily: "Helvetica", marginLeft: 16, marginRight: 16, marginTop: 8 }}>
          <div
            disabled={(step == 5 && playerOneItems.includes(item.name))}
            onClick={() => {
              // Return early if disabled
              if (step === 5 && playerOneItems.includes(item.name)) {
                  return;
              }
              
              if (step === 4) {
                  const itemIndex = playerOneItems.findIndex(pItem => pItem.name === item.name);
                  if (itemIndex === -1) {
                      setPlayerOneItems([...playerOneItems, item.name]);
                  } else {
                      const updatedItems = [...playerOneItems];
                      updatedItems.splice(itemIndex, 1);
                      setPlayerOneItems(updatedItems);
                  }
              } else {
                  const itemIndex = playerTwoItems.findIndex(pItem => pItem.name === item.name);
                  if (itemIndex === -1) {
                      setPlayerTwoItems([...playerTwoItems, item.name]);
                  } else {
                      const updatedItems = [...playerTwoItems];
                      updatedItems.splice(itemIndex, 1);
                      setPlayerTwoItems(updatedItems);
                  }
              }
          }}
            checked={
              (step == 4 && playerOneItems.some((pItem) => pItem === item.name))
              ||
              (step == 5 && playerTwoItems.some((pItem) => pItem === item.name))

            }

            style={{
              width: 32,
              height: 32,
              marginRight: 12,
              borderRadius: "16px",

    backgroundColor: 
        (step === 4 && playerOneItems.some(pItem => pItem === item.name)) ? "#7CD45D" :
        (step == 5 && playerOneItems.includes(item.name)) ? "8A8A8A" :
        
        (step === 5 && playerTwoItems.some(pItem => pItem === item.name)) ? "#D7604B" :
        '#E8E8E8',
        cursor: "pointer"
              // (step == 4 && playerOneItems.some((pItem) => pItem === item.name))
              // ||
              // (step == 5 && playerTwoItems.some((pItem) => pItem === item.name))
            }}
          />
          <p style={{textDecoration: (playerOneItems.includes(item.name) && step == 5) ? ("line-through") : ("none")}}>
            {item.name} - {item.price}
          </p>

        </div>
      ))}
         

                {(playerOneItems.length > 0 && step == 4) &&          <div 
            onClick={() => setStep(5)}
            style={{backgroundColor: "#7CD45D", position: "absolute", bottom: 16, fontFamily: "Helvetica", cursor: "pointer", color: "#fff", width: "calc(100% - 32px)", borderRadius: 16,  alignItems: "center", justifyContent: "center", display: "flex",marginLeft: 16, marginRight: 16}}>
            <h1>Continue</h1>
            </div>}
                {(playerTwoItems.length > 0 && step == 5) &&          <div 
            onClick={() => setStep(8)}
            style={{backgroundColor: "#D7604B", position: "absolute", bottom: 16, fontFamily: "Helvetica", cursor: "pointer", color: "#fff", width: "calc(100% - 32px)", borderRadius: 16,  alignItems: "center", justifyContent: "center", display: "flex",marginLeft: 16, marginRight: 16}}>
            <h1>Continue</h1>
            </div>}

        </div>
      )}

      {step == 6 && (
        <div>
                    <img style={{width: 128, height: 128}} src={characters.filter(character => character.name === selectedCharacterA)[0].image}/>

          <p>{selectedCharacterA} Items: {receiptItems
    .filter(item => playerOneItems.includes(item.name))
    .map((item, i) => (i !== 0 ? ', ' : '') + item.name)
}</p>

<img style={{width: 128, height: 128}} src={characters.filter(character => character.name === selectedCharacterB)[0].image}/>

          <p>{selectedCharacterB} Items: {receiptItems
    .filter(item => playerTwoItems.includes(item.name))
    .map((item, i) => (i !== 0 ? ', ' : '') + item.name)
}</p>

          <p>
  Shared Items: {receiptItems
    .filter(item => !playerOneItems.includes(item.name) && !playerTwoItems.includes(item.name))
    .map((item, i) => (i !== 0 ? ', ' : '') + item.name)
}
</p>


          <button onClick={() => setWhoPaid("A")}>{selectedCharacterA} Paid</button>
          <button onClick={() => setWhoPaid("B")}>{selectedCharacterB} Paid</button>
          <br/>
          {whoPaid != "" && (<button onClick={() => setStep(8)}>Continue</button>)}
        </div>
      )}
      {
      step == 8 && <div>
          <p style={{marginLeft: 16, marginBottom: 8, marginRight: 16, fontSize: 32, fontWeight: 600}}>Results</p>

          <div style={{padding: 16, backgroundColor: "#5D9F46", color: "#fff", marginLeft: 16, marginRight: 16, borderRadius: 16}}>
          <img style={{width: 128, height: 128, backgroundColor: characters.filter(character => character.name === selectedCharacterA)[0].bgcolor, borderRadius: "50%"}} src={characters.filter(character => character.name === selectedCharacterA)[0].image}/>

          <p>{selectedCharacterA} items cost ${receiptItems
  .filter(item => playerOneItems.includes(item.name))


  .reduce((sum, item) => sum + item.price, 0)}
  </p>
  <p onClick={() => console.log(receiptItems)}>Healthy Average: {receiptItems
            .filter(item => playerOneItems.includes(item.name))
            .reduce((sum, item, index, array) => sum + item.healthRate / array.length, 0)
            .toFixed(2)
            
            }

  </p>
  <p onClick={() => console.log(receiptItems)}>Price Per Meal Average: ${receiptItems
            .filter(item => playerOneItems.includes(item.name))
            .reduce((sum, item, index, array) => sum + item.pricePerServing / array.length, 0)
            .toFixed(2)
            
            }

  </p>
  </div>
  <br/>
  <div style={{padding: 16, backgroundColor: "#A14838", color: "#fff", marginLeft: 16, marginRight: 16, borderRadius: 16}}>

  <img style={{width: 128, height: 128, backgroundColor: characters.filter(character => character.name === selectedCharacterB)[0].bgcolor, borderRadius: "50%"}} src={characters.filter(character => character.name === selectedCharacterB)[0].image}/>

            <p>{selectedCharacterB} items cost ${receiptItems
  .filter(item => playerTwoItems.includes(item.name))
  .reduce((sum, item) => sum + item.price, 0)}</p>
  <p onClick={() => console.log(receiptItems)}>Healthy Average: {receiptItems
            .filter(item => playerTwoItems.includes(item.name))
            .reduce((sum, item, index, array) => sum + item.healthRate / array.length, 0)
            .toFixed(2)
            
            }/1

  </p>

  <p onClick={() => console.log(receiptItems)}>Price Per Meal Average: ${receiptItems
            .filter(item => playerTwoItems.includes(item.name))
            .reduce((sum, item, index, array) => sum + item.pricePerServing / array.length, 0)
            .toFixed(2)
            
            }

  </p>
  </div>
{/* 
              <p>Shared items cost ${receiptItems
    .filter(item => !playerOneItems.includes(item.name) && !playerTwoItems.includes(item.name))
    .reduce((sum, item) => sum + item.price, 0)}</p> */}


          {whoPaid == "A" && <p style={{marginLeft: 16, marginRight: 16, fontSize: 24}}>{selectedCharacterB} should pay {selectedCharacterA} $
          {receiptItems
  .filter(item => playerTwoItems.includes(item.name))
  .reduce((sum, item) => sum + item.price, 0) + (1/2 * (receiptItems
    .filter(item => !playerOneItems.includes(item.name) && !playerTwoItems.includes(item.name))
    .reduce((sum, item) => sum + item.price, 0)))}
          
          {' '}or with taxes: $
          {receiptItems
  .filter(item => playerTwoItems.includes(item.name))
  .reduce((sum, item) => sum + (item.price * 1.06), 0) + (1/2 * (receiptItems
    .filter(item => !playerOneItems.includes(item.name) && !playerTwoItems.includes(item.name))
    .reduce((sum, item) => sum + (item.price * 1.06), 0)))}
          </p>}
          {whoPaid == "B" && <p>{selectedCharacterA} should pay {selectedCharacterB} $
          {receiptItems
  .filter(item => playerOneItems.includes(item.name))
  .reduce((sum, item) => sum + item.price, 0) + (1/2 * (receiptItems
    .filter(item => !playerOneItems.includes(item.name) && !playerTwoItems.includes(item.name))
    .reduce((sum, item) => sum + item.price, 0)))}
          </p>}
      </div>
      }


      </main>
      </div>
  )
}
