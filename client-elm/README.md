# Adding the TodoForm Feature

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

## TodoForm.Model

```elm
type alias Model =
  { todo : Todo
  }


initialModel : Model
initialModel =
  { todo = blankTodo
  }
```

## TodoForm.Action

```elm
type Action
  = NoOp
  | Edit Todo
  | ClearForm
  | Save Todo
  | Saved (Maybe Todo)
```

## TodoForm.Service

`TodoForm.Service` exposes the `saveTodo` function:

```elm
saveTodo : Todo -> Task Never (Maybe Todo)
```
[Full source of TodoForm/Service.elm](TodoForm/Service.elm)

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

```elm
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

    Saved todo ->
      ( model, services.signalSaveTodo todo ClearForm )

```
[Full source of TodoForm/Update.elm](TodoForm/Update.elm)


## TodoForm.Feature


