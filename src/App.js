import { useState } from "react";

const App = () => {

  const colors = ["darkolivegreen", "cornflowerblue", "burlywood", "black"];
  const defaultColor = "black";
  const playerColor = "lightgray";

  // States -------------------------------------
  const [cash, setCash] = useState(1000);
  const [placeColor, setPlaceColor] = useState(0);
  const [position, setPosition] = useState([1,1,defaultColor]);
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
    ]
});
// ALL BUTTON PRESS EVENTS --------------------------------------
  const onKeyPressed = (e) => {
    var newPos = [...position];
    var newColor = {...grid};

    // Placing block
    if(e.key == "Enter" || e.key == " "){
      if(grid.prices[position[0]][position[1]] != " " &&  grid.prices[newPos[0]][newPos[1]] <= cash){
        newPos[2] = colors[placeColor];
        var newC = cash;
        newC -= newColor.prices[newPos[0]][newPos[1]];
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
  // Function to deal with when the the draggable components are dropped 
  const droppedFromShop = (element, text) => {
    if(element.id[0] != null && element.innerHTML != "100"){
      var coords = [element.id[0],element.id[1]];
      console.log(coords);
      var nGrid = {...grid};
      nGrid.prices[coords[1]][coords[0]] = text;
      setGrid(nGrid);
    }
  };

  // Function that makes grid bigger
  const gridExpansion = () => {
    var newGrid = {...grid};
    newGrid.colors = expand(newGrid.colors, defaultColor);
    newGrid.prices = expand(newGrid.prices, 100);
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
          <Draggable text = {"Snake"} outcomeFunction = {droppedFromShop} ></Draggable>
          <Draggable text = {"Lizard"} outcomeFunction = {droppedFromShop} ></Draggable>
          <Draggable text = {"Frog"} outcomeFunction = {droppedFromShop} ></Draggable>
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
    grid.push(<Row rowID = {x.toString()} key = {x} rowColor = {gridColor[x]} rowText = {gridText[x]}/>);
  }

  return (
    <table>
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
  if(color == "black" || color == "blue") txtColor = "white";

  const style = {
    color: txtColor, 
    textAlign: "center",
    backgroundColor: color, 
    height: size, 
    width: size,
    border: color
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
            backgroundColor: "black"
          }
        }

      >
        {text}
    </div>
  );
}

export default App;
