//constants
const charDisplayed = 15
const numDisplayed = 3
const startIndex = 1


//trello api access keys
let key = ''
let token = ''
let listId = ''

//pull json from api
let url = 'https://api.trello.com/1/lists/' + listId + '/cards?key=' + key + '&token=' + token
var widget

//try to access api information
try {
  let r = new Request(url)
  let json = await r.loadJSON()

  var todoItems = []

  //fill array with tasks from list
  for (i = 0; i < json.length - startIndex; i++) {
    let curTask = json[i + startIndex].name

    if (curTask == "In Progress") break;

    todoItems[i] = curTask
    console.log(todoItems[i])
  }

  //build widget
  widget = buildWidget(todoItems)

} catch(err) {
  widget = offlineWidget()
}

widget.presentSmall() //show example

Script.setWidget(widget)
Script.complete()

// display first numDisplayed tasks in today and show + if there are more
function buildWidget(todoList) {
  let w = new ListWidget()

  w.backgroundColor = new Color("#FF8C00")

  let titleText = w.addText("Today")
  titleText.textColor = Color.white()
  titleText.font = Font.boldSystemFont(20)
  titleText.leftAlignText()

  if (todoList.length == 0) {
    let doneText = w.addText("All Done!")
    doneText.textColor = Color.black()
    doneText.textOpacity = .4

  } else {

    //add numDisplayed amount of elements to the list if we have enough
    for (i = 0; i < numDisplayed && i < todoList.length; i++) {
      var cur = (todoList[i].length > charDisplayed ? todoList[i].substring(0, charDisplayed - 2) + ".." : todoList[i])
      let taskText = w.addText(cur)
      taskText.textColor = Color.black()
    }

    //add sign if there was extra cutoff
    if (numDisplayed < todoList.length) {
      let moreIndicator = w.addText("+")
      moreIndicator.textColor = Color.white()
    }
  }

  w.setPadding(4, 4, 0, 0)
  return w
}

//widget placeholder if unable to connect to Trello API
function offlineWidget() {
  let w = new ListWidget()
  w.backgroundColor = new Color("#ADD8E6")
  let titleText = w.addText("Offline")
  titleText.textColor = Color.white()
  titleText.font = Font.boldSystemFont(20)
  titleText.leftAlignText()
  w.setPadding(4, 4, 0, 0)
  return w
}
