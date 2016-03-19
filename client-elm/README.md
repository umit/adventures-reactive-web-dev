# Creating a Feature

_Note: this is Part 1 of "Composing Features and Behaviours in the Elm Architecture". See the
[Introduction](https://github.com/foxdonut/adventures-reactive-web-dev/tree/master/client-elm#composing-features-and-behaviours-in-the-elm-architecture)
for an overview and the table of contents._

## Common.Model

We'll start with a model for our todos. Since this will be used throughout the application, `Todo`
is defined in the `Common.Model` module:

[Common/Model.elm](Common/Model.elm)
```elm
module Common.Model (Todo, blankTodo) where


type alias Todo =
  { id : Int
  , priority : Int
  , description : String
  }


blankTodo : Todo
blankTodo =
  { id = 0
  , priority = 0
  , description = ""
  }
```

A `Todo` has an id, a priority, and a description. For convenience, we also have a `blankTodo`
instance defined here.

## TodoList.Model

Next, let's define the model for our `TodoList` feature:

[TodoList/Model.elm](TodoList/Model.elm)
```elm
type alias Model =
  { todos : List Todo
  , message : String
  }


initialModel : Model
initialModel =
  { todos = []
  , message = "Initializing..."
  }
```

The model includes the list of todos, and a `message` that we can use to display status text.

## TodoList.Action

Here are the actions that we have for `TodoList`:

[TodoList.Action.elm](TodoList.Action.elm)
```elm
type Action
  = NoOp
  | LoadList
  | ShowList Model
  | UpdateList (Maybe Todo)
  | EditTodo Todo
  | DeleteTodo Int
  | DeletedTodo (Maybe Int)
```

Our initial todo list is empty, and we'll have a button to request the list from the server. This
will trigger the `LoadList` action. Once obtained, `ShowList` is used to display the list in the
view. When a todo has been added or changed, `UpdateList` indicates that the list needs updating.

The list of todos is displayed in a table, one todo per row, each with an `Edit` button and a
`Delete` button. These trigger the `EditTodo` and `DeleteTodo` actions, respectively. The `EditTodo`
action notifies listeners, but doesn't have any effect on the `TodoList` feature itself.
`DeleteTodo`, on the other hand, has the effect of sending a delete request to the server. Once that
has completed, the `DeletedTodo` action is triggered so that the todo can be deleted from the list.

## TodoList.View

Here is the code that renders the todo list:

[TodoList/View.elm](TodoList/View.elm)
```elm
renderTodo : Signal.Address Action -> Todo -> Html
renderTodo address todo =
  tr
    []
    [ td [] [ todo.priority |> toString |> text ]
    , td [] [ todo.description |> text ]
    , td
        []
        [ button
            [ class "btn btn-primary btn-xs"
            , onClick address (EditTodo todo)
            ]
            [ text "Edit" ]
        , span [] [ text " " ]
        , button
            [ class "btn btn-danger btn-xs"
            , onClick address (DeleteTodo (.id todo))
            ]
            [ text "Delete" ]
        ]
    ]


view : Signal.Address Action -> Model -> Html
view address model =
  div
    [ class "row" ]
    [ div
        [ class "col-md-8" ]
        [ div
            []
            [ button
                [ class "btn btn-primary btn-sm"
                , onClick address LoadList
                ]
                [ text "Load Todos" ]
            ]
        , div [] [ span [] [ text "Todo List: " ], span [] [ text model.message ] ]
        , table
            [ class "table" ]
            [ thead
                []
                [ tr
                    []
                    [ th [] [ text "Priority" ]
                    , th [] [ text "Description" ]
                    , th [] [ text "Action" ]
                    ]
                ]
            , tbody [] (List.map (renderTodo address) model.todos)
            ]
        ]
    ]
```

I mentioned that I assume you are familiar with the Elm architecture, and the code above should be
familiar. The view is rendered with `Html` functions. The `view` function receives an address to
which to send signals for triggering actions. The _Load Todos_, _Edit_, and _Delete_ buttons
respectively trigger the `LoadList`, `EditTodo`, and `DeleteTodo` actions.


