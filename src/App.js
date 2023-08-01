import { useState } from "react";

const App = () => {

  const colors = ["darkolivegreen", "cornflowerblue", "burlywood"];
  const defaultColor = "black";
  const playerColor = "lightgray";
  const buildColor = "lightskyblue";

  const reptileTemplate = {
    species: "NaN", 
  };

  const reptiles = { 
    snakes: [{
      species: "Corn snake", 
      name: "Corn snake",
      prefEnviroments: ["burlywood"], 
      diet: ["Rodents"],
      mature: 2,
      lifeSpan: [12, 20],
      sex: ["M","F"],
      spaceReqs: 3,
      venomous: "N",
      morphs: [
        {
          name: "Normal",
          weight: 0,
          chromosome: "WT",
          price: 30
        },
        {
          name: "Okeetee",
          weight: 0,
          chromosome: "WT",
          price: 35
        },
        {
          name: "Caramel",
          weight: 0,
          chromosome: "SD",
          price: 40
        },
        {
          name: "Amelanistic",
          weight: 0,
          storeWeight: 50,
          chromosome: "SR",
          price: 45
        },
        {
          name: "Motley",
          weight: 0,
          chromosome: "SR",
          price: 60
        }
      ]
    },{
    species: "Hognose snake", 
    name: "Hognose snake",
    prefEnviroments: ["burlywood"], 
    diet: ["Rodents", "Frogs"],
    mature: 2,
    lifeSpan: [10, 20],
    sex: ["M","F"],
    spaceReqs: 2,
    venomous: "RF",
    morphs: [
      {
        name: "Normal",
        weight: 0,
        chromosome: "WT",
        price: 30
      },
      {
        name: "Albino",
        weight: 0,
        chromosome: "SR",
        price: 45
      },
      {
        name: "Conda",
        weight: 0,
        chromosome: "SD",
        price: 100
      },
      {
        name: "Superarctic",
        weight: 0,
        chromosome: "SD",
        price: 150
      }
    ]
  }
  ]
};

  // States -------------------------------------
  const [cash, setCash] = useState(1000);
  const [placeColor, setPlaceColor] = useState(0);
  const [position, setPosition] = useState([1,1,defaultColor]);
  const [enclosures, setEnclosures] = useState([]);
  const [buildMode, setBuildMode] = useState(false);
  const [bID, setBID] = useState(-1);
  // All stock hooks
  const [shopStock, setStock] = useState([]);
  const [stockGenerated, setGenerated] = useState(false);
  const [stockNum, setStockNum] = useState(5);

  const [grid, setGrid] = useState({
    colors: [
    [[defaultColor,[defaultColor,defaultColor,defaultColor,defaultColor]],[defaultColor,[defaultColor,defaultColor,defaultColor,defaultColor]],[defaultColor,[defaultColor,defaultColor,defaultColor,defaultColor]],[defaultColor,[defaultColor,defaultColor,defaultColor,defaultColor]], [defaultColor,[defaultColor,defaultColor,defaultColor,defaultColor]]],
    [[defaultColor,[defaultColor,defaultColor,defaultColor,defaultColor]],[playerColor,[placeColor,playerColor,playerColor,playerColor]],[defaultColor,[defaultColor,defaultColor,defaultColor,defaultColor]],[defaultColor,[defaultColor,defaultColor,defaultColor,defaultColor]], [defaultColor,[defaultColor,defaultColor,defaultColor,defaultColor]]],
    [[defaultColor,[defaultColor,defaultColor,defaultColor,defaultColor]],[defaultColor,[defaultColor,defaultColor,defaultColor,defaultColor]],[defaultColor,[defaultColor,defaultColor,defaultColor,defaultColor]],[defaultColor,[defaultColor,defaultColor,defaultColor,defaultColor]], [defaultColor,[defaultColor,defaultColor,defaultColor,defaultColor]]],
    [[defaultColor,[defaultColor,defaultColor,defaultColor,defaultColor]],[defaultColor,[defaultColor,defaultColor,defaultColor,defaultColor]],[defaultColor,[defaultColor,defaultColor,defaultColor,defaultColor]],[defaultColor,[defaultColor,defaultColor,defaultColor,defaultColor]], [defaultColor,[defaultColor,defaultColor,defaultColor,defaultColor]]],
    [[defaultColor,[defaultColor,defaultColor,defaultColor,defaultColor]],[defaultColor,[defaultColor,defaultColor,defaultColor,defaultColor]],[defaultColor,[defaultColor,defaultColor,defaultColor,defaultColor]],[defaultColor,[defaultColor,defaultColor,defaultColor,defaultColor]], [defaultColor,[defaultColor,defaultColor,defaultColor,defaultColor]]],
  ],
    prices: [
      [100, 100, 100, 100, 100],
      [100, 100, 100, 100, 100],
      [100, 100, 100, 100, 100],
      [100, 100, 100, 100, 100],
      [100, 100, 100, 100, 100],
    ],
    reptiles :[
      [reptileTemplate, reptileTemplate, reptileTemplate, reptileTemplate, reptileTemplate],
      [reptileTemplate, reptileTemplate, reptileTemplate, reptileTemplate, reptileTemplate],
      [reptileTemplate, reptileTemplate, reptileTemplate, reptileTemplate, reptileTemplate],
      [reptileTemplate, reptileTemplate, reptileTemplate, reptileTemplate, reptileTemplate],
      [reptileTemplate, reptileTemplate, reptileTemplate, reptileTemplate, reptileTemplate],
    ]
});

  // THIS NEEDS TO WORK ASYNCHRONOUSLY - THIS INTERFERES WITH OTHER FUNCTIONS TOO MUCH

 // Function called on a timer to pass the time
  // Every time it's called, it represents a day going by
  const passTime = () => {
    var updatedEnclosures = [...enclosures];
    // var newGrid = {...grid};
    for(var x = 0; x!= updatedEnclosures.length; x++){
      var curReptile = {...updatedEnclosures[x].reptile};
      if(curReptile.alive){
        // Changing metrics that change over time
        curReptile.age += 0.003;
        curReptile.hunger --;
        // Checking quality of life, and reducing health if
        // quality of life bad
        if(curReptile.hunger < 80) curReptile.health -= ((100 - curReptile.hunger) / 10);
        if(curReptile.spaceReqs < updatedEnclosures[x].cubes.length) curReptile.health -= ((curReptile.spaceReqs - updatedEnclosures[x].cubes.length) * 2);
        // Add the consequences to the health
        if(curReptile.health <= 0) curReptile.lifeSpan --;
        if(curReptile.age >= curReptile.lifeSpan){
          curReptile.alive = false;
          // newGrid.prices[updatedEnclosures[x].cubes[0][1]][updatedEnclosures[x].cubes[0][1]] = "Dead";
          console.log("Dead");
        }
        console.log(curReptile.name,": Age:",curReptile.age," Health: ",curReptile.health);
      }
    }
    setEnclosures(updatedEnclosures);
    // setGrid(newGrid);
  }

// ALL BUTTON PRESS EVENTS --------------------------------------
  const onKeyPressed = (e) => {
    var newPos = [...position];
    var newColor = {...grid};
    console.log(enclosures);
    // Placing block
    if(e.key == "Enter" || e.key == " "){
      if(grid.reptiles[newPos[0]][newPos[1]].species == "NaN" && newPos[2] == defaultColor && grid.prices[newPos[0]][newPos[1]] <= cash && buildMode){
        
        // Set cube to new color
        newPos[2] = colors[placeColor];

        // Update cash
        var newC = cash;
        newC -= newColor.prices[newPos[0]][newPos[1]];
        
        // Change cube text
        newColor.prices[newPos[0]][newPos[1]] = " ";
      
        checkForEnclosure(newPos[0],newPos[1]);
        setCash(newC);
      }
    }

    // Changing terrain
    if(e.key == "]" || e.key == "["){
      var x = placeColor;
      if(e.key == "]"){
        x++;
        if(x >= colors.length) x = 0;
      } else {
        x--;
        if(x < 0) x = colors.length-1;
      }
      setPlaceColor(x);
    }

    // Moving player
    if(e.key.length >= 5 && (e.key).substring(0,5) == "Arrow")
    {
      newColor.colors[position[0]][position[1]][0] = position[2];
      if(e.key == "ArrowUp"){
        if(position[0] > 0) newPos[0]--;
      }
      else if(e.key == "ArrowDown"){
        if(position[0] < grid.colors.length-1) newPos[0]++;
      }
      else if(e.key == "ArrowLeft"){
        if(position[1] > 0) newPos[1]--;
      }
      else if(e.key == "ArrowRight"){
        if(position[1] < grid.colors.length-1)newPos[1]++;
      }

      newPos[2] = newColor.colors[newPos[0]][newPos[1]][0];
      newColor.colors[newPos[0]][newPos[1]][0] = buildMode?buildColor:playerColor;
    }
    console.log("Enclosure at this coords: " +findEnclosureAtCoords(newPos[0],newPos[1]));

    if(e.key == "Shift") {
      if(buildMode) setBID(-1);
      for(var x = 0; x!=enclosures.length;x++){
        for(var y=0; y!=enclosures[x].cubes.length;y++){
        var diffCoords = [
          [enclosures[x].cubes[y][0] - 1, enclosures[x].cubes[y][1]],
          [enclosures[x].cubes[y][0] + 1, enclosures[x].cubes[y][1]],
          [enclosures[x].cubes[y][0], enclosures[x].cubes[y][1] - 1],
          [enclosures[x].cubes[y][0], enclosures[x].cubes[y][1] + 1],
        ];            
        if(enclosures[x].cubes.indexOf(diffCoords)[0] > -1) newColor.colors[enclosures[x].cubes[y][0]][enclosures[x].cubes[y][1]][1][0] = colors[placeColor];
        if(enclosures[x].cubes.indexOf(diffCoords)[1] > -1) newColor.colors[enclosures[x].cubes[y][0]][enclosures[x].cubes[y][1]][1][1] = colors[placeColor];
        if(enclosures[x].cubes.indexOf(diffCoords)[2] > -1) newColor.colors[enclosures[x].cubes[y][0]][enclosures[x].cubes[y][1]][1][2] = colors[placeColor];
        if(enclosures[x].cubes.indexOf(diffCoords)[3] > -1) newColor.colors[enclosures[x].cubes[y][0]][enclosures[x].cubes[y][1]][1][3] = colors[placeColor];

        }
      }
      console.log(newColor);
      setBuildMode(!buildMode);
    }
    setGrid(newColor);
    setPosition(newPos);
  };
  // END OF BUTTON PRESS EVENTS ------------------------

  // EXTRA APP FUNCTIONS

  const randInRange = (min, max) => Math.floor(Math.random() * (max - min) + min);

  // Generates single snake
  const generateNewSnake = () => {
    var curReptile = {...reptiles.snakes[randInRange(0,reptiles.snakes.length)]};
    const newLifeSpan = randInRange(curReptile.lifeSpan[0],curReptile.lifeSpan[1]);
    curReptile.lifeSpan = newLifeSpan;
    curReptile.sex = randInRange(1,3) == 1 ? "M" : "F";
    const newAge = randInRange(0,3);
    curReptile.age = newAge;
    var curMorphs = [], numOfMorphs = 0, wT = false;
    for(var y=0; y!= curReptile.morphs.length;y++){
      if(randInRange(0,100) >= 60){
        if(curReptile.morphs[y].chromosome == "WT"){
          if(!wT) wT = true;
          else continue;
        }
        curMorphs.push(curReptile.morphs[y]);
        numOfMorphs ++;
      }
      if(numOfMorphs >= 2) break;
    }
    if(numOfMorphs <= 0) curMorphs.push(curReptile.morphs[0]);
    curReptile.morphs = curMorphs;
    curReptile.hunger = 100;
    curReptile.health = randInRange(50,100);
    curReptile.alive = true;
    if(curReptile.sex == "F") curReptile.gravid = false;
    return curReptile;
  }

  // Generates the store stock and updates
  const generateShopStock = () => {
    var shopItems = [];
    for(var x = 0; x!= stockNum; x++){shopItems.push(generateNewSnake());}
    setStock(shopItems);
  }

  // Used to find and return the id of an enclosure at a specific coordinate
  const findEnclosureAtCoords = (curX, curY) => {
    for(var x=0; x!= enclosures.length; x++){
      for(var y=0; y!= enclosures[x].cubes.length; y++){
        if(enclosures[x].cubes[y][0] == curX && enclosures[x].cubes[y][1] == curY) return x;
      }
    }
    return -1;
  };

  // Checks surrounding areas for enclosure, if there is one
  // it joins this enclosure to that, else it creates a new one

  // In future the user needs to be able to specify whether 
  // they want to create a new enclosure or increase the size
  // of an old one, so that they are able to use all the space
  // in the rack without running creating one big enclosure.
  const checkForEnclosure = (curX, curY) => {
    var newEnc = [...enclosures];
    // var existingEnc = false;

    // var diffCoords = [
    //   [curX - 1, curY],
    //   [curX + 1, curY],
    //   [curX, curY - 1],
    //   [curX, curY + 1],
    // ];

    // for(var x=0; x!= enclosures.length; x++){
    //   for(var y=0; y!= enclosures[x].cubes.length; y++){
    //     for(var z = 0; z!= diffCoords.length; z++){
    //       if(enclosures[x].cubes[y][0] == diffCoords[z][0] && enclosures[x].cubes[y][1] == diffCoords[z][1]){
    //         newEnc[x].cubes.push([curX,curY]);
    //         newEnc[x].size ++;;
    //         console.log("Cube: " + curX + ":"+curY +" added to enclosure "+ x, ". Size is now " + newEnc[x].size);
    //         existingEnc = true;
    //       }
    //     }
    //   }
    // }
    var nBID = bID;
    if(bID == -1){
      newEnc.push({
        id: enclosures.length,
        cubes: [[curX,curY]],
        reptile: "NaN",
        size: 1
      })
      nBID = enclosures.length;
    }else newEnc[bID].cubes.push([curX,curY]) ;

    setBID(nBID);
    setEnclosures(newEnc);
  };

  // Function to deal with when the the draggable components are dropped 
  const droppedFromShop = (element, text) => {
    if(element.id[0] != null ){
      // Get coordinates of element that droppable was dropped on
      var coords = [element.id[0],element.id[1]];
      console.log("This was dropped at: ",coords[0]," ",coords[1]);
      // Check if there is an enclosure at those coordinates and get the id
      var enclosureID = findEnclosureAtCoords(coords[1],coords[0]);
      console.log("Dropped on enclosure "+ enclosureID);
      // Get the total price of the reptile based on morph price
      var morphPrice = 0;
      for(var x = 0; x!= text.morphs.length; x++) morphPrice += text.morphs[x].price;
      // IF user has enough cash to purchase this item and an enclosure exists
      if(morphPrice <= cash && enclosureID > -1){
        console.log(enclosures[enclosureID]);
        // If that enclosure doesn't have a reptile
        if(enclosures[enclosureID].reptile == "NaN"){
          console.log(text.species + " was rehomed into enclosure " + enclosureID);
          var nGrid = {...grid};
          var nEnclosures = [...enclosures];
          var nCash = cash;
          // Take away the cash price of the reptile from the user
          nCash -= morphPrice;
          // Display the reptile species in the cube
          nGrid.prices[coords[1]][coords[0]] = text.species;
          // Put the reptile info into the coordinates
          nGrid.reptiles[coords[1]][coords[0]] = text;
          // Puts reptile info into the enclosure
          nEnclosures[enclosureID].reptile = text;
          var itemNum = -1;
          // Finds which index the item is in the shop
          for (var x = 0;x!=shopStock.length;x++) if(shopStock[x] == text) {itemNum = x; break;}
          var newShop = [...shopStock];
          // Remove item from shop
          console.log(itemNum);
          newShop.splice(itemNum,1);
          
          console.log(newShop);
          // Update hook values
          setCash(nCash);
          setGrid(nGrid);
          setStock(newShop);
          setEnclosures(nEnclosures);
        }
      }
    }
  };

  // Function that makes grid bigger
  const gridExpansion = () => {
    var newGrid = {...grid};
    newGrid.colors = expand(newGrid.colors, defaultColor);
    newGrid.prices = expand(newGrid.prices, 100);
    newGrid.reptiles = expand(newGrid.reptiles, reptileTemplate);
    setGrid(newGrid);
  }

 
  // Function used to individually expand each array in the object
  const expand = (list2D, defaultValue) => {
    var newRow = [];
    for(var x=0; x!=list2D.length; x++) newRow.push(defaultValue);
    list2D.push(newRow);
    for(var x=0; x!=list2D.length; x++) list2D[x].push(defaultValue);
    return list2D;
  }

  // Functions to be executed on startup
  if(!stockGenerated) {generateShopStock(); setGenerated(true);}
  // setInterval(passTime,1000);

// APP HTML RETURN -------------------------------------------------
  return (
    <div onKeyDown={onKeyPressed} tabIndex={0}>
      <div style = {{textAlign: "center"}}>
        <div style = {{display: "inline-block", verticalAlign: "middle"}}>
          <h1>Idle Reptile Rack</h1>
          <h3>Cash: {["£",cash]}</h3>
          <Grid gridColor = {grid.colors} gridText = {grid.prices}/>
        </div>
        <div style = {{display: "inline-block", verticalAlign: "middle"}}>
          <h1>Shop</h1>
          <Shop stock = {shopStock} outcomeFunction={droppedFromShop}/>
        <div/>
      </div>
      <div>
        <Cube size = {100} text = {"Terrain Selected"} color = {[colors[placeColor],-1]} table = {false}/>
      </div>
    </div>  
    </div>
  );
};
// END OF APP RETURN --------------------------------------------------



