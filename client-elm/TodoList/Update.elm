module TodoList.Update (initialModelAndEffects, update) where

import Common.Model exposing (Todo)
import Effects exposing (Effects, Never)
import Library.Util exposing (actionEffect)
import Task exposing (Task)
import TodoList.Action exposing (Action(NoOp, LoadList, ShowList, UpdateList, EditTodo, DeleteTodo, DeletedTodo))
import TodoList.Model exposing (Model, initialModel)


type alias Services =
  { loadTodos : Task Never Model
  , deleteTodo : Int -> Task Never (Maybe Int)
  , signalEditTodo : Todo -> Action -> Effects Action
  , signalUpdatedList : List Todo -> Action -> Effects Action
  }


initialModelAndEffects : ( Model, Effects Action )
initialModelAndEffects =
  ( initialModel, Effects.none )


updateTodos : List Todo -> Todo -> List Todo
updateTodos todos todo =
  let
    existingTodo =
      List.filter (\td -> td.id == todo.id) todos

    updateTodo td =
      if td.id == todo.id then
        todo
      else
        td

    updatedTodos =
      case List.length existingTodo == 0 of
        True ->
          List.append todos [ todo ]

        False ->
          List.map updateTodo todos
  in
    updatedTodos


update : Services -> Action -> Model -> ( Model, Effects Action )
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

    UpdateList maybeTodo ->
      let
        updatedModel =
          case maybeTodo of
            Just todo ->
              let
                updatedTodos =
                  updateTodos model.todos todo
              in
                { model | todos = updatedTodos }

            Nothing ->
              { model | message = "Sorry, an error occurred." }
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
            updatedTodos =
              List.filter (\td -> td.id /= todoId) model.todos

            updatedModel =
              { model | todos = updatedTodos, message = "" }
          in
            ( updatedModel, actionEffect (ShowList updatedModel) )

        Nothing ->
          ( { model | message = "An error occured when deleting a Todo." }, Effects.none )

