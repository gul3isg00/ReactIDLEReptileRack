import { useState } from "react";


const App = () => {

  const colors = ["darkolivegreen", "cornflowerblue", "burlywood"];
  const defaultColor = "black";
  const playerColor = "lightgray";

  const reptileTemplate = {
    species: "NaN", 
    name: "NaN", 
    prefEnviroments: ["NaN"], 
    diet: ["NaN"],
    lifeSpan: [-1,-1],
    sex: "NaN",
    spaceReqs: -1,
    venomous: "NaN",
    morphs: ["NaN"],
    price: -1
  };

  // SNAKES
  // THESE ARE JUST TEMPLATES, IN FUTURE I WANT REPTILES BASED OFF
  // THESE TEMPLATES TO BE RANDOMLY GENERATED, THEN ALL DATA ABOUT
  // SPECIFIC REPTILES TO BE STORED IN THE ENCLOSURES.
  const reptiles = { 
    snakes: [{
      species: "Corn snake", 
      name: "Corn snake",
      prefEnviroments: ["burlywood"], 
      diet: ["Rodents"],
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
    }
  ]
};
  // END OF SNAKES

  // States -------------------------------------
  const [cash, setCash] = useState(1000);
  const [placeColor, setPlaceColor] = useState(0);
  const [position, setPosition] = useState([1,1,defaultColor]);
  const [enclosures, setEnclosures] = useState([]);

  const [shopItemsState, setShopItems] = useState([]);
  const [shopLoad, setShopLoad] = useState(false);
 
  const [grid, setGrid] = useState({
    colors: [
    [defaultColor,defaultColor,defaultColor, defaultColor, defaultColor],
    [defaultColor,playerColor,defaultColor, defaultColor, defaultColor],
    [defaultColor,defaultColor,defaultColor, defaultColor, defaultColor],
    [defaultColor,defaultColor,defaultColor, defaultColor, defaultColor],
    [defaultColor,defaultColor,defaultColor, defaultColor, defaultColor],
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
// ALL BUTTON PRESS EVENTS --------------------------------------
  const onKeyPressed = (e) => {
    var newPos = [...position];
    var newColor = {...grid};

    // Placing block
    if(e.key == "Enter" || e.key == " "){
      if(grid.reptiles[newPos[0]][newPos[1]].species == "NaN" && newPos[2] == defaultColor && grid.prices[newPos[0]][newPos[1]] <= cash){
        
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
      newColor.colors[position[0]][position[1]] = position[2];
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

      newPos[2] = newColor.colors[newPos[0]][newPos[1]];
      newColor.colors[newPos[0]][newPos[1]] = playerColor;
    }
    console.log("Enclosure at this coords: " +findEnclosureAtCoords(newPos[0],newPos[1]));

    setGrid(newColor);
    setPosition(newPos);
  };
  // END OF BUTTON PRESS EVENTS ------------------------

  // EXTRA APP FUNCTIONS

  // Used to find and return the id of an enclosure at a specific coordinate
  const findEnclosureAtCoords = (curX, curY) => {
    for(var x=0; x!= enclosures.length; x++){
      for(var y=0; y!= enclosures[x].cubes.length; y++){
        if(enclosures[x].cubes[y][0] == curX && enclosures[x].cubes[y][1] == curY) return x;
      }
    }
    return -1;
  };

  const randInRange = (min, max) => Math.floor(Math.random() * (max - min) + min);

  const generateShopItems = () => {
    var shopItems = [];
    const numOfItems = 5;
    for(var x = 0; x!= numOfItems; x++){
      var curReptile = {...reptiles.snakes[randInRange(0,reptiles.snakes.length-1)]};
      const newLifeSpan = randInRange(curReptile.lifeSpan[0],curReptile.lifeSpan[1]);
      curReptile.lifeSpan = newLifeSpan;
      curReptile.sex = randInRange(1,3) == 1 ? "M" : "F";
  
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
      console.log(curReptile);
      console.log("key ", x);
      shopItems.push(<ReptileDraggable key = {x} outcomeFunction={droppedFromShop} reptile={curReptile}/>)
    }
    setShopLoad(true);
    setShopItems(shopItems);
  }
  // Checks surrounding areas for enclosure, if there is one
  // it joins this enclosure to that, else it creates a new one

  // In future the user needs to be able to specify whether 
  // they want to create a new enclosure or increase the size
  // of an old one, so that they are able to use all the space
  // in the rack without running creating one big enclosure.
  const checkForEnclosure = (curX, curY) => {
    var newEnc = [...enclosures];
    var existingEnc = false;

    var diffCoords = [
      [curX - 1, curY],
      [curX + 1, curY],
      [curX, curY - 1],
      [curX, curY + 1],
    ];
    console.log(enclosures);
    console.log(diffCoords);
    for(var x=0; x!= enclosures.length; x++){
      for(var y=0; y!= enclosures[x].cubes.length; y++){
        for(var z = 0; z!= diffCoords.length; z++){
          if(enclosures[x].cubes[y][0] == diffCoords[z][0] && enclosures[x].cubes[y][1] == diffCoords[z][1]){
            newEnc[x].cubes.push([curX,curY]);
            newEnc[x].size ++;
            console.log("Cube: " + curX + ":"+curY +" added to enclosure "+ x, ". Size is now " + newEnc[x].size);
            existingEnc = true;
          }
        }
      }
    }
    console.log("linked to existing enclosure? ", existingEnc);

    if (!existingEnc){
      newEnc.push({
        id: enclosures.length,
        cubes: [[curX,curY]],
        reptile: "NaN",
        size: 1
      })
      console.log("No enclosure here, creating one at "+curX+":"+curY);
    }

    console.log("new enclosures?");
    console.log(newEnc);
    setEnclosures(newEnc);
  };

  // Function to deal with when the the draggable components are dropped 
  const droppedFromShop = (element, text) => {
    console.log([...enclosures]);
    console.log(element.id);
    if(element.id[0] != null ){
      console.log("not null");
      // Gets coordinates of element
      var coords = [element.id[0],element.id[1]];
      // Finds the enclosure ID
      var enclosureID = findEnclosureAtCoords(coords[1],coords[0]);
      console.log("Dropped on enclosure "+ enclosureID);
      var curPrice = 0;
      for(var x = 0; x != text.morphs.length; x++) curPrice += text.morphs[x].price;
      console.log("price of that animal ",curPrice );
      if(curPrice<= cash && enclosureID > -1){
        console.log(enclosures[enclosureID]);
        if(enclosures[enclosureID].reptile == "NaN"){
          console.log(text.species + " was rehomed into enclosure " + enclosureID);
          var nGrid = {...grid};
          var nEnclosures = [...enclosures];
          var nCash = cash;
          nCash -= curPrice;
          nGrid.prices[coords[1]][coords[0]] = text.species;
          nGrid.reptiles[coords[1]][coords[0]] = text;
          nEnclosures[enclosureID].reptile = text;
          setCash(nCash);
          setGrid(nGrid);
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

  //LOADS SHOP ITEMS
  if(!shopLoad) generateShopItems();

// APP HTML RETURN -------------------------------------------------
  return (
    <div onKeyDown={onKeyPressed} tabIndex={0}>
      <div style = {{textAlign: "center"}}>
        <div style = {{display: "inline-block", verticalAlign: "middle"}}>
          <h1>Idle Reptile Rack</h1>
          <Grid gridColor = {grid.colors} gridText = {grid.prices}/>
        </div>
        <div style = {{display: "inline-block", verticalAlign: "middle"}}>
          <h1>Shop</h1>
          <Shop shopItems = {shopItemsState} />
        <div/>
      </div>
      <div>
        <h1>Actions</h1>
        <button onClick={gridExpansion}>Increase size</button>
        <h3>Cash: {cash}</h3>
        <Cube size = {100} text = {"Terrain Selected"} color = {colors[placeColor]} table = {false}/>
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
const Cube = ({size, color, text, table, id, }) => {
  var txtColor = "black";
  var cBorderColor = color;
  if(color == "black" || color == "blue") txtColor = "white";
  if(color == "black") cBorderColor = "white";

  const style = {
    color: txtColor, 
    textAlign: "center",
    backgroundColor: color, 
    border: "2px solid " + cBorderColor,
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
const Shop = ({shopItems}) => {
    return (
      <div>    
        {shopItems}
      </div>
    );
};

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
  }

  var curPrice = 0;
  for (var x=0; x!= text.morphs.length;x++) curPrice += text.morphs[x].price;
  return (
    <div
        draggable
        onDragEnd={handleDragEnd}
        style = {
          {
            width: 100,
            height: 100,
            color: "white",
            backgroundColor: "darkgrey"
          }
        }

      >
        {[text.species, <br key = {0} />, "Price: ", curPrice]}
    </div>
  );
}

export default App;