// EXTRA COMPONENTS

// Grid component
const Grid = ({gridColor, gridText}) => {
  var grid = [];

  for(var x = 0; x != gridColor.length; x++){
    grid.push(<Row rowID = {x.toString()} key = {x}  rowColor = {gridColor[x]} rowText = {gridText[x]}/>);
  }

  return (
    <table style={{borderCollapse: "collapse"}}>
      <tbody>
        {grid}
      </tbody>
    </table>
  );
};

// Row component
const Row = ({rowColor, rowText, rowID}) => {
  var rows = [];
  for(var x = 0; x != rowColor.length; x++){
    rows.push(<Cube id = {x+rowID.toString()} key = {x} size = {100} color = {rowColor[x]} text = {rowText[x]}table = {true} />);
  }
  
  return(
    <tr>
      {rows}
    </tr>
  );
}

// Cube component
const Cube = ({size, color, text, table, id}) => {
  var txtColor = "black";
  var cBorderColor = color[0];
  if(color[0] == "black" || color[0] == "blue") txtColor = "white";
  if(color[0] == "black") cBorderColor = "white";

  const style = {

    color: txtColor, 
    textAlign: "center",
    backgroundColor: color[0], 
    border: "2px solid " + cBorderColor,
    borderTopColor: color[1][3],
    borderLeftColor: color[1][0],
    borderRightColor: color[1][1],
    borderBottomColor: color[1][2],
    height: size, 
    width: size
  }

  if(table){
    return(
      <td id = {id} style = {style}>{text}</td>
    );
  }
  return(
    <div id = {id} style = {style} >{text}</div>
  );
}

