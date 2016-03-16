module TodoList.Update (initialModelAndEffects, update) where

import Common.Model exposing (Todo)
import Effects exposing (Effects, Never)
import Library.Util exposing (actionEffect)
import Task exposing (Task)
import TodoList.Action exposing (Action(NoOp, LoadList, ShowList, UpdateList, EditTodo, DeleteTodo, DeletedTodo))
import TodoList.Model exposing (Model, initialModel)


type alias Tasks =
  { loadTodos : Task Never Model
  , deleteTodo : Int -> Task Never (Maybe Int)
  , signalEditTodo : Action -> Todo -> Effects Action
  , signalUpdatedList : Action -> List Todo -> Effects Action
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


update : Tasks -> Action -> Model -> ( Model, Effects Action )
update tasks action model =
  case action of
    NoOp ->
      ( model, Effects.none )

    LoadList ->
      ( { todos = []
        , message = "Loading, please wait..."
        }
      , Effects.task (tasks.loadTodos |> Task.map ShowList)
      )

    ShowList list ->
      ( list, tasks.signalUpdatedList NoOp list.todos )

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
      ( model, tasks.signalEditTodo NoOp todo )

    DeleteTodo todoId ->
      ( { model | message = "Deleting, please wait..." }
      , Effects.task (tasks.deleteTodo todoId |> Task.map DeletedTodo)
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

