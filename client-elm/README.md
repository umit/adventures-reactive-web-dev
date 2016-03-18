# Connecting Features Together

We now have the `TodoList` feature which signals when the user wants to edit a `Todo`, via
`outputs.onEditTodo`. Let's add the `TodoForm` feature and connect it to `onEditTodo` so that when
the user clicks on an _Edit_ button in the `TodoList`, the `TodoForm` gets populated.

We create the `TodoForm` feature with the same file structure as the `TodoList` feature:

```
TodoForm/
  Action.elm
  Feature.elm
  Model.elm
  Service.elm
  Update.elm
  View.elm
```

Let's look at the essential parts of each piece.

## TodoForm.Model

The model for `TodoForm` contains a single `Todo`, the one being edited in the form.

```elm
type alias Model =
  { todo : Todo
  }


initialModel : Model
initialModel =
  { todo = blankTodo
  }
```

Initially, the `Todo` is blank.

## TodoForm.Action

The `TodoForm`'s actions are as follows:

```elm
type Action
  = NoOp
  | Edit Todo
  | ClearForm
  | Save Todo
  | Saved (Maybe Todo)
```

Note that the `Edit` action is triggered from _outside_ `TodoForm`, namely by `TodoList`, but
neither has any knowledge of the other. In other terms, none of the code from `TodoForm` imports
anything from `TodoList`, nor vice versa.

The `ClearForm` action gets triggered when the user presses the `Cancel` button, and also after
having saved a todo. The `Save` action triggers a request to the server, and then produces the
`Saved` action with the `Todo` from the server. Notice that this is `Maybe Todo`, where `Nothing`
means that the request resulted in an error.

## TodoForm.Service

As we did for the `TodoList` feature, the `TodoForm` feature has a separate service for creating
tasks that interact with the server.

`TodoForm.Service` exposes the `saveTodo` function:

[TodoForm/Service.elm](TodoForm/Service.elm)
```elm
saveTodo : Todo -> Task Never (Maybe Todo)
```

The function takes a `Todo` and returns a `Task` that sends a request to the server to save the
todo. If the request fails, the result is `Nothing`. If the request succeeds, the result is the
updated `Todo`. If the todo was a new one, the updated todo contains the server-generated id.

## TodoForm.View

`TodoForm.View` renders the form. The fields are populated with the information from the model, so
that clicking on `Edit` in the `TodoList` populates the form. For example, the description field is
rendered as follows:

[TodoForm/View.elm](TodoForm/View.elm)
```elm
view : Signal.Address Action -> Model -> Html
view address model =
  div
  -- ...
  [ form
    []
    -- ...
    , div
        [ class "form-group" ]
        [ label [ for "description" ] [ text "Description:" ]
        , input
            [ class "form-control"
            , value model.todo.description
            -- ...
            ]
            []
        ]
```

Notice the line with `value model.todo.description`.

Another key part of the form view is the _Save_ button:

[TodoForm/View.elm](TodoForm/View.elm)
```elm
[ button
    [ class "btn btn-primary btn-xs"
    , onWithOptions
        "click"
        { preventDefault = True, stopPropagation = False }
        targetValue
        (always (Signal.message address (Save model.todo)))
    ]
    [ text "Save" ]
```

Clicking on the _Save_ button triggers the `Save` action.

## TodoForm.Update

The `update` function for `TodoForm` includes the following code:

[TodoForm/Update.elm](TodoForm/Update.elm)
```elm
type alias Services =
  { saveTodo : Todo -> Task Never (Maybe Todo)
  , signalSaveTodo : Maybe Todo -> Action -> Effects Action
  }

-- ...

update : Services -> Action -> Model -> ( Model, Effects Action )
update services action model =
  case action of
    NoOp ->
      ( model, Effects.none )

    Edit todo ->
      ( { todo = todo }, Effects.none )

    ClearForm ->
      initialModelAndEffects

    Save todo ->
      ( model, Effects.task (services.saveTodo todo) |> Effects.map Saved )

    Saved maybeTodo ->
      ( model, services.signalSaveTodo maybeTodo ClearForm )

```

Again, we are passing in `Services`, to keep the implementation details of the services outside of
`TodoForm.Update`. The handling is pretty simple for the `NoOp`, `Edit`, and `ClearForm` actions.
You can see that `Save todo` calls `services.saveTodo` to create the task that saves the todo to the
server, and then triggers the `Saved` action.

In turn, the `Saved` action signals listeners that the todo has been saved, using
`services.signalSaveTodo`. We will see shortly how that is implemented. Finally, `Saved` causes the
`ClearForm` action, so that the form is cleared out after the user has saved a todo.


## TodoForm.Feature

As we did for `TodoList`, `TodoForm.Feature` is where we assemble the feature:

[TodoForm/Feature.elm](TodoForm/Feature.elm)
```elm
type alias Config =
  { inputs : List (Signal.Signal Action)
  , outputs :
      { onSaveTodo : List (Signal.Address (Maybe Todo))
      }
  }


createTodoFormFeature : Config -> App Model
createTodoFormFeature config =
  start
    { init = initialModelAndEffects
    , update =
        update
          { saveTodo = saveTodo
          , signalSaveTodo = broadcast config.outputs.onSaveTodo
          }
    , view = view
    , inputs = config.inputs
    }

```

`TodoForm` outputs `Maybe Todo` to listeners that are interested in being notified when a todo has
been saved. You can see that the implementation of `signalSaveTodo` is
`broadcast config.outputs.onSaveTodo`, using the same `broadcast` function from `Library.Util` that
we saw in
[part 1](https://github.com/foxdonut/adventures-reactive-web-dev/tree/elm-010-todolist-feature/client-elm).
Since `onSaveTodo` is a list of addresses, multiple listeners can register with `TodoForm` and be
notified.


