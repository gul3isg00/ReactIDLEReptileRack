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

  // States -------------------------------------
  const [cash, setCash] = useState(1000);
  const [placeColor, setPlaceColor] = useState(0);
  const [position, setPosition] = useState([1,1,defaultColor]);
  const [enclosures, setEnclosures] = useState([]);

  // SNAKES
  const [snakes, setSnakes] = useState([{
      species: "Corn snake", 
      name: "Corn snake",
      prefEnviroments: ["burlywood"], 
      diet: ["Rodents"],
      lifeSpan: [12, 20],
      sex: "F",
      spaceReqs: 3,
      venomous: "N",
      morphs: ["Basic"],
      price: 30
    },{
      species: "Hognose snake", 
      name: "Hognose snake",
      prefEnviroments: ["burlywood"], 
      diet: ["Rodents", "Frogs"],
      lifeSpan: [9, 19],
      sex: "F",
      spaceReqs: 2,
      venomous: "RF",
      morphs: ["Basic"],
      price: 30
    },{
      species: "Ball python", 
      name: "Ball python",
      prefEnviroments: ["darkolivegreen"], 
      diet: ["Rodents"],
      lifeSpan: [15, 30],
      sex: "F",
      spaceReqs: 2,
      venomous: "No",
      morphs: ["Basic"],
      price: 30
    },
  ]);
  // END OF SNAKES
 
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

    setGrid(newColor);
    setPosition(newPos);
  };
  // END OF BUTTON PRESS EVENTS ------------------------

  // EXTRA APP FUNCTIONS

  const checkSurroundingCubes = (curX, curY) => {
    // USE THIS TO BUILD / RECOGNISE ENCLOSURES
    // ONLY ONE REPTILE PER ENCLOSURE (FOR NOW)
  };

  // Function to deal with when the the draggable components are dropped 
  const droppedFromShop = (element, text) => {
    if(element.id[0] != null && element.innerHTML != "100"){
      var coords = [element.id[0],element.id[1]];
      if(text.price <= cash){
        var nGrid = {...grid};
        var nCash = cash;
        nCash -= text.price;
        nGrid.prices[coords[1]][coords[0]] = text.species;
        nGrid.reptiles[coords[1]][coords[0]] = text;
        setCash(nCash);
        setGrid(nGrid);
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
          <Shop snakeList={snakes} outcomeFunction={droppedFromShop}/>
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
const Shop = ({snakeList, outcomeFunction}) => {
  var shopItems = [];
  for (var x=0;x != snakeList.length; x++) shopItems.push(<ReptileDraggable key = {x} reptile={snakeList[x]} outcomeFunction={outcomeFunction}/>)
  return (
    <div>    
      {shopItems}
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
  }

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
        {text.species + ", Price: " + text.price}
    </div>
  );
}

export default App;