// Component used to generate and interact with the shop
const Shop = ({stock, outcomeFunction}) => {
  var shopDisplay = [];
  for(var x = 0; x!=stock.length;x++) shopDisplay.push(<ReptileDraggable key = {x} outcomeFunction={outcomeFunction} reptile={stock[x]}/>);
  return (
    <div style = {{
      margin: "20px"
    }}>    
      {shopDisplay}
    </div>
  );
}


// Component used to interact with purchasing reptiles

const ReptileDraggable = ({outcomeFunction, reptile}) => {
    
  if(reptile != null){
    return (
      <Draggable outcomeFunction={outcomeFunction} text = {reptile}/>
    );
  }
}

// Draggable component for shop items
const Draggable = ({outcomeFunction, text}) => {

  const handleDragEnd = (event) => {
    outcomeFunction(document.elementFromPoint(event.clientX,event.clientY), text);
  };

  var totalPrice = 0;
  for(var x = 0; x!= text.morphs.length;x++) totalPrice += text.morphs[x].price;
  
  var finalText = [text.name, <br key = {0}/>,"Age: ",text.age,<br key = {4}/>,"Price: £",totalPrice,<br key = {1}/>];

  var sex = "Unknown";
  if(text.age >= text.mature) sex = text.sex;
  finalText.push("Sex: ",sex,<br key = {79}/>);

  for(var x =0 ;x!=text.morphs.length;x++){finalText.push(text.morphs[x].name); finalText.push(<br key = {"y"+x}/>);}

  return (
    <div
        draggable
        onDragEnd={handleDragEnd}
        style = {
          {
            width: 100,
            height: 110,
            border: "2px solid black",
            color: "white",
            backgroundColor: "darkgrey"
          }
        }

      >
        {finalText}
    </div>
  );
}

export default App;
