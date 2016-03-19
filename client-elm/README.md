# Creating a Feature

_Note: this is Part 1 of "Composing Features and Behaviours in the Elm Architecture". See the
[Introduction](https://github.com/foxdonut/adventures-reactive-web-dev/tree/master/client-elm#composing-features-and-behaviours-in-the-elm-architecture)
for an overview and the table of contents._

Questions as Github issues, and corrections or suggestions for improvement as Github pull requests, are welcome.

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

## TodoList.Update

In `TodoList.Update` is where we handle actions and trigger any other actions that should occur.
These other actions are of two varieties:

1. Actions within the `TodoList` feature itself, handled by the `update` function, and
2. Signaling events to other features.

Two important principles to notice in `Update` are:

1. Actions can be triggered both within the `TodoList` feature and from outside. In the latter case,
the `TodoList` feature doesn't need to "know" about these other features.
2. Similarly, the `TodoList` feature signals events to outside features, but has no knowledge of
what those features are.

Put another way, the code within `TodoList/` has no `import` statements of any other feature
modules.

Still in the interest of keeping the code neatly decoupled, the `TodoList.Update` module defines the
_services_ that it needs, but _does not_ include the implementation. The services are defined in a
separate module, `TodoList.Services`, and passed in to `TodoList.Update` as a parameter. This makes
it easy to substitute one implementation of the services for another, and also facilitates testing.

Let's look at these services:

[TodoList/Update.elm](TodoList/Update.elm)
```elm
type alias Services =
  { loadTodos : Task Never Model
  , deleteTodo : Int -> Task Never (Maybe Int)
  , signalEditTodo : Todo -> Action -> Effects Action
  , signalUpdatedList : List Todo -> Action -> Effects Action
  }
```

`TodoList.Update` needs to know how to load the list of todos from the server, and how to send a
request to the server to delete a todo. As outgoing signals, the `TodoList` feature notifies
listeners when a todo needs to be edited (when the user clicks on an `Edit` button), and when the
list has been updated.

The `update` function takes an implementation of these services as a parameter:

[TodoList/Update.elm](TodoList/Update.elm)
```elm
update : Services -> Action -> Model -> ( Model, Effects Action )
```

With partial function application, passing in the `Services` implementation will return a function
that follows the signature of the standard `update` function in the Elm architecture, suitable for
passing to `StartApp.start`.

Let's look at some of the implementation of the `update` function:

[TodoList/Update.elm](TodoList/Update.elm)
```elm
update services action model =
  case action of
    NoOp ->
      ( model, Effects.none )

    LoadList ->
      ( { todos = []
        , message = "Loading, please wait..."
        }
      , Effects.task (services.loadTodos |> Task.map ShowList)
      )

    ShowList list ->
      ( list, services.signalUpdatedList list.todos NoOp )
```

When the user presses on the _Load Todos_ button, that triggers the `LoadList` action. The model
shows a "please wait" message to the user and launches the task of loading the todos from the
server. When that resolves, the result is passed on to the `ShowList` action. That, in turn, returns
the list in the model, and triggers the task of signaling the updated list to listeners. Finally the
chain of action ends with `NoOp`.

Here is the rest of the `update` function:

[TodoList/Update.elm](TodoList/Update.elm)
```elm
UpdateList maybeTodo ->
  let
    updatedModel =
      updateModelFromTodo model maybeTodo
  in
    ( updatedModel, actionEffect (ShowList updatedModel) )

EditTodo todo ->
  ( model, services.signalEditTodo todo NoOp )

DeleteTodo todoId ->
  ( { model | message = "Deleting, please wait..." }
  , Effects.task (services.deleteTodo todoId) |> Effects.map DeletedTodo
  )

DeletedTodo maybeTodoId ->
  case maybeTodoId of
    Just todoId ->
      let
        updatedModel =
          updateModelFromId model todoId
      in
        ( updatedModel, actionEffect (ShowList updatedModel) )

    Nothing ->
      ( { model | message = "An error occured when deleting a Todo." }, Effects.none )

```

Notice the `UpdateList` case. This action is triggered from _outside_ of the `TodoList` feature, to
notify that the list needs to updated with the passed-in todo. Later, this will be triggered from
the `TodoForm` feature when the user saves a todo. Now, to handle this action, we update the model
and trigger the `ShowList` action. Since the model that we return contains the updated list, why the
need to trigger `ShowList`? Because that action handle notifies outside listeners! We keep that
logic in one place and reuse it from other actions by triggering the `ShowList` action. Finally,
notice the `actionEffect` function: that is a convenience function that we'll look at shortly, along
with other convenience utilities.

## TodoList.Service

## TodoList.Feature


